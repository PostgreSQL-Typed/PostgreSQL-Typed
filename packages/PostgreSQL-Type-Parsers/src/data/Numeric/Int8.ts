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

interface Int8Object {
	int8: bigint;
}

interface Int8 {
	int8: bigint;

	toString(): string;
	toBigint(): bigint;
	toJSON(): Int8Object;

	equals(bigint: bigint): boolean;
	equals(number: number): boolean;
	equals(string: string): boolean;
	equals(object: Int8 | Int8Object): boolean;
	safeEquals(bigint: bigint): SafeEquals<Int8>;
	safeEquals(number: number): SafeEquals<Int8>;
	safeEquals(string: string): SafeEquals<Int8>;
	safeEquals(object: Int8 | Int8Object): SafeEquals<Int8>;
}

interface Int8Constructor {
	from(number: number): Int8;
	from(bigint: bigint): Int8;
	from(string: string): Int8;
	from(object: Int8 | Int8Object): Int8;
	safeFrom(number: number): SafeFrom<Int8>;
	safeFrom(bigint: bigint): SafeFrom<Int8>;
	safeFrom(string: string): SafeFrom<Int8>;
	safeFrom(object: Int8 | Int8Object): SafeFrom<Int8>;
	/**
	 * Returns `true` if `obj` is a `Int8`, `false` otherwise.
	 */
	isInt8(obj: any): obj is Int8;
}

class Int8ConstructorClass extends PGTPConstructorBase<Int8> implements Int8Constructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Int8> {
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
			allowedTypes = [ParsedType.bigint, ParsedType.number, ParsedType.string, ParsedType.object],
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
			case ParsedType.bigint:
				return this._parseBigint(ctx, arg as bigint);
			case ParsedType.number:
				return this._parseNumber(ctx, arg as number);
			case ParsedType.string:
				return this._parseString(ctx, arg as string);
			default:
				return this._parseObject(ctx, arg as Int8Object);
		}
	}

	private _parseNumber(ctx: ParseContext, arg: number): ParseReturnType<Int8> {
		if (arg % 1 !== 0) {
			this.setIssueForContext(ctx, {
				code: "not_whole",
			});
			return INVALID;
		}
		return this._parseBigint(ctx, BigInt(arg));
	}

	private _parseBigint(ctx: ParseContext, arg: bigint): ParseReturnType<Int8> {
		if (arg < BigInt("-9223372036854775808")) {
			this.setIssueForContext(ctx, {
				code: "too_small",
				type: "bigint",
				minimum: BigInt("-9223372036854775808"),
				inclusive: true,
			});
			return INVALID;
		}
		if (arg > BigInt("9223372036854775807")) {
			this.setIssueForContext(ctx, {
				code: "too_big",
				type: "bigint",
				maximum: BigInt("9223372036854775807"),
				inclusive: true,
			});
			return INVALID;
		}
		return OK(new Int8Class(arg));
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Int8> {
		try {
			return this._parseBigint(ctx, BigInt(arg));
		} catch {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: "bigint",
				received: "string",
			});
			return INVALID;
		}
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Int8> {
		if (this.isInt8(arg)) return OK(new Int8Class(arg.int8));
		const parsedObject = hasKeys<Int8Object>(arg, [["int8", "bigint"]]);
		if (parsedObject.success) return this._parseBigint(ctx, parsedObject.obj.int8);

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

	isInt8(obj: any): obj is Int8 {
		return obj instanceof Int8Class;
	}
}

const Int8: Int8Constructor = new Int8ConstructorClass();

class Int8Class extends PGTPBase<Int8> implements Int8 {
	constructor(private _int8: bigint) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Int8 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Int8.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toBigint() === this.toBigint(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._int8.toString();
	}

	toBigint(): bigint {
		return this._int8;
	}

	toJSON(): Int8Object {
		return {
			int8: this._int8,
		};
	}

	get int8(): bigint {
		return this._int8;
	}

	set int8(int8: bigint) {
		const parsed = Int8.safeFrom(int8);
		if (parsed.success) this._int8 = parsed.data.toBigint();
		else throw parsed.error;
	}
}

types.setTypeParser(DataType.int8 as any, parser<Int8>(Int8));
types.setTypeParser(DataType._int8 as any, arrayParser<Int8>(Int8, ","));

export { Int8, Int8Object };
