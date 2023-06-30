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
import { Bit } from "./Bit.js";

interface BitVaryingObject {
	value: string;
}

interface BitVarying<N extends number> {
	bitVarying: string;

	value: string;
	postgres: string;

	get n(): N;

	toString(): string;
	toNumber(): number;
	toJSON(): BitVaryingObject;

	equals(string: string): boolean;
	equals(number: number): boolean;
	equals(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitVaryingObject
	): boolean;
	safeEquals(string: string): SafeEquals<BitVarying<N>>;
	safeEquals(number: number): SafeEquals<BitVarying<N>>;
	safeEquals(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitVaryingObject
	): SafeEquals<BitVarying<N>>;
}

interface BitVaryingConstructor<N extends number> {
	from(string: string): BitVarying<N>;
	from(number: number): BitVarying<N>;
	from(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitVaryingObject
	): BitVarying<N>;
	safeFrom(string: string): SafeFrom<BitVarying<N>>;
	safeFrom(number: number): SafeFrom<BitVarying<N>>;
	safeFrom(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | BitVaryingObject
	): SafeFrom<BitVarying<N>>;
	/**
	 * Returns `true` if `object` is a `BitVarying`, `false` otherwise.
	 */
	isBitVarying(object: any): object is BitVarying<N>;
	/**
	 * Returns `true` if `object` is a `BitVarying<N>`, `false` otherwise.
	 */
	isBitVarying<N extends number = number>(object: any, n: N): object is BitVarying<N>;
	/**
	 * Returns `true` if `object` is a `BitVarying<N>`, `false` otherwise.
	 */
	isAnyBitVarying(object: any): object is BitVarying<number>;
	/**
	 * Get a `BitVarying` constructor for a specific `n`.
	 * @param n The number of bits.
	 */
	setN<N extends number = number>(n: N): BitVaryingConstructor<N>;
	/**
	 * Get the `n` value for this `BitVarying` constructor.
	 * @returns The `n` value.
	 */
	get n(): N;
}

class BitVaryingConstructorClass<N extends number> extends PgTPConstructorBase<BitVarying<N>> implements BitVaryingConstructor<N> {
	constructor(private _n: N = Number.POSITIVE_INFINITY as N) {
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
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		//If limit is not a whole number
		if (_n % 1 !== 0 && _n !== Number.POSITIVE_INFINITY) {
			throwPgTPError({
				code: "not_whole",
			});
		}
	}

	_parse(context: ParseContext): ParseReturnType<BitVarying<N>> {
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
				expected: allowedTypes,
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.object:
				return this._parseObject(context, argument as BitVaryingObject);
			case ParsedType.number:
				return this._parseNumber(context, argument as number);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<BitVarying<N>> {
		// Only allow 0s and 1s
		if (!/^[01]+$/.test(argument) && argument !== "") {
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
				maximum: this._n,
				received: argument.length,
			});
			return INVALID;
		}

		return OK(new BitVaryingClass(argument, this._n));
	}

	private _parseNumber(context: ParseContext, argument: number): ParseReturnType<BitVarying<N>> {
		// Make sure the number is a whole number
		if (argument % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
			});
			return INVALID;
		}

		// Make sure the number is positive
		if (argument < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				type: "number",
				minimum: 0,
				exact: true,
			});
			return INVALID;
		}

		// Stringify the number and parse it as a string, >>> 0 is to double check that it's a whole number
		const string = (argument >>> 0).toString(2);
		return this._parseString(context, string);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<BitVarying<N>> {
		if (this.isAnyBitVarying(argument)) {
			// Make sure the bit is the correct length
			if (argument.n > this._n) {
				this.setIssueForContext(context, {
					code: "invalid_n_length",
					maximum: this._n,
					received: argument.n,
				});
				return INVALID;
			}

			return OK(new BitVaryingClass(argument.value, this._n));
		}
		if (Bit.isAnyBit(argument)) return this._parseString(context, argument.value);
		if (Character.isAnyCharacter(argument)) return this._parseString(context, argument.value);
		if (CharacterVarying.isAnyCharacterVarying(argument)) return this._parseString(context, argument.value);
		if (Name.isName(argument)) return this._parseString(context, argument.value);
		if (Text.isText(argument)) return this._parseString(context, argument.value);
		if (Int2.isInt2(argument)) return this._parseNumber(context, argument.value);
		if (Int4.isInt4(argument)) return this._parseNumber(context, argument.value);
		if (Int8.isInt8(argument)) return this._parseString(context, argument.toString());
		if (OID.isOID(argument)) return this._parseNumber(context, argument.value);

		const parsedObject = hasKeys<BitVaryingObject>(argument, [["value", "string"]]);
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

	isBitVarying(object: any): object is BitVarying<N>;
	isBitVarying<N extends number = number>(object: any, n: N): object is BitVarying<N>;
	isBitVarying(object: unknown, n?: unknown): boolean {
		if (typeof n === "number") return this.setN(n).isBitVarying(object);
		return object instanceof BitVaryingClass && object.n === this._n;
	}

	isAnyBitVarying(object: any): object is BitVarying<number> {
		return object instanceof BitVaryingClass;
	}

	setN<N extends number = number>(n: N): BitVaryingConstructor<N> {
		return new BitVaryingConstructorClass<N>(n);
	}

	get n(): N {
		return this._n;
	}
}

const BitVarying: BitVaryingConstructor<number> = new BitVaryingConstructorClass(Number.POSITIVE_INFINITY);

class BitVaryingClass<N extends number> extends PgTPBase<BitVarying<N>> implements BitVarying<N> {
	constructor(private _bit: string, private _n: N = Number.POSITIVE_INFINITY as N) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: BitVarying<N> }> {
		const parsed = new BitVaryingConstructorClass(this._n).safeFrom(...input.data);
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
		return this._bit;
	}

	toNumber(): number {
		return Number.parseInt(this._bit, 2);
	}

	toJSON(): BitVaryingObject {
		return {
			value: this._bit.toString(),
		};
	}

	get bitVarying(): string {
		return this._bit;
	}

	set bitVarying(bit: string) {
		const parsed = new BitVaryingConstructorClass(this._n).safeFrom(bit);
		if (parsed.success) this._bit = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._bit;
	}

	set value(bit: string) {
		const parsed = new BitVaryingConstructorClass(this._n).safeFrom(bit);
		if (parsed.success) this._bit = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._bit;
	}

	set postgres(bit: string) {
		const parsed = new BitVaryingConstructorClass(this._n).safeFrom(bit);
		if (parsed.success) this._bit = parsed.data.toString();
		else throw parsed.error;
	}

	get n(): N {
		return this._n;
	}
}

export { BitVarying, BitVaryingConstructor, BitVaryingObject };
