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
import { throwPGTPError } from "../../util/throwPGTPError.js";
import { INVALID, OK } from "../../util/validation.js";

interface CharacterObject {
	character: string;
}

interface Character<N extends number> {
	character: string;

	get n(): N;

	toString(): string;
	toJSON(): CharacterObject;

	equals(string: string): boolean;
	equals(object: Character<N> | CharacterObject): boolean;
	safeEquals(string: string): SafeEquals<Character<N>>;
	safeEquals(object: Character<N> | CharacterObject): SafeEquals<Character<N>>;
}

interface CharacterConstructor<N extends number> {
	from(string: string): Character<N>;
	from(object: Character<N> | CharacterObject): Character<N>;
	safeFrom(string: string): SafeFrom<Character<N>>;
	safeFrom(object: Character<N> | CharacterObject): SafeFrom<Character<N>>;
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

class CharacterConstructorClass<N extends number> extends PGTPConstructorBase<Character<N>> implements CharacterConstructor<N> {
	constructor(private _n: N = 1 as N) {
		super();

		const allowedTypes = [ParsedType.number],
			parsedType = getParsedType(_n);

		if (!isOneOf(allowedTypes, parsedType)) {
			throwPGTPError({
				code: "invalid_type",
				expected: allowedTypes,
				received: parsedType,
			});
		}

		if (_n < 1) {
			throwPGTPError({
				code: "too_small",
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (_n > 10_485_760) {
			throwPGTPError({
				code: "too_big",
				type: "number",
				maximum: 10_485_760,
				inclusive: true,
			});
		}

		if (_n % 1 !== 0) {
			//If limit is not a whole number
			throwPGTPError({
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
				exact: true,
			});
			return INVALID;
		}

		// Truncate or space-pad on the right to be exactly n characters
		if (argument.length < this._n) argument = argument.padEnd(this._n, " ");

		return OK(new CharacterClass(argument, this._n));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Character<N>> {
		if (this.isAnyCharacter(argument)) {
			// Make sure the character is the correct length
			if (argument.n !== this._n) {
				this.setIssueForContext(context, {
					code: "invalid_n_length",
					maximum: this._n,
					received: argument.n,
					exact: true,
				});
				return INVALID;
			}

			return OK(new CharacterClass(argument.character, this._n));
		}

		const parsedObject = hasKeys<CharacterObject>(argument, [["character", "string"]]);
		if (parsedObject.success) return this._parseString(context, parsedObject.obj.character);

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

class CharacterClass<N extends number> extends PGTPBase<Character<N>> implements Character<N> {
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
			character: this._character,
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

	get n(): N {
		return this._n;
	}
}

types.setTypeParser(OID.char as any, parser<Character<1>>(Character));
types.setTypeParser(OID.bpchar as any, parser<Character<1>>(Character));
types.setTypeParser(OID._char as any, arrayParser<Character<1>>(Character, ","));
types.setTypeParser(OID._bpchar as any, arrayParser<Character<1>>(Character, ","));

export { Character, CharacterConstructor, CharacterObject };
