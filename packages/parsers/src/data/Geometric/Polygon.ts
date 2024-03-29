import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { Point, PointObject } from "./Point.js";

interface PolygonObject {
	points: Point[];
}

interface RawPolygonObject {
	points: PointObject[];
}

interface Polygon {
	points: Point[];

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): RawPolygonObject;

	equals(string: string): boolean;
	equals(points: Point[]): boolean;
	equals(point: Point, ...points: Point[]): boolean;
	equals(polygon: Polygon): boolean;
	equals(object: PolygonObject | RawPolygonObject): boolean;
	safeEquals(string: string): SafeEquals<Polygon>;
	safeEquals(points: Point[]): SafeEquals<Polygon>;
	safeEquals(point: Point, ...points: Point[]): SafeEquals<Polygon>;
	safeEquals(polygon: Polygon): SafeEquals<Polygon>;
	safeEquals(object: PolygonObject | RawPolygonObject): SafeEquals<Polygon>;
}

interface PolygonConstructor {
	from(string: string): Polygon;
	from(points: Point[]): Polygon;
	from(point: Point, ...points: Point[]): Polygon;
	from(polygon: Polygon): Polygon;
	from(object: PolygonObject | RawPolygonObject): Polygon;
	safeFrom(string: string): SafeFrom<Polygon>;
	safeFrom(points: Point[]): SafeFrom<Polygon>;
	safeFrom(point: Point, ...points: Point[]): SafeFrom<Polygon>;
	safeFrom(polygon: Polygon): SafeFrom<Polygon>;
	safeFrom(object: PolygonObject | RawPolygonObject): SafeFrom<Polygon>;
	/**
	 * Returns `true` if `object` is a `Polygon`, `false` otherwise.
	 */
	isPolygon(object: any): object is Polygon;
}

class PolygonConstructorClass extends PgTPConstructorBase<Polygon> implements PolygonConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Polygon> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.string, ParsedType.object, ParsedType.array],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.object && context.data.length !== 1) {
			this.setIssueForContext(
				context,
				context.data.length > 1
					? {
							code: "too_big",
							exact: true,
							maximum: 1,
							received: context.data.length,
							type: "arguments",
					  }
					: {
							code: "too_small",
							exact: true,
							minimum: 1,
							received: context.data.length,
							type: "arguments",
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Polygon> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (/^\(?\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)(,\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\))*\)?$/.test(argument)) {
			if (argument.startsWith("((") && argument.endsWith("))")) argument = argument.slice(1, -1);
			const points = argument
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
				new PolygonClass(
					//@ts-expect-error - They are all valid at this point
					points.map(range => range.data)
				)
			);
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			expected: "LIKE ((x,y),...)",
			received: argument,
		});
		return INVALID;
	}

	private _parseArray(context: ParseContext, argument: unknown[]): ParseReturnType<Polygon> {
		if (argument.length === 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: argument.length,
				type: "array",
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
			new PolygonClass(
				//@ts-expect-error - They are all valid at this point
				points.map(range => range.data)
			)
		);
	}

	private _parseObject(context: ParseContext, argument: object, otherArguments: unknown[]): ParseReturnType<Polygon> {
		// Input should be [Polygon]
		if (Polygon.isPolygon(argument)) {
			if (otherArguments.length > 0) {
				this.setIssueForContext(context, {
					code: "too_big",
					exact: true,
					maximum: 1,
					received: otherArguments.length,
					type: "arguments",
				});
				return INVALID;
			}
			return OK(new PolygonClass(argument.points));
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
				new PolygonClass(
					//@ts-expect-error - They are all valid at this point
					[argument, ...points.map(range => range.data)]
				)
			);
		}

		// Input should be [PolygonObject | RawPolygonObject]
		if (otherArguments.length > 0) {
			this.setIssueForContext(context, {
				code: "too_big",
				exact: true,
				maximum: 1,
				received: otherArguments.length,
				type: "arguments",
			});
			return INVALID;
		}

		const parsedObject = hasKeys<PolygonObject | RawPolygonObject>(argument, [["points", "array"]]);
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

		const { points } = parsedObject.obj,
			parsedPoints = points.map(point => Point.safeFrom(point)),
			invalidPoint = parsedPoints.find(point => !point.success);

		if (invalidPoint?.success === false) {
			this.setIssueForContext(context, invalidPoint.error.issue);
			return INVALID;
		}

		if (parsedPoints.length === 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: parsedPoints.length,
				type: "array",
			});
			return INVALID;
		}

		return OK(
			new PolygonClass(
				//@ts-expect-error - They are all valid at this point
				parsedPoints.map(range => range.data)
			)
		);
	}

	isPolygon(object: any): object is Polygon {
		return object instanceof PolygonClass;
	}
}

const Polygon: PolygonConstructor = new PolygonConstructorClass();

class PolygonClass extends PgTPBase<Polygon> implements Polygon {
	constructor(private _points: Point[]) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Polygon }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Polygon.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toString() === this.toString(),
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return `(${this._points.map(p => p.toString()).join(",")})`;
	}

	toJSON(): RawPolygonObject {
		return {
			points: this._points.map(p => p.toJSON()),
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
				inclusive: true,
				minimum: 1,
				received: points.length,
				type: "array",
			});
		}

		const finalPoints = points.map(point => Point.safeFrom(point)),
			invalidPoint = finalPoints.find(point => !point.success);

		if (invalidPoint?.success === false) throwPgTPError(invalidPoint.error.issue);

		//@ts-expect-error - They are all valid at this point
		this._points = finalPoints.map(point => point.data);
	}

	get value(): string {
		return this.toString();
	}

	set value(polygon: string) {
		const parsed = Polygon.safeFrom(polygon);
		if (parsed.success) this._points = parsed.data.points;
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(polygon: string) {
		const parsed = Polygon.safeFrom(polygon);
		if (parsed.success) this._points = parsed.data.points;
		else throw parsed.error;
	}
}

export { Polygon, PolygonConstructor, PolygonObject, RawPolygonObject };
