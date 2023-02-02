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
import { INVALID, OK } from "../../util/validation";

interface Int2Object {
	int2: number;
}

interface Int2 {
	int2: number;

	toString(): string;
	toNumber(): number;
	toJSON(): Int2Object;

	equals(number: number): boolean;
	equals(string: string): boolean;
	equals(object: Int2 | Int2Object): boolean;
	safeEquals(number: number): SafeEquals<Int2>;
	safeEquals(string: string): SafeEquals<Int2>;
	safeEquals(object: Int2 | Int2Object): SafeEquals<Int2>;
}

interface Int2Constructor {
	from(number: number): Int2;
	from(string: string): Int2;
	from(object: Int2 | Int2Object): Int2;
	safeFrom(number: number): SafeFrom<Int2>;
	safeFrom(string: string): SafeFrom<Int2>;
	safeFrom(object: Int2 | Int2Object): SafeFrom<Int2>;
	/**
	 * Returns `true` if `obj` is a `Int2`, `false` otherwise.
	 */
	isInt2(obj: any): obj is Int2;
}

class Int2ConstructorClass extends PGTPConstructorBase<Int2> implements Int2Constructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Int2> {
		if (ctx.data.length !== 1) {
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

		const [arg] = ctx.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(arg);

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.number:
				return this._parseNumber(ctx, arg as number);
			case ParsedType.string:
				return this._parseString(ctx, arg as string);
			default:
				return this._parseObject(ctx, arg as Int2Object);
		}
	}

	private _parseNumber(ctx: ParseContext, arg: number): ParseReturnType<Int2> {
		if (isNaN(arg)) {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: "number",
				received: "nan",
			});
			return INVALID;
		}
		if (!isFinite(arg)) {
			this.setIssueForContext(ctx, {
				code: "not_finite",
			});
			return INVALID;
		}
		if (arg % 1 !== 0) {
			this.setIssueForContext(ctx, {
				code: "not_whole",
			});
			return INVALID;
		}
		if (arg < -32768) {
			this.setIssueForContext(ctx, {
				code: "too_small",
				type: "number",
				minimum: -32768,
				inclusive: true,
			});
			return INVALID;
		}
		if (arg > 32767) {
			this.setIssueForContext(ctx, {
				code: "too_big",
				type: "number",
				maximum: 32767,
				inclusive: true,
			});
			return INVALID;
		}
		return OK(new Int2Class(arg));
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Int2> {
		const parsed = parseFloat(arg);
		return this._parseNumber(ctx, parsed);
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Int2> {
		if (this.isInt2(arg)) return OK(new Int2Class(arg.int2));
		const parsedObject = hasKeys<Int2Object>(arg, [["int2", "number"]]);
		if (parsedObject.success) return this._parseNumber(ctx, parsedObject.obj.int2);

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

	isInt2(obj: any): obj is Int2 {
		return obj instanceof Int2Class;
	}
}

const Int2: Int2Constructor = new Int2ConstructorClass();

class Int2Class extends PGTPBase<Int2> implements Int2 {
	constructor(private _int2: number) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Int2 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Int2.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toNumber() === this.toNumber(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._int2.toString();
	}

	toNumber(): number {
		return this._int2;
	}

	toJSON(): Int2Object {
		return {
			int2: this._int2,
		};
	}

	get int2(): number {
		return this._int2;
	}

	set int2(int2: number) {
		const parsed = Int2.safeFrom(int2);
		if (parsed.success) this._int2 = parsed.data.toNumber();
		else throw parsed.error;
	}
}

types.setTypeParser(DataType.int2 as any, parser<Int2>(Int2));
types.setTypeParser(DataType._int2 as any, arrayParser<Int2>(Int2, ","));

export { Int2, Int2Object };
