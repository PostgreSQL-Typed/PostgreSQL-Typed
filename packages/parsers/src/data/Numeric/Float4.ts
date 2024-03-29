import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import type { BigNumber } from "bignumber.js";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { getBigNumber } from "../../util/getBigNumber.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";

const bigNumber = getBigNumber("-99999999999999999999999999999999999999", "99999999999999999999999999999999999999", {
	allowInfinity: true,
	allowNaN: true,
});

interface Float4Object {
	value: string;
}

interface Float4 {
	float4: BigNumber;

	value: number;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toBigNumber(): BigNumber;
	toJSON(): Float4Object;

	equals(string: string): boolean;
	equals(number: number): boolean;
	equals(bigInt: bigint): boolean;
	equals(bigNumber: BigNumber): boolean;
	equals(object: Float4 | Float4Object): boolean;
	safeEquals(string: string): SafeEquals<Float4>;
	safeEquals(number: number): SafeEquals<Float4>;
	safeEquals(bigInt: bigint): SafeEquals<Float4>;
	safeEquals(bigNumber: BigNumber): SafeEquals<Float4>;
	safeEquals(object: Float4 | Float4Object): SafeEquals<Float4>;
}

interface Float4Constructor {
	from(string: string): Float4;
	from(number: number): Float4;
	from(bigInt: bigint): Float4;
	from(bigNumber: BigNumber): Float4;
	from(object: Float4 | Float4Object): Float4;
	safeFrom(string: string): SafeFrom<Float4>;
	safeFrom(number: number): SafeFrom<Float4>;
	safeFrom(bigInt: bigint): SafeFrom<Float4>;
	safeFrom(bigNumber: BigNumber): SafeFrom<Float4>;
	safeFrom(object: Float4 | Float4Object): SafeFrom<Float4>;
	/**
	 * Returns `true` if `object` is a `Float4`, `false` otherwise.
	 */
	isFloat4(object: any): object is Float4;
}

class Float4ConstructorClass extends PgTPConstructorBase<Float4> implements Float4Constructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Float4> {
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
				return this._parseObject(context, argument as Float4Object);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Float4> {
		const parsedNumber = bigNumber(argument);
		if (parsedNumber.success) return OK(new Float4Class(parsedNumber.data));
		this.setIssueForContext(context, parsedNumber.error);
		return INVALID;
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Float4> {
		if (this.isFloat4(argument)) return OK(new Float4Class(argument.float4));
		const parsedObject = hasKeys<Float4Object>(argument, [["value", "string"]]);
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

	isFloat4(object: any): object is Float4 {
		return object instanceof Float4Class;
	}
}

const Float4: Float4Constructor = new Float4ConstructorClass();

class Float4Class extends PgTPBase<Float4> implements Float4 {
	constructor(private _float4: BigNumber) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Float4 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Float4.safeFrom(...input.data);
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
		return this._float4.toString();
	}

	toNumber(): number {
		return this._float4.toNumber();
	}

	toBigNumber(): BigNumber {
		return this._float4;
	}

	toJSON(): Float4Object {
		return {
			value: this._float4.toString(),
		};
	}

	get float4(): BigNumber {
		return this._float4;
	}

	set float4(float4: BigNumber) {
		const parsed = Float4.safeFrom(float4);
		if (parsed.success) this._float4 = parsed.data.toBigNumber();
		else throw parsed.error;
	}

	get value(): number {
		return this.toNumber();
	}

	set value(float4: number) {
		const parsed = Float4.safeFrom(float4);
		if (parsed.success) this._float4 = parsed.data.float4;
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(float4: string) {
		const parsed = Float4.safeFrom(float4);
		if (parsed.success) this._float4 = parsed.data.float4;
		else throw parsed.error;
	}
}

export { Float4, Float4Constructor, Float4Object };
