import type BigNumber from "bignumber.js";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import type { ParseContext } from "../../types/ParseContext";
import type { ParseReturnType } from "../../types/ParseReturnType";
import type { SafeEquals } from "../../types/SafeEquals";
import type { SafeFrom } from "../../types/SafeFrom";
import { arrayParser } from "../../util/arrayParser";
import { getBigNumber } from "../../util/getBigNumber";
import { getParsedType, ParsedType } from "../../util/getParsedType";
import { hasKeys } from "../../util/hasKeys";
import { isOneOf } from "../../util/isOneOf";
import { parser } from "../../util/parser";
import { PGTPBase } from "../../util/PGTPBase";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase";
import { INVALID, OK } from "../../util/validation";

const bigNumber = getBigNumber("-99999999999999999999999999999999999999", "99999999999999999999999999999999999999");

interface Float4Object {
	float4: string;
}

interface Float4 {
	float4: BigNumber;

	toString(): string;
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
	 * Returns `true` if `obj` is a `Float4`, `false` otherwise.
	 */
	isFloat4(obj: any): obj is Float4;
}

class Float4ConstructorClass extends PGTPConstructorBase<Float4> implements Float4Constructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Float4> {
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
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType.nan, ParsedType.infinity, ParsedType.bigNumber, ParsedType.bigint],
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
			case ParsedType.object:
				return this._parseObject(ctx, arg as Float4Object);
			default:
				return this._parseString(ctx, arg as string);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Float4> {
		const parsedNumber = bigNumber(arg);
		if (parsedNumber.success) return OK(new Float4Class(parsedNumber.data));
		this.setIssueForContext(ctx, parsedNumber.error);
		return INVALID;
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Float4> {
		if (this.isFloat4(arg)) return OK(new Float4Class(arg.float4));
		const parsedObject = hasKeys<Float4Object>(arg, [["float4", "string"]]);
		if (parsedObject.success) return this._parseString(ctx, parsedObject.obj.float4);

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

	isFloat4(obj: any): obj is Float4 {
		return obj instanceof Float4Class;
	}
}

const Float4: Float4Constructor = new Float4ConstructorClass();

class Float4Class extends PGTPBase<Float4> implements Float4 {
	constructor(private _float4: BigNumber) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Float4 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Float4.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._float4.toString();
	}

	toBigNumber(): BigNumber {
		return this._float4;
	}

	toJSON(): Float4Object {
		return {
			float4: this._float4.toString(),
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
}

types.setTypeParser(DataType.float4 as any, parser<Float4>(Float4));
types.setTypeParser(DataType._float4 as any, arrayParser<Float4>(Float4, ","));

export { Float4, Float4Object };
