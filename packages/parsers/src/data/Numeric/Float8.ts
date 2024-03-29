import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import type { BigNumber } from "bignumber.js";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { getBigNumber } from "../../util/getBigNumber.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";

const bigNumber = getBigNumber("-10e307", "10e307", {
	allowInfinity: true,
	allowNaN: true,
});

interface Float8Object {
	value: string;
}

interface Float8 {
	float8: BigNumber;

	value: number;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toBigNumber(): BigNumber;
	toJSON(): Float8Object;

	equals(string: string): boolean;
	equals(number: number): boolean;
	equals(bigInt: bigint): boolean;
	equals(bigNumber: BigNumber): boolean;
	equals(object: Float8 | Float8Object): boolean;
	safeEquals(string: string): SafeEquals<Float8>;
	safeEquals(number: number): SafeEquals<Float8>;
	safeEquals(bigInt: bigint): SafeEquals<Float8>;
	safeEquals(bigNumber: BigNumber): SafeEquals<Float8>;
	safeEquals(object: Float8 | Float8Object): SafeEquals<Float8>;
}

interface Float8Constructor {
	from(string: string): Float8;
	from(number: number): Float8;
	from(bigInt: bigint): Float8;
	from(bigNumber: BigNumber): Float8;
	from(object: Float8 | Float8Object): Float8;
	safeFrom(string: string): SafeFrom<Float8>;
	safeFrom(number: number): SafeFrom<Float8>;
	safeFrom(bigInt: bigint): SafeFrom<Float8>;
	safeFrom(bigNumber: BigNumber): SafeFrom<Float8>;
	safeFrom(object: Float8 | Float8Object): SafeFrom<Float8>;
	/**
	 * Returns `true` if `object` is a `Float8`, `false` otherwise.
	 */
	isFloat8(object: any): object is Float8;
}

class Float8ConstructorClass extends PgTPConstructorBase<Float8> implements Float8Constructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Float8> {
		if (context.data.length !== 1) {
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

		const [argument] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType.nan, ParsedType.infinity, ParsedType.bigNumber, ParsedType.bigint],
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
			case ParsedType.object:
				return this._parseObject(context, argument as Float8Object);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Float8> {
		const parsedNumber = bigNumber(argument);
		if (parsedNumber.success) return OK(new Float8Class(parsedNumber.data));
		this.setIssueForContext(context, parsedNumber.error);
		return INVALID;
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Float8> {
		if (this.isFloat8(argument)) return OK(new Float8Class(argument.float8));
		const parsedObject = hasKeys<Float8Object>(argument, [["value", "string"]]);
		if (parsedObject.success) return this._parseString(context, parsedObject.obj.value);

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

	isFloat8(object: any): object is Float8 {
		return object instanceof Float8Class;
	}
}

const Float8: Float8Constructor = new Float8ConstructorClass();

class Float8Class extends PgTPBase<Float8> implements Float8 {
	constructor(private _float8: BigNumber) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Float8 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Float8.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toString() === this.toString(),
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._float8.toString();
	}

	toNumber(): number {
		return this._float8.toNumber();
	}

	toBigNumber(): BigNumber {
		return this._float8;
	}

	toJSON(): Float8Object {
		return {
			value: this._float8.toString(),
		};
	}

	get float8(): BigNumber {
		return this._float8;
	}

	set float8(float8: BigNumber) {
		const parsed = Float8.safeFrom(float8);
		if (parsed.success) this._float8 = parsed.data.toBigNumber();
		else throw parsed.error;
	}

	get value(): number {
		return this.toNumber();
	}

	set value(float8: number) {
		const parsed = Float8.safeFrom(float8);
		if (parsed.success) this._float8 = parsed.data.float8;
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(float8: string) {
		const parsed = Float8.safeFrom(float8);
		if (parsed.success) this._float8 = parsed.data.float8;
		else throw parsed.error;
	}
}

export { Float8, Float8Constructor, Float8Object };
