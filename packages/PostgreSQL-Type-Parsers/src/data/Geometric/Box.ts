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
	 * Returns `true` if `obj` is a `Box`, `false` otherwise.
	 */
	isBox(obj: any): obj is Box;
}

class BoxConstructorClass extends PGTPConstructorBase<Box> implements BoxConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Box> {
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

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Box> {
		// Remove all whitespace
		arg = arg.replaceAll(/\s/g, "");

		if (arg.startsWith("((") && arg.endsWith("))")) arg = arg.slice(1, -1);

		if (arg.match(/^\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\),\((?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)\)$/)) {
			const [x1, y1, x2, y2] = arg.split(",").map(c => parseFloat(c.replace("(", "")));
			return OK(new BoxClass(x1, y1, x2, y2));
		}

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE (x1,y1),(x2,y2)",
		});
		return INVALID;
	}

	private _parseNumber(ctx: ParseContext, arg: number, otherArgs: any[]): ParseReturnType<Box> {
		const totalLength = otherArgs.length + 1;
		if (totalLength !== 4) {
			this.setIssueForContext(
				ctx,
				totalLength > 4
					? {
							code: "too_big",
							type: "arguments",
							maximum: 4,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 4,
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

		const [x1, y1, x2, y2] = [arg, ...otherArgs] as number[];
		return OK(new BoxClass(x1, y1, x2, y2));
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Box> {
		if (this.isBox(arg)) return OK(new BoxClass(arg.x1, arg.y1, arg.x2, arg.y2));
		const parsedObject = hasKeys<BoxObject>(arg, [
			["x1", "number"],
			["y1", "number"],
			["x2", "number"],
			["y2", "number"],
		]);
		if (parsedObject.success) return OK(new BoxClass(parsedObject.obj.x1, parsedObject.obj.y1, parsedObject.obj.x2, parsedObject.obj.y2));

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

	isBox(obj: any): obj is Box {
		return obj instanceof BoxClass;
	}
}

const Box: BoxConstructor = new BoxConstructorClass();

class BoxClass extends PGTPBase<Box> implements Box {
	constructor(private _x1: number, private _y1: number, private _x2: number, private _y2: number) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Box }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Box.safeFrom(...ctx.data);
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
		return `(${this._x1},${this._y1}),(${this._x2},${this._y2})`;
	}

	toJSON(): BoxObject {
		return {
			x1: this._x1,
			y1: this._y1,
			x2: this._x2,
			y2: this._y2,
		};
	}

	get x1(): number {
		return this._x1;
	}

	set x1(x1: number) {
		const parsedType = getParsedType(x1);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
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
			throwPGTPError({
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
			throwPGTPError({
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
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._y2 = y2;
	}
}

types.setTypeParser(DataType.box as any, parser(Box));
types.setTypeParser(DataType._box as any, arrayParser(Box, ";"));

export { Box, BoxObject };
