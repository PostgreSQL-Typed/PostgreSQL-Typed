import { types } from "pg";
import { DataType } from "postgresql-data-types";

import type { ParseContext } from "../../types/ParseContext";
import type { ParseReturnType } from "../../types/ParseReturnType";
import type { SafeEquals } from "../../types/SafeEquals";
import type { SafeFrom } from "../../types/SafeFrom";
import { arrayParser } from "../../util/arrayParser";
import { getParsedType, ParsedType } from "../../util/getParsedType";
import { hasKeys } from "../../util/hasKeys";
import { isOneOf } from "../../util/isOneOf";
import { parser } from "../../util/parser";
import { PGTPBase } from "../../util/PGTPBase";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase";
import { throwPGTPError } from "../../util/throwPGTPError";
import { INVALID, OK } from "../../util/validation";
import { Point, PointObject } from "./Point";

interface PolygonObject {
	points: Point[];
}

interface RawPolygonObject {
	points: PointObject[];
}

interface Polygon {
	points: Point[];

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
	 * Returns `true` if `obj` is a `Polygon`, `false` otherwise.
	 */
	isPolygon(obj: any): obj is Polygon;
}

class PolygonConstructorClass extends PGTPConstructorBase<Polygon> implements PolygonConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Polygon> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.string, ParsedType.object, ParsedType.array],
			parsedType = getParsedType(arg);

		if (parsedType !== ParsedType.object && ctx.data.length !== 1) {
			this.setIssueForContext(
				ctx,
				ctx.data.length > 1
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
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(ctx, arg as string);
			case "array":
				return this._parseArray(ctx, arg as unknown[]);
			default:
				return this._parseObject(ctx, arg as object, otherArgs);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Polygon> {
		// Remove all whitespace
		arg = arg.replaceAll(/\s/g, "");

		if (arg.match(/^\(?\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)(,\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\))*\)?$/)) {
			if (arg.startsWith("((") && arg.endsWith("))")) arg = arg.slice(1, -1);
			const points = arg
					.split("),(")
					.join("), (")
					.split(", ")
					.map(p => Point.safeFrom(p)),
				invalidPoint = points.find(p => !p.success);

			/* c8 ignore start */
			if (invalidPoint?.success === false) {
				this.setIssueForContext(ctx, invalidPoint.error.issue);
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

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE ((x,y),...)",
		});
		return INVALID;
	}

	private _parseArray(ctx: ParseContext, arg: unknown[]): ParseReturnType<Polygon> {
		if (arg.length < 1) {
			this.setIssueForContext(ctx, {
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
			});
			return INVALID;
		}

		const points = arg.map(point => Point.safeFrom(point as string)),
			invalidPoint = points.find(point => !point.success);

		if (invalidPoint?.success === false) {
			this.setIssueForContext(ctx, invalidPoint.error.issue);
			return INVALID;
		}

		return OK(
			new PolygonClass(
				//@ts-expect-error - They are all valid at this point
				points.map(range => range.data)
			)
		);
	}

	private _parseObject(ctx: ParseContext, arg: object, otherArgs: unknown[]): ParseReturnType<Polygon> {
		// Input should be [Polygon]
		if (Polygon.isPolygon(arg)) {
			if (otherArgs.length > 0) {
				this.setIssueForContext(ctx, {
					code: "too_big",
					type: "arguments",
					maximum: 1,
					exact: true,
				});
				return INVALID;
			}
			return OK(new PolygonClass(arg.points));
		}

		// Input should be [Point, ...]
		if (Point.isPoint(arg)) {
			const points = otherArgs.map(point => Point.safeFrom(point as string)),
				invalidPoint = points.find(point => !point.success);

			if (invalidPoint?.success === false) {
				this.setIssueForContext(ctx, invalidPoint.error.issue);
				return INVALID;
			}

			return OK(
				new PolygonClass(
					//@ts-expect-error - They are all valid at this point
					[arg, ...points.map(range => range.data)]
				)
			);
		}

		// Input should be [PolygonObject | RawPolygonObject]
		if (otherArgs.length > 0) {
			this.setIssueForContext(ctx, {
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
			});
			return INVALID;
		}

		const parsedObject = hasKeys<PolygonObject | RawPolygonObject>(arg, [["points", "array"]]);
		if (!parsedObject.success) {
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				case parsedObject.missingKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					this.setIssueForContext(ctx, {
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
			this.setIssueForContext(ctx, invalidPoint.error.issue);
			return INVALID;
		}

		if (parsedPoints.length < 1) {
			this.setIssueForContext(ctx, {
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
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

	isPolygon(obj: any): obj is Polygon {
		return obj instanceof PolygonClass;
	}
}

const Polygon: PolygonConstructor = new PolygonConstructorClass();

class PolygonClass extends PGTPBase<Polygon> implements Polygon {
	constructor(private _points: Point[]) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Polygon }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Polygon.safeFrom(...ctx.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(ctx, parsed.error.issue);
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
			throwPGTPError({
				code: "invalid_type",
				expected: "array",
				received: parsedType,
			});
		}

		if (points.length < 1) {
			throwPGTPError({
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
			});
		}

		const finalPoints = points.map(point => Point.safeFrom(point)),
			invalidPoint = finalPoints.find(point => !point.success);

		if (invalidPoint?.success === false) throwPGTPError(invalidPoint.error.issue);

		//@ts-expect-error - They are all valid at this point
		this._points = finalPoints.map(point => point.data);
	}
}

types.setTypeParser(DataType.polygon as any, parser(Polygon));
types.setTypeParser(DataType._polygon as any, arrayParser(Polygon));

export { Polygon, PolygonObject, RawPolygonObject };
