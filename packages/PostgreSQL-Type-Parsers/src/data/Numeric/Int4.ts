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

interface Int4Object {
	int4: number;
}

interface Int4 {
	int4: number;

	toString(): string;
	toNumber(): number;
	toJSON(): Int4Object;

	equals(number: number): boolean;
	equals(string: string): boolean;
	equals(object: Int4 | Int4Object): boolean;
	safeEquals(number: number): SafeEquals<Int4>;
	safeEquals(string: string): SafeEquals<Int4>;
	safeEquals(object: Int4 | Int4Object): SafeEquals<Int4>;
}

interface Int4Constructor {
	from(number: number): Int4;
	from(string: string): Int4;
	from(object: Int4 | Int4Object): Int4;
	safeFrom(number: number): SafeFrom<Int4>;
	safeFrom(string: string): SafeFrom<Int4>;
	safeFrom(object: Int4 | Int4Object): SafeFrom<Int4>;
	/**
	 * Returns `true` if `obj` is a `Int4`, `false` otherwise.
	 */
	isInt4(obj: any): obj is Int4;
}

class Int4ConstructorClass extends PGTPConstructorBase<Int4> implements Int4Constructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Int4> {
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
				return this._parseObject(ctx, arg as Int4Object);
		}
	}

	private _parseNumber(ctx: ParseContext, arg: number): ParseReturnType<Int4> {
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
		if (arg < -2147483648) {
			this.setIssueForContext(ctx, {
				code: "too_small",
				type: "number",
				minimum: -2147483648,
				inclusive: true,
			});
			return INVALID;
		}
		if (arg > 2147483647) {
			this.setIssueForContext(ctx, {
				code: "too_big",
				type: "number",
				maximum: 2147483647,
				inclusive: true,
			});
			return INVALID;
		}
		return OK(new Int4Class(arg));
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Int4> {
		const parsed = parseFloat(arg);
		return this._parseNumber(ctx, parsed);
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Int4> {
		if (this.isInt4(arg)) return OK(new Int4Class(arg.int4));
		const parsedObject = hasKeys<Int4Object>(arg, [["int4", "number"]]);
		if (parsedObject.success) return this._parseNumber(ctx, parsedObject.obj.int4);

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

	isInt4(obj: any): obj is Int4 {
		return obj instanceof Int4Class;
	}
}

const Int4: Int4Constructor = new Int4ConstructorClass();

class Int4Class extends PGTPBase<Int4> implements Int4 {
	constructor(private _int4: number) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Int4 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Int4.safeFrom(...input.data);
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
		return this._int4.toString();
	}

	toNumber(): number {
		return this._int4;
	}

	toJSON(): Int4Object {
		return {
			int4: this._int4,
		};
	}

	get int4(): number {
		return this._int4;
	}

	set int4(int4: number) {
		const parsed = Int4.safeFrom(int4);
		if (parsed.success) this._int4 = parsed.data.toNumber();
		else throw parsed.error;
	}
}

types.setTypeParser(DataType.int4 as any, parser<Int4>(Int4));
types.setTypeParser(DataType._int4 as any, arrayParser<Int4>(Int4, ","));

export { Int4, Int4Object };
