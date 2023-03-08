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
	 * Returns `true` if `object` is a `Int4`, `false` otherwise.
	 */
	isInt4(object: any): object is Int4;
}

class Int4ConstructorClass extends PGTPConstructorBase<Int4> implements Int4Constructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Int4> {
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
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
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
			case ParsedType.number:
				return this._parseNumber(context, argument as number);
			case ParsedType.string:
				return this._parseString(context, argument as string);
			default:
				return this._parseObject(context, argument as Int4Object);
		}
	}

	private _parseNumber(context: ParseContext, argument: number): ParseReturnType<Int4> {
		if (Number.isNaN(argument)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: "number",
				received: "nan",
			});
			return INVALID;
		}
		if (!Number.isFinite(argument)) {
			this.setIssueForContext(context, {
				code: "not_finite",
			});
			return INVALID;
		}
		if (argument % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
			});
			return INVALID;
		}
		if (argument < -2_147_483_648) {
			this.setIssueForContext(context, {
				code: "too_small",
				type: "number",
				minimum: -2_147_483_648,
				inclusive: true,
			});
			return INVALID;
		}
		if (argument > 2_147_483_647) {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "number",
				maximum: 2_147_483_647,
				inclusive: true,
			});
			return INVALID;
		}
		return OK(new Int4Class(argument));
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Int4> {
		const parsed = Number.parseFloat(argument);
		return this._parseNumber(context, parsed);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Int4> {
		if (this.isInt4(argument)) return OK(new Int4Class(argument.int4));
		const parsedObject = hasKeys<Int4Object>(argument, [["int4", "number"]]);
		if (parsedObject.success) return this._parseNumber(context, parsedObject.obj.int4);

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

	isInt4(object: any): object is Int4 {
		return object instanceof Int4Class;
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

types.setTypeParser(OID.int4 as any, parser<Int4>(Int4));
types.setTypeParser(OID._int4 as any, arrayParser<Int4>(Int4, ","));

export { Int4, Int4Constructor, Int4Object };