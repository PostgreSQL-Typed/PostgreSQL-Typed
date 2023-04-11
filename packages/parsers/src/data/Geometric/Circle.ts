import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";

interface CircleObject {
	x: number;
	y: number;
	radius: number;
}

interface Circle {
	x: number;
	y: number;
	radius: number;

	value: string;
	postgres: string;

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
	 * Returns `true` if `object` is a `Circle`, `false` otherwise.
	 */
	isCircle(object: any): object is Circle;
}

class CircleConstructorClass extends PGTPConstructorBase<Circle> implements CircleConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Circle> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.number && context.data.length !== 1) {
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
				return this._parseNumber(context, argument as number, otherArguments);
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Circle> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (/^[(<]?\(?(?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)?,(?:\d+(\.\d+)?|NaN)[)>]?$/.test(argument)) {
			if (
				(argument.startsWith("<") && !argument.endsWith(">")) ||
				(argument.endsWith(">") && !argument.startsWith("<")) ||
				(argument.startsWith("((") && !argument.endsWith(")")) ||
				(argument.endsWith(")") && !argument.startsWith("(("))
			) {
				this.setIssueForContext(context, {
					code: "invalid_string",
					received: argument,
					expected: "LIKE <(x,y),radius>",
				});
				return INVALID;
			}

			if (argument.startsWith("<(") || argument.startsWith("((")) argument = argument.slice(2);
			if (argument.endsWith(">") || argument.endsWith(")")) argument = argument.slice(0, -1);
			const [x, y, radius] = argument.split(",").map(c => Number.parseFloat(c));
			return OK(new CircleClass(x, y, radius));
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE <(x,y),radius>",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Circle> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 3) {
			this.setIssueForContext(
				context,
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

		for (const otherArgument of otherArguments) {
			const allowedTypes = [ParsedType.number],
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

		const [x, y, radius] = [argument, ...otherArguments] as number[];
		return OK(new CircleClass(x, y, radius));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Circle> {
		if (this.isCircle(argument)) return OK(new CircleClass(argument.x, argument.y, argument.radius));
		const parsedObject = hasKeys<CircleObject>(argument, [
			["x", "number"],
			["y", "number"],
			["radius", "number"],
		]);
		if (parsedObject.success) return OK(new CircleClass(parsedObject.obj.x, parsedObject.obj.y, parsedObject.obj.radius));

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

	isCircle(object: any): object is Circle {
		return object instanceof CircleClass;
	}
}

const Circle: CircleConstructor = new CircleConstructorClass();

class CircleClass extends PGTPBase<Circle> implements Circle {
	constructor(private _x: number, private _y: number, private _radius: number) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Circle }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Circle.safeFrom(...context.data);
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

	get value(): string {
		return this.toString();
	}

	set value(circle: string) {
		const parsed = Circle.safeFrom(circle);
		if (parsed.success) {
			this._x = parsed.data.x;
			this._y = parsed.data.y;
			this._radius = parsed.data.radius;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(circle: string) {
		const parsed = Circle.safeFrom(circle);
		if (parsed.success) {
			this._x = parsed.data.x;
			this._y = parsed.data.y;
			this._radius = parsed.data.radius;
		} else throw parsed.error;
	}
}

export { Circle, CircleConstructor, CircleObject };
