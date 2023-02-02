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

interface CircleObject {
	x: number;
	y: number;
	radius: number;
}

interface Circle {
	x: number;
	y: number;
	radius: number;

	toString(): string;
	toJSON(): CircleObject;

	equals(string: string): boolean;
	equals(object: Circle | CircleObject): boolean;
	equals(x: number, y: number, radius: number): boolean;
	safeEquals(string: string): SafeEquals<Circle>;
	safeEquals(object: Circle | CircleObject): SafeEquals<Circle>;
	safeEquals(x: number, y: number, radius: number): SafeEquals<Circle>;
}

interface CircleConstructor {
	from(string: string): Circle;
	from(object: Circle | CircleObject): Circle;
	from(x: number, y: number, radius: number): Circle;
	safeFrom(string: string): SafeFrom<Circle>;
	safeFrom(object: Circle | CircleObject): SafeFrom<Circle>;
	safeFrom(x: number, y: number, radius: number): SafeFrom<Circle>;
	/**
	 * Returns `true` if `obj` is a `Circle`, `false` otherwise.
	 */
	isCircle(obj: any): obj is Circle;
}

class CircleConstructorClass extends PGTPConstructorBase<Circle> implements CircleConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Circle> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(arg);

		if (parsedType !== ParsedType.number && ctx.data.length !== 1) {
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
				return this._parseNumber(ctx, arg as number, otherArgs);
			default:
				return this._parseObject(ctx, arg as object);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Circle> {
		// Remove all whitespace
		arg = arg.replaceAll(/\s/g, "");

		if (arg.match(/^[<(]?\(?(?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)?,(?:\d+(\.\d+)?|NaN)[>)]?$/)) {
			if (
				(arg.startsWith("<") && !arg.endsWith(">")) ||
				(arg.endsWith(">") && !arg.startsWith("<")) ||
				(arg.startsWith("((") && !arg.endsWith(")")) ||
				(arg.endsWith(")") && !arg.startsWith("(("))
			) {
				this.setIssueForContext(ctx, {
					code: "invalid_string",
					received: arg,
					expected: "LIKE <(x,y),radius>",
				});
				return INVALID;
			}

			if (arg.startsWith("<(") || arg.startsWith("((")) arg = arg.slice(2);
			if (arg.endsWith(")>") || arg.endsWith("))")) arg = arg.slice(0, -1);
			const [x, y, radius] = arg.split(",").map(c => parseFloat(c));
			return OK(new CircleClass(x, y, radius));
		}

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE <(x,y),radius>",
		});
		return INVALID;
	}

	private _parseNumber(ctx: ParseContext, arg: number, otherArgs: any[]): ParseReturnType<Circle> {
		const totalLength = otherArgs.length + 1;
		if (totalLength !== 3) {
			this.setIssueForContext(
				ctx,
				totalLength > 3
					? {
							code: "too_big",
							type: "arguments",
							maximum: 3,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 3,
							exact: true,
					  }
			);
			return INVALID;
		}

		for (const otherArg of otherArgs) {
			const allowedTypes = [ParsedType.number],
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

		const [x, y, radius] = [arg, ...otherArgs] as number[];
		return OK(new CircleClass(x, y, radius));
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Circle> {
		if (this.isCircle(arg)) return OK(new CircleClass(arg.x, arg.y, arg.radius));
		const parsedObject = hasKeys<CircleObject>(arg, [
			["x", "number"],
			["y", "number"],
			["radius", "number"],
		]);
		if (parsedObject.success) return OK(new CircleClass(parsedObject.obj.x, parsedObject.obj.y, parsedObject.obj.radius));

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

	isCircle(obj: any): obj is Circle {
		return obj instanceof CircleClass;
	}
}

const Circle: CircleConstructor = new CircleConstructorClass();

class CircleClass extends PGTPBase<Circle> implements Circle {
	constructor(private _x: number, private _y: number, private _radius: number) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Circle }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Circle.safeFrom(...ctx.data);
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
		return `<(${this._x},${this._y}),${this._radius}>`;
	}

	toJSON(): CircleObject {
		return {
			x: this._x,
			y: this._y,
			radius: this._radius,
		};
	}

	get x(): number {
		return this._x;
	}

	set x(x: number) {
		const parsedType = getParsedType(x);
		if (parsedType !== ParsedType.number) {
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
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._y = y;
	}

	get radius(): number {
		return this._radius;
	}

	set radius(radius: number) {
		const parsedType = getParsedType(radius);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._radius = radius;
	}
}

types.setTypeParser(DataType.circle as any, parser(Circle));
types.setTypeParser(DataType._circle as any, arrayParser(Circle));

export { Circle, CircleObject };
