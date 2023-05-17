import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { Point, PointObject } from "./Point.js";

enum Connection {
	open = "open",
	closed = "closed",
}
type ConnectionType = "open" | "closed";

// [] = open, () = closed
const connections = ["open", "closed"];

interface PathObject {
	points: Point[];
	connection: Connection | ConnectionType;
}

interface RawPathObject {
	points: PointObject[];
	connection: Connection | ConnectionType;
}

interface Path {
	points: Point[];
	connection: Connection | ConnectionType;

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): RawPathObject;

	equals(string: string): boolean;
	equals(points: Point[]): boolean;
	equals(point: Point, ...points: Point[]): boolean;
	equals(path: Path): boolean;
	equals(object: PathObject | RawPathObject): boolean;
	safeEquals(string: string): SafeEquals<Path>;
	safeEquals(points: Point[]): SafeEquals<Path>;
	safeEquals(point: Point, ...points: Point[]): SafeEquals<Path>;
	safeEquals(path: Path): SafeEquals<Path>;
	safeEquals(object: PathObject | RawPathObject): SafeEquals<Path>;
}

interface PathConstructor {
	from(string: string): Path;
	from(points: Point[]): Path;
	from(point: Point, ...points: Point[]): Path;
	from(path: Path): Path;
	from(object: PathObject | RawPathObject): Path;
	safeFrom(string: string): SafeFrom<Path>;
	safeFrom(points: Point[]): SafeFrom<Path>;
	safeFrom(point: Point, ...points: Point[]): SafeFrom<Path>;
	safeFrom(path: Path): SafeFrom<Path>;
	safeFrom(object: PathObject | RawPathObject): SafeFrom<Path>;
	/**
	 * Returns `true` if `object` is a `Path`, `false` otherwise.
	 */
	isPath(object: any): object is Path;
}

class PathConstructorClass extends PgTPConstructorBase<Path> implements PathConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Path> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.string, ParsedType.object, ParsedType.array],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.object && context.data.length !== 1) {
			this.setIssueForContext(
				context,
				context.data.length > 1
					? {
							code: "too_big",
							type: "arguments",
							maximum: 1,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 1,
							exact: true,
					  }
			);
			return INVALID;
		}

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(context, argument as string);
			case "array":
				return this._parseArray(context, argument as unknown[]);
			default:
				return this._parseObject(context, argument as object, otherArguments);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Path> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (/^\(\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)(,\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\))*\)$/.test(argument)) {
			const points = argument
					.slice(1, -1)
					.split("),(")
					.join("), (")
					.split(", ")
					.map(p => Point.safeFrom(p)),
				invalidPoint = points.find(p => !p.success);

			/* c8 ignore start */
			if (invalidPoint?.success === false) {
				this.setIssueForContext(context, invalidPoint.error.issue);
				return INVALID;
			}
			/* c8 ignore stop */

			return OK(
				new PathClass(
					//@ts-expect-error - They are all valid at this point
					points.map(range => range.data),
					Connection.closed
				)
			);
		} else if (/^\[\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)(,\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\))*]$/.test(argument)) {
			const points = argument
					.slice(1, -1)
					.split("),(")
					.join("), (")
					.split(", ")
					.map(point => Point.safeFrom(point)),
				invalidPoint = points.find(point => !point.success);

			/* c8 ignore start */
			if (invalidPoint?.success === false) {
				this.setIssueForContext(context, invalidPoint.error.issue);
				return INVALID;
			}
			/* c8 ignore stop */

			return OK(
				new PathClass(
					//@ts-expect-error - They are all valid at this point
					points.map(range => range.data),
					Connection.open
				)
			);
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE ((x,y),...) || [(x,y),...]",
		});
		return INVALID;
	}

	private _parseArray(context: ParseContext, argument: unknown[]): ParseReturnType<Path> {
		if (argument.length === 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
			});
			return INVALID;
		}

		const points = argument.map(point => Point.safeFrom(point as string)),
			invalidPoint = points.find(point => !point.success);

		if (invalidPoint?.success === false) {
			this.setIssueForContext(context, invalidPoint.error.issue);
			return INVALID;
		}

		return OK(
			new PathClass(
				//@ts-expect-error - They are all valid at this point
				points.map(range => range.data),
				Connection.closed
			)
		);
	}

	private _parseObject(context: ParseContext, argument: object, otherArguments: unknown[]): ParseReturnType<Path> {
		// Input should be [Path]
		if (Path.isPath(argument)) {
			if (otherArguments.length > 0) {
				this.setIssueForContext(context, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}
			return OK(new PathClass(argument.points, argument.connection));
		}

		// Input should be [Point, ...]
		if (Point.isPoint(argument)) {
			const points = otherArguments.map(point => Point.safeFrom(point as string)),
				invalidPoint = points.find(point => !point.success);

			if (invalidPoint?.success === false) {
				this.setIssueForContext(context, invalidPoint.error.issue);
				return INVALID;
			}

			return OK(
				new PathClass(
					//@ts-expect-error - They are all valid at this point
					[argument, ...points.map(range => range.data)],
					Connection.closed
				)
			);
		}

		// Input should be [PathObject | RawPathObject]
		if (otherArguments.length > 0) {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
			});
			return INVALID;
		}

		const parsedObject = hasKeys<PathObject | RawPathObject>(argument, [
			["points", "array"],
			["connection", "string"],
		]);
		if (!parsedObject.success) {
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					this.setIssueForContext(context, {
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				case parsedObject.missingKeys.length > 0:
					this.setIssueForContext(context, {
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					this.setIssueForContext(context, {
						code: "invalid_key_type",
						...parsedObject.invalidKeys[0],
					});
					break;
			}
			return INVALID;
		}

		const { points, connection } = parsedObject.obj,
			parsedPoints = points.map(point => Point.safeFrom(point)),
			invalidPoint = parsedPoints.find(point => !point.success);

		if (invalidPoint?.success === false) {
			this.setIssueForContext(context, invalidPoint.error.issue);
			return INVALID;
		}

		if (parsedPoints.length === 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
			});
			return INVALID;
		}

		if (!connections.includes(connection)) {
			this.setIssueForContext(context, {
				code: "invalid_string",
				expected: connections,
				received: connection,
			});
			return INVALID;
		}

		return OK(
			new PathClass(
				//@ts-expect-error - They are all valid at this point
				parsedPoints.map(range => range.data),
				connection as Connection
			)
		);
	}

	isPath(object: any): object is Path {
		return object instanceof PathClass;
	}
}

const Path: PathConstructor = new PathConstructorClass();

class PathClass extends PgTPBase<Path> implements Path {
	constructor(private _points: Point[], private _connection: Connection | ConnectionType) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Path }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Path.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._connection === Connection.closed ? `(${this._points.map(p => p.toString()).join(",")})` : `[${this._points.map(p => p.toString()).join(",")}]`;
	}

	toJSON(): RawPathObject {
		return {
			points: this._points.map(p => p.toJSON()),
			connection: this._connection,
		};
	}

	get points(): Point[] {
		return this._points;
	}

	set points(points: Point[]) {
		const parsedType = getParsedType(points);
		if (parsedType !== "array") {
			throwPgTPError({
				code: "invalid_type",
				expected: "array",
				received: parsedType,
			});
		}

		if (points.length === 0) {
			throwPgTPError({
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
			});
		}

		const finalPoints = points.map(point => Point.safeFrom(point)),
			invalidPoint = finalPoints.find(point => !point.success);

		if (invalidPoint?.success === false) throwPgTPError(invalidPoint.error.issue);

		//@ts-expect-error - They are all valid at this point
		this._points = finalPoints.map(point => point.data);
	}

	get connection(): Connection | ConnectionType {
		return this._connection;
	}

	set connection(connection: Connection | ConnectionType) {
		const parsedType = getParsedType(connection);
		if (parsedType !== "string") {
			throwPgTPError({
				code: "invalid_type",
				expected: "string",
				received: parsedType,
			});
		}

		if (!connections.includes(connection)) {
			throwPgTPError({
				code: "invalid_string",
				expected: connections,
				received: connection,
			});
		}

		this._connection = connection;
	}

	get value(): string {
		return this.toString();
	}

	set value(path: string) {
		const parsed = Path.safeFrom(path);
		if (parsed.success) {
			this._connection = parsed.data.connection;
			this._points = parsed.data.points;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(path: string) {
		const parsed = Path.safeFrom(path);
		if (parsed.success) {
			this._connection = parsed.data.connection;
			this._points = parsed.data.points;
		} else throw parsed.error;
	}
}

export { Connection, ConnectionType, Path, PathConstructor, PathObject, RawPathObject };
