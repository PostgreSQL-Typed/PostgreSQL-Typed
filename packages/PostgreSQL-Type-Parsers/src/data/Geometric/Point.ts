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

interface PointObject {
	x: number;
	y: number;
}

interface Point {
	x: number;
	y: number;

	toString(): string;
	toJSON(): PointObject;

	equals(string: string): boolean;
	equals(object: Point | PointObject): boolean;
	equals(x: number, y: number): boolean;
	safeEquals(string: string): SafeEquals<Point>;
	safeEquals(object: Point | PointObject): SafeEquals<Point>;
	safeEquals(x: number, y: number): SafeEquals<Point>;
}

interface PointConstructor {
	from(string: string): Point;
	from(object: Point | PointObject): Point;
	from(x: number, y: number): Point;
	safeFrom(string: string): SafeFrom<Point>;
	safeFrom(object: Point | PointObject): SafeFrom<Point>;
	safeFrom(x: number, y: number): SafeFrom<Point>;
	/**
	 * Returns `true` if `obj` is a `Point`, `false` otherwise.
	 */
	isPoint(obj: any): obj is Point;
}

class PointConstructorClass extends PGTPConstructorBase<Point> implements PointConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Point> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.number, ParsedType.nan, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(arg);

		if (parsedType !== ParsedType.number && parsedType !== ParsedType.nan && ctx.data.length !== 1) {
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
			case "number":
			case "nan":
				return this._parseNumber(ctx, arg as number, otherArgs);
			default:
				return this._parseObject(ctx, arg as object);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Point> {
		// Remove all whitespace
		arg = arg.replaceAll(/\s/g, "");

		if (arg.match(/^\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)$/)) {
			const [x, y] = arg
				.slice(1, -1)
				.split(",")
				.map(c => parseFloat(c));
			return OK(new PointClass(x, y));
		}

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE (x,y)",
		});
		return INVALID;
	}

	private _parseNumber(ctx: ParseContext, arg: number, otherArgs: any[]): ParseReturnType<Point> {
		const totalLength = otherArgs.length + 1;
		if (totalLength !== 2) {
			this.setIssueForContext(
				ctx,
				totalLength > 2
					? {
							code: "too_big",
							type: "arguments",
							maximum: 2,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 2,
							exact: true,
					  }
			);
			return INVALID;
		}

		for (const otherArg of otherArgs) {
			const allowedTypes = [ParsedType.number, ParsedType.nan],
				parsedType = getParsedType(otherArg);

			if (!isOneOf(allowedTypes, parsedType)) {
				this.setIssueForContext(ctx, {
					code: "invalid_type",
					expected: allowedTypes as ParsedType[],
					received: parsedType,
				});
				return INVALID;
			}
		}

		const [x, y] = [arg, ...otherArgs] as number[];
		return OK(new PointClass(x, y));
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Point> {
		if (this.isPoint(arg)) return OK(new PointClass(arg.x, arg.y));
		const parsedObject = hasKeys<PointObject>(arg, [
			["x", ["number", "nan"]],
			["y", ["number", "nan"]],
		]);
		if (parsedObject.success) return OK(new PointClass(parsedObject.obj.x, parsedObject.obj.y));

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

	isPoint(obj: any): obj is Point {
		return obj instanceof PointClass;
	}
}

const Point: PointConstructor = new PointConstructorClass();

class PointClass extends PGTPBase<Point> implements Point {
	constructor(private _x: number, private _y: number) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Point }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Point.safeFrom(...ctx.data);
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
		return `(${this._x},${this._y})`;
	}

	toJSON(): PointObject {
		return {
			x: this._x,
			y: this._y,
		};
	}

	get x(): number {
		return this._x;
	}

	set x(x: number) {
		const parsedType = getParsedType(x);
		if (parsedType !== ParsedType.number && parsedType !== ParsedType.nan) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._x = x;
	}

	get y(): number {
		return this._y;
	}

	set y(y: number) {
		const parsedType = getParsedType(y);
		if (parsedType !== ParsedType.number && parsedType !== ParsedType.nan) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._y = y;
	}
}

types.setTypeParser(DataType.point as any, parser(Point));
types.setTypeParser(DataType._point as any, arrayParser(Point));

export { Point, PointObject };
