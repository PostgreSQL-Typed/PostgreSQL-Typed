import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";

interface BoxObject {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

interface Box {
	x1: number;
	y1: number;
	x2: number;
	y2: number;

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): BoxObject;

	equals(string: string): boolean;
	equals(object: Box | BoxObject): boolean;
	equals(x1: number, y1: number, x2: number, y2: number): boolean;
	safeEquals(string: string): SafeEquals<Box>;
	safeEquals(object: Box | BoxObject): SafeEquals<Box>;
	safeEquals(x1: number, y1: number, x2: number, y2: number): SafeEquals<Box>;
}

interface BoxConstructor {
	from(string: string): Box;
	from(object: Box | BoxObject): Box;
	from(x1: number, y1: number, x2: number, y2: number): Box;
	safeFrom(string: string): SafeFrom<Box>;
	safeFrom(object: Box | BoxObject): SafeFrom<Box>;
	safeFrom(x1: number, y1: number, x2: number, y2: number): SafeFrom<Box>;
	/**
	 * Returns `true` if `object` is a `Box`, `false` otherwise.
	 */
	isBox(object: any): object is Box;
}

class BoxConstructorClass extends PgTPConstructorBase<Box> implements BoxConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Box> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.number && context.data.length !== 1) {
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
			case "number":
				return this._parseNumber(context, argument as number, otherArguments);
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Box> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (argument.startsWith("((") && argument.endsWith("))")) argument = argument.slice(1, -1);

		if (/^\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\),\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)$/.test(argument)) {
			const [x1, y1, x2, y2] = argument.split(",").map(c => Number.parseFloat(c.replace("(", "")));
			return OK(new BoxClass(x1, y1, x2, y2));
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			expected: "LIKE (x1,y1),(x2,y2)",
			received: argument,
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Box> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 4) {
			this.setIssueForContext(
				context,
				totalLength > 4
					? {
							code: "too_big",
							exact: true,
							maximum: 4,
							received: totalLength,
							type: "arguments",
					  }
					: {
							code: "too_small",
							exact: true,
							minimum: 4,
							received: totalLength,
							type: "arguments",
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

		const [x1, y1, x2, y2] = [argument, ...otherArguments] as number[];
		return OK(new BoxClass(x1, y1, x2, y2));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Box> {
		if (this.isBox(argument)) return OK(new BoxClass(argument.x1, argument.y1, argument.x2, argument.y2));
		const parsedObject = hasKeys<BoxObject>(argument, [
			["x1", "number"],
			["y1", "number"],
			["x2", "number"],
			["y2", "number"],
		]);
		if (parsedObject.success) return OK(new BoxClass(parsedObject.obj.x1, parsedObject.obj.y1, parsedObject.obj.x2, parsedObject.obj.y2));

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

	isBox(object: any): object is Box {
		return object instanceof BoxClass;
	}
}

const Box: BoxConstructor = new BoxConstructorClass();

class BoxClass extends PgTPBase<Box> implements Box {
	constructor(
		private _x1: number,
		private _y1: number,
		private _x2: number,
		private _y2: number
	) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Box }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Box.safeFrom(...context.data);
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
		return `(${this._x1},${this._y1}),(${this._x2},${this._y2})`;
	}

	toJSON(): BoxObject {
		return {
			x1: this._x1,
			x2: this._x2,
			y1: this._y1,
			y2: this._y2,
		};
	}

	get x1(): number {
		return this._x1;
	}

	set x1(x1: number) {
		const parsedType = getParsedType(x1);
		if (parsedType !== ParsedType.number) {
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._x1 = x1;
	}

	get y1(): number {
		return this._y1;
	}

	set y1(y1: number) {
		const parsedType = getParsedType(y1);
		if (parsedType !== ParsedType.number) {
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._y1 = y1;
	}

	get x2(): number {
		return this._x2;
	}

	set x2(x2: number) {
		const parsedType = getParsedType(x2);
		if (parsedType !== ParsedType.number) {
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._x2 = x2;
	}

	get y2(): number {
		return this._y2;
	}

	set y2(y2: number) {
		const parsedType = getParsedType(y2);
		if (parsedType !== ParsedType.number) {
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._y2 = y2;
	}

	get value(): string {
		return this.toString();
	}

	set value(box: string) {
		const parsed = Box.safeFrom(box);
		if (parsed.success) {
			this._x1 = parsed.data.x1;
			this._y1 = parsed.data.y1;
			this._x2 = parsed.data.x2;
			this._y2 = parsed.data.y2;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(box: string) {
		const parsed = Box.safeFrom(box);
		if (parsed.success) {
			this._x1 = parsed.data.x1;
			this._y1 = parsed.data.y1;
			this._x2 = parsed.data.x2;
			this._y2 = parsed.data.y2;
		} else throw parsed.error;
	}
}

function isBox(object: any): object is Box | BoxConstructor {
	return object instanceof BoxClass || object instanceof BoxConstructorClass;
}

export { Box, BoxConstructor, BoxObject, isBox };
