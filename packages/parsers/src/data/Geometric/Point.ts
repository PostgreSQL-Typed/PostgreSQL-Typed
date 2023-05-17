import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";

interface PointObject {
	x: number;
	y: number;
}

interface Point {
	x: number;
	y: number;

	value: string;
	postgres: string;

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
	 * Returns `true` if `object` is a `Point`, `false` otherwise.
	 */
	isPoint(object: any): object is Point;
}

class PointConstructorClass extends PGTPConstructorBase<Point> implements PointConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Point> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.nan, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.number && parsedType !== ParsedType.nan && context.data.length !== 1) {
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
			case "number":
			case "nan":
				return this._parseNumber(context, argument as number, otherArguments);
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Point> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (/^\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)$/.test(argument)) {
			const [x, y] = argument
				.slice(1, -1)
				.split(",")
				.map(c => Number.parseFloat(c));
			return OK(new PointClass(x, y));
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE (x,y)",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Point> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 2) {
			this.setIssueForContext(
				context,
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

		for (const otherArgument of otherArguments) {
			const allowedTypes = [ParsedType.number, ParsedType.nan],
				parsedType = getParsedType(otherArgument);

			if (!isOneOf(allowedTypes, parsedType)) {
				this.setIssueForContext(context, {
					code: "invalid_type",
					expected: allowedTypes as ParsedType[],
					received: parsedType,
				});
				return INVALID;
			}
		}

		const [x, y] = [argument, ...otherArguments] as number[];
		return OK(new PointClass(x, y));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Point> {
		if (this.isPoint(argument)) return OK(new PointClass(argument.x, argument.y));
		const parsedObject = hasKeys<PointObject>(argument, [
			["x", ["number", "nan"]],
			["y", ["number", "nan"]],
		]);
		if (parsedObject.success) return OK(new PointClass(parsedObject.obj.x, parsedObject.obj.y));

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

	isPoint(object: any): object is Point {
		return object instanceof PointClass;
	}
}

const Point: PointConstructor = new PointConstructorClass();

class PointClass extends PgTPBase<Point> implements Point {
	constructor(private _x: number, private _y: number) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Point }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Point.safeFrom(...context.data);
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

	get value(): string {
		return this.toString();
	}

	set value(point: string) {
		const parsed = Point.safeFrom(point);
		if (parsed.success) {
			this._x = parsed.data.x;
			this._y = parsed.data.y;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(point: string) {
		const parsed = Point.safeFrom(point);
		if (parsed.success) {
			this._x = parsed.data.x;
			this._y = parsed.data.y;
		} else throw parsed.error;
	}
}

export { Point, PointConstructor, PointObject };
