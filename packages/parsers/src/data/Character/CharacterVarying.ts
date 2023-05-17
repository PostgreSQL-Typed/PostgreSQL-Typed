import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBasee } from "../../util/PgTPBasee.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";

interface CharacterVaryingObject {
	value: string;
}

interface CharacterVarying<N extends number> {
	characterVarying: string;

	value: string;
	postgres: string;

	get n(): N;

	toString(): string;
	toJSON(): CharacterVaryingObject;

	equals(string: string): boolean;
	equals(object: CharacterVarying<N> | CharacterVaryingObject): boolean;
	safeEquals(string: string): SafeEquals<CharacterVarying<N>>;
	safeEquals(object: CharacterVarying<N> | CharacterVaryingObject): SafeEquals<CharacterVarying<N>>;
}

interface CharacterVaryingConstructor<N extends number> {
	from(string: string): CharacterVarying<N>;
	from(object: CharacterVarying<N> | CharacterVaryingObject): CharacterVarying<N>;
	safeFrom(string: string): SafeFrom<CharacterVarying<N>>;
	safeFrom(object: CharacterVarying<N> | CharacterVaryingObject): SafeFrom<CharacterVarying<N>>;
	/**
	 * Returns `true` if `object` is a `CharacterVarying`, `false` otherwise.
	 */
	isCharacterVarying(object: any): object is CharacterVarying<N>;
	/**
	 * Returns `true` if `object` is a `CharacterVarying<N>`, `false` otherwise.
	 */
	isCharacterVarying<N extends number = number>(object: any, n: N): object is CharacterVarying<N>;
	/**
	 * Returns `true` if `object` is a `CharacterVarying<N>`, `false` otherwise.
	 */
	isAnyCharacterVarying(object: any): object is CharacterVarying<number>;
	/**
	 * Get a `CharacterVarying` constructor for a specific `n`.
	 * @param n The number of characters.
	 */
	setN<N extends number = number>(n: N): CharacterVaryingConstructor<N>;
	/**
	 * Get the `n` value for this `CharacterVarying` constructor.
	 * @returns The `n` value.
	 */
	get n(): N;
}

class CharacterVaryingConstructorClass<N extends number> extends PGTPConstructorBase<CharacterVarying<N>> implements CharacterVaryingConstructor<N> {
	constructor(private _n: N = Number.POSITIVE_INFINITY as N) {
		super();

		const allowedTypes = [ParsedType.number, ParsedType.infinity],
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

		if (_n > 10_485_760 && _n !== Number.POSITIVE_INFINITY) {
			throwPGTPError({
				code: "too_big",
				type: "number",
				maximum: 10_485_760,
				inclusive: true,
			});
		}

		//If limit is not a whole number
		if (_n % 1 !== 0 && _n !== Number.POSITIVE_INFINITY) {
			throwPGTPError({
				code: "not_whole",
			});
		}
	}

	_parse(context: ParseContext): ParseReturnType<CharacterVarying<N>> {
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
				return this._parseObject(context, argument as CharacterVaryingObject);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<CharacterVarying<N>> {
		// Make sure the character is the correct length
		if (argument.length > this._n) {
			this.setIssueForContext(context, {
				code: "invalid_n_length",
				maximum: this._n,
				received: argument.length,
			});
			return INVALID;
		}

		return OK(new CharacterVaryingClass(argument, this._n));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<CharacterVarying<N>> {
		if (this.isAnyCharacterVarying(argument)) {
			// Make sure the character is the correct length
			if (argument.n > this._n) {
				this.setIssueForContext(context, {
					code: "invalid_n_length",
					maximum: this._n,
					received: argument.n,
				});
				return INVALID;
			}

			return OK(new CharacterVaryingClass(argument.value, this._n));
		}

		const parsedObject = hasKeys<CharacterVaryingObject>(argument, [["value", "string"]]);
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

	isCharacterVarying(object: any): object is CharacterVarying<N>;
	isCharacterVarying<N extends number = number>(object: any, n: N): object is CharacterVarying<N>;
	isCharacterVarying(object: unknown, n?: unknown): boolean {
		if (typeof n === "number") return this.setN(n).isCharacterVarying(object);
		return object instanceof CharacterVaryingClass && object.n === this._n;
	}

	isAnyCharacterVarying(object: any): object is CharacterVarying<number> {
		return object instanceof CharacterVaryingClass;
	}

	setN<N extends number = number>(n: N): CharacterVaryingConstructor<N> {
		return new CharacterVaryingConstructorClass<N>(n);
	}

	get n(): N {
		return this._n;
	}
}

const CharacterVarying: CharacterVaryingConstructor<number> = new CharacterVaryingConstructorClass(Number.POSITIVE_INFINITY);

class CharacterVaryingClass<N extends number> extends PgTPBasee<CharacterVarying<N>> implements CharacterVarying<N> {
	constructor(private _character: string, private _n: N = Number.POSITIVE_INFINITY as N) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: CharacterVarying<N> }> {
		const parsed = new CharacterVaryingConstructorClass(this._n).safeFrom(...input.data);
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

	toJSON(): CharacterVaryingObject {
		return {
			value: this._character,
		};
	}

	get characterVarying(): string {
		return this._character;
	}

	set characterVarying(character: string) {
		const parsed = new CharacterVaryingConstructorClass(this._n).safeFrom(character);
		if (parsed.success) this._character = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._character;
	}

	set value(character: string) {
		const parsed = new CharacterVaryingConstructorClass(this._n).safeFrom(character);
		if (parsed.success) this._character = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._character;
	}

	set postgres(character: string) {
		const parsed = new CharacterVaryingConstructorClass(this._n).safeFrom(character);
		if (parsed.success) this._character = parsed.data.toString();
		else throw parsed.error;
	}

	get n(): N {
		return this._n;
	}
}

export { CharacterVarying, CharacterVaryingConstructor, CharacterVaryingObject };
