import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { Character } from "../Character/Character.js";
import { CharacterVarying } from "../Character/CharacterVarying.js";
import { Name } from "../Character/Name.js";
import { Text } from "../Character/Text.js";
import { Int2 } from "../Numeric/Int2.js";
import { Int4 } from "../Numeric/Int4.js";
import { Int8 } from "../Numeric/Int8.js";
import { OID } from "../ObjectIdentifier/OID.js";
import { BitVarying } from "./BitVarying.js";

interface BitObject {
	value: string;
}

interface Bit<N extends number> {
	bit: string;

	value: string;
	postgres: string;

	get n(): N;

	toString(): string;
	toNumber(): number;
	toJSON(): BitObject;

	equals(string: string): boolean;
	equals(number: number): boolean;
	equals(object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitObject): boolean;
	safeEquals(string: string): SafeEquals<Bit<N>>;
	safeEquals(number: number): SafeEquals<Bit<N>>;
	safeEquals(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitObject
	): SafeEquals<Bit<N>>;
}

interface BitConstructor<N extends number> {
	from(string: string): Bit<N>;
	from(number: number): Bit<N>;
	from(object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitObject): Bit<N>;
	safeFrom(string: string): SafeFrom<Bit<N>>;
	safeFrom(number: number): SafeFrom<Bit<N>>;
	safeFrom(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitObject
	): SafeFrom<Bit<N>>;
	/**
	 * Returns `true` if `object` is a `Bit`, `false` otherwise.
	 */
	isBit(object: any): object is Bit<N>;
	/**
	 * Returns `true` if `object` is a `Bit<N>`, `false` otherwise.
	 */
	isBit<NN extends number = N>(object: any, n: NN): object is Bit<NN>;
	/**
	 * Returns `true` if `object` is a `Bit<N>`, `false` otherwise.
	 */
	isAnyBit(object: any): object is Bit<number>;
	/**
	 * Get a `Bit` constructor for a specific `n`.
	 * @param n The number of bits.
	 */
	setN<N extends number = 1>(n: N): BitConstructor<N>;
	/**
	 * Get the `n` value for this `Bit` constructor.
	 * @returns The `n` value.
	 */
	get n(): N;
}

class BitConstructorClass<N extends number> extends PgTPConstructorBase<Bit<N>> implements BitConstructor<N> {
	constructor(private _n: N = 1 as N) {
		super();

		const allowedTypes = [ParsedType.number, ParsedType.infinity],
			parsedType = getParsedType(_n);

		if (!isOneOf(allowedTypes, parsedType)) {
			throwPgTPError({
				code: "invalid_type",
				expected: allowedTypes,
				received: parsedType,
			});
		}

		if (_n < 1) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: _n,
				type: "number",
			});
		}

		//If limit is not a whole number
		if (_n % 1 !== 0 && _n !== Number.POSITIVE_INFINITY) {
			throwPgTPError({
				code: "not_whole",
				received: _n,
			});
		}
	}

	_parse(context: ParseContext): ParseReturnType<Bit<N>> {
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
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes,
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.object:
				return this._parseObject(context, argument as BitObject);
			case ParsedType.number:
				return this._parseNumber(context, argument as number);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Bit<N>> {
		// Only allow 0s and 1s
		if (!/^[01]+$/.test(argument)) {
			this.setIssueForContext(context, {
				code: "invalid_string",
				expected: "LIKE 010101",
				received: argument,
			});
			return INVALID;
		}

		// Make sure the bit is the correct length
		if (argument.length > this._n) {
			this.setIssueForContext(context, {
				code: "invalid_n_length",
				input: argument,
				maximum: this._n,
				received: argument.length,
			});
			return INVALID;
		}

		// Truncate or zero-pad on the right to be exactly n bits
		if (argument.length < this._n && this._n !== Number.POSITIVE_INFINITY) argument = argument.padEnd(this._n, "0");

		return OK(new BitClass(argument, this._n));
	}

	private _parseNumber(context: ParseContext, argument: number): ParseReturnType<Bit<N>> {
		// Make sure the number is a whole number
		if (argument % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
				received: argument,
			});
			return INVALID;
		}

		// Make sure the number is positive
		if (argument < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				exact: true,
				minimum: 0,
				received: argument,
				type: "number",
			});
			return INVALID;
		}

		// Stringify the number and parse it as a string, >>> 0 is to double check that it's a whole number
		const string = (argument >>> 0).toString(2);
		return this._parseString(context, string);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Bit<N>> {
		if (this.isAnyBit(argument)) {
			// Make sure the bit is the correct length
			if (argument.n > this._n) {
				this.setIssueForContext(context, {
					code: "invalid_n_length",
					input: argument.value,
					maximum: this._n,
					received: argument.n,
				});
				return INVALID;
			}

			return OK(new BitClass(argument.value, this._n));
		}
		if (BitVarying.isAnyBitVarying(argument)) return this._parseString(context, argument.value);
		if (Character.isAnyCharacter(argument)) return this._parseString(context, argument.value);
		if (CharacterVarying.isAnyCharacterVarying(argument)) return this._parseString(context, argument.value);
		if (Name.isName(argument)) return this._parseString(context, argument.value);
		if (Text.isText(argument)) return this._parseString(context, argument.value);
		if (Int2.isInt2(argument)) return this._parseNumber(context, argument.value);
		if (Int4.isInt4(argument)) return this._parseNumber(context, argument.value);
		if (Int8.isInt8(argument)) return this._parseString(context, argument.toString());
		if (OID.isOID(argument)) return this._parseNumber(context, argument.value);

		const parsedObject = hasKeys<BitObject>(argument, [["value", "string"]]);
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

	isBit(object: any): object is Bit<N>;
	isBit<NN extends number = N>(object: any, n: NN): object is Bit<NN>;
	isBit(object: unknown, n?: unknown): boolean {
		if (typeof n === "number") return this.setN(n).isBit(object);
		return object instanceof BitClass && object.n === this._n;
	}

	isAnyBit(object: any): object is Bit<number> {
		return object instanceof BitClass;
	}

	setN<N extends number = 1>(n: N): BitConstructor<N> {
		return new BitConstructorClass<N>(n);
	}

	get n(): N {
		return this._n;
	}
}

const Bit: BitConstructor<1> = new BitConstructorClass(1);

class BitClass<N extends number> extends PgTPBase<Bit<N>> implements Bit<N> {
	constructor(
		private _bit: string,
		private _n: N = 1 as N
	) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Bit<N> }> {
		const parsed = new BitConstructorClass(this._n).safeFrom(...input.data);
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
		return this._bit;
	}

	toNumber(): number {
		return Number.parseInt(this._bit, 2);
	}

	toJSON(): BitObject {
		return {
			value: this._bit.toString(),
		};
	}

	get bit(): string {
		return this._bit;
	}

	set bit(bit: string) {
		const parsed = new BitConstructorClass(this._n).safeFrom(bit);
		if (parsed.success) this._bit = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._bit;
	}

	set value(bit: string) {
		const parsed = new BitConstructorClass(this._n).safeFrom(bit);
		if (parsed.success) this._bit = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._bit;
	}

	set postgres(bit: string) {
		const parsed = new BitConstructorClass(this._n).safeFrom(bit);
		if (parsed.success) this._bit = parsed.data.toString();
		else throw parsed.error;
	}

	get n(): N {
		return this._n;
	}
}

export { Bit, BitConstructor, BitObject };
