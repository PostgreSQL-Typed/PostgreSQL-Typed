import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { Bit } from "../BitString/Bit.js";
import { BitVarying } from "../BitString/BitVarying.js";
import { Int2 } from "../Numeric/Int2.js";
import { Int4 } from "../Numeric/Int4.js";
import { Int8 } from "../Numeric/Int8.js";
import { OID } from "../ObjectIdentifier/OID.js";
import { UUID } from "../UUID/UUID.js";
import { CharacterVarying } from "./CharacterVarying.js";
import { Name } from "./Name.js";
import { Text } from "./Text.js";

interface CharacterObject {
	value: string;
}

interface Character<N extends number> {
	character: string;

	value: string;
	postgres: string;

	get n(): N;

	toString(): string;
	toJSON(): CharacterObject;

	equals(string: string): boolean;
	equals(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | UUID | CharacterObject
	): boolean;
	safeEquals(string: string): SafeEquals<Character<N>>;
	safeEquals(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | UUID | CharacterObject
	): SafeEquals<Character<N>>;
}

interface CharacterConstructor<N extends number> {
	from(string: string): Character<N>;
	from(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | UUID | CharacterObject
	): Character<N>;
	safeFrom(string: string): SafeFrom<Character<N>>;
	safeFrom(
		object: Bit<number> | BitVarying<number> | Character<number> | CharacterVarying<number> | Name | Text | Int2 | Int4 | Int8 | OID | UUID | CharacterObject
	): SafeFrom<Character<N>>;
	/**
	 * Returns `true` if `object` is a `Character`, `false` otherwise.
	 */
	isCharacter(object: any): object is Character<N>;
	/**
	 * Returns `true` if `object` is a `Character<N>`, `false` otherwise.
	 */
	isCharacter<NN extends number = N>(object: any, n: NN): object is Character<NN>;
	/**
	 * Returns `true` if `object` is a `Character<N>`, `false` otherwise.
	 */
	isAnyCharacter(object: any): object is Character<number>;
	/**
	 * Get a `Character` constructor for a specific `n`.
	 * @param n The number of characters.
	 */
	setN<N extends number = 1>(n: N): CharacterConstructor<N>;
	/**
	 * Get the `n` value for this `Character` constructor.
	 * @returns The `n` value.
	 */
	get n(): N;
}

class CharacterConstructorClass<N extends number> extends PgTPConstructorBase<Character<N>> implements CharacterConstructor<N> {
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
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (_n > 10_485_760 && _n !== Number.POSITIVE_INFINITY) {
			throwPgTPError({
				code: "too_big",
				type: "number",
				maximum: 10_485_760,
				inclusive: true,
			});
		}

		if (_n % 1 !== 0 && _n !== Number.POSITIVE_INFINITY) {
			//If limit is not a whole number
			throwPgTPError({
				code: "not_whole",
			});
		}
	}

	_parse(context: ParseContext): ParseReturnType<Character<N>> {
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
			allowedTypes = [ParsedType.string, ParsedType.object],
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
				return this._parseObject(context, argument as CharacterObject);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Character<N>> {
		// Make sure the character is the correct length
		if (argument.length > this._n) {
			this.setIssueForContext(context, {
				code: "invalid_n_length",
				maximum: this._n,
				received: argument.length,
			});
			return INVALID;
		}

		// Truncate or space-pad on the right to be exactly n characters
		if (argument.length < this._n && this._n !== Number.POSITIVE_INFINITY) argument = argument.padEnd(this._n, " ");

		return OK(new CharacterClass(argument, this._n));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Character<N>> {
		if (this.isAnyCharacter(argument)) {
			// Make sure the character is the correct length
			if (argument.n > this._n) {
				this.setIssueForContext(context, {
					code: "invalid_n_length",
					maximum: this._n,
					received: argument.n,
				});
				return INVALID;
			}

			return OK(new CharacterClass(argument.value, this._n));
		}
		if (Bit.isAnyBit(argument)) return this._parseString(context, argument.value);
		if (BitVarying.isAnyBitVarying(argument)) return this._parseString(context, argument.value);
		if (CharacterVarying.isAnyCharacterVarying(argument)) return this._parseString(context, argument.value);
		if (Name.isName(argument)) return this._parseString(context, argument.value);
		if (Text.isText(argument)) return this._parseString(context, argument.value);
		if (Int2.isInt2(argument)) return this._parseString(context, argument.toString());
		if (Int4.isInt4(argument)) return this._parseString(context, argument.toString());
		if (Int8.isInt8(argument)) return this._parseString(context, argument.value);
		if (OID.isOID(argument)) return this._parseString(context, argument.toString());
		if (UUID.isUUID(argument)) return this._parseString(context, argument.value);

		const parsedObject = hasKeys<CharacterObject>(argument, [["value", "string"]]);
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

	isCharacter(object: any): object is Character<N>;
	isCharacter<NN extends number = N>(object: any, n: NN): object is Character<NN>;
	isCharacter(object: unknown, n?: unknown): boolean {
		if (typeof n === "number") return this.setN(n).isCharacter(object);
		return object instanceof CharacterClass && object.n === this._n;
	}

	isAnyCharacter(object: any): object is Character<number> {
		return object instanceof CharacterClass;
	}

	setN<N extends number = 1>(n: N): CharacterConstructor<N> {
		return new CharacterConstructorClass<N>(n);
	}

	get n(): N {
		return this._n;
	}
}

const Character: CharacterConstructor<1> = new CharacterConstructorClass(1);

class CharacterClass<N extends number> extends PgTPBase<Character<N>> implements Character<N> {
	constructor(private _character: string, private _n: N = 1 as N) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Character<N> }> {
		const parsed = new CharacterConstructorClass(this._n).safeFrom(...input.data);
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
		return this._character;
	}

	toJSON(): CharacterObject {
		return {
			value: this._character,
		};
	}

	get character(): string {
		return this._character;
	}

	set character(character: string) {
		const parsed = new CharacterConstructorClass(this._n).safeFrom(character);
		if (parsed.success) this._character = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._character;
	}

	set value(character: string) {
		const parsed = new CharacterConstructorClass(this._n).safeFrom(character);
		if (parsed.success) this._character = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._character;
	}

	set postgres(character: string) {
		const parsed = new CharacterConstructorClass(this._n).safeFrom(character);
		if (parsed.success) this._character = parsed.data.toString();
		else throw parsed.error;
	}

	get n(): N {
		return this._n;
	}
}

export { Character, CharacterConstructor, CharacterObject };
