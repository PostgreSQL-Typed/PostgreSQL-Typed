import { OID } from "@postgresql-typed/oids";
import { types } from "pg";

import type { ParseContext } from "../../types/ParseContext.js";
import type { ParseReturnType } from "../../types/ParseReturnType.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { arrayParser } from "../../util/arrayParser.js";
import { getParsedType, ParsedType } from "../../util/getParsedType.js";
import { hasKeys } from "../../util/hasKeys.js";
import { isOneOf } from "../../util/isOneOf.js";
import { parser } from "../../util/parser.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { INVALID, OK } from "../../util/validation.js";

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
	 * Returns `true` if `object` is a `Int8`, `false` otherwise.
	 */
	isInt8(object: any): object is Int8;
}

class Int8ConstructorClass extends PGTPConstructorBase<Int8> implements Int8Constructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Int8> {
		if (context.data.length !== 1) {
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

		const [argument] = context.data,
			allowedTypes = [ParsedType.bigint, ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.bigint:
				return this._parseBigint(context, argument as bigint);
			case ParsedType.number:
				return this._parseNumber(context, argument as number);
			case ParsedType.string:
				return this._parseString(context, argument as string);
			default:
				return this._parseObject(context, argument as Int8Object);
		}
	}

	private _parseNumber(context: ParseContext, argument: number): ParseReturnType<Int8> {
		if (argument % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
			});
			return INVALID;
		}
		return this._parseBigint(context, BigInt(argument));
	}

	private _parseBigint(context: ParseContext, argument: bigint): ParseReturnType<Int8> {
		if (argument < BigInt("-9223372036854775808")) {
			this.setIssueForContext(context, {
				code: "too_small",
				type: "bigint",
				minimum: BigInt("-9223372036854775808"),
				inclusive: true,
			});
			return INVALID;
		}
		if (argument > BigInt("9223372036854775807")) {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "bigint",
				maximum: BigInt("9223372036854775807"),
				inclusive: true,
			});
			return INVALID;
		}
		return OK(new Int8Class(argument));
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Int8> {
		try {
			return this._parseBigint(context, BigInt(argument));
		} catch {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: "bigint",
				received: "string",
			});
			return INVALID;
		}
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Int8> {
		if (this.isInt8(argument)) return OK(new Int8Class(argument.int8));
		const parsedObject = hasKeys<Int8Object>(argument, [["int8", "bigint"]]);
		if (parsedObject.success) return this._parseBigint(context, parsedObject.obj.int8);

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

	isInt8(object: any): object is Int8 {
		return object instanceof Int8Class;
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

types.setTypeParser(OID.int8 as any, parser<Int8>(Int8));
types.setTypeParser(OID._int8 as any, arrayParser<Int8>(Int8, ","));

export { Int8, Int8Object };
