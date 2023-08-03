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
import { UUID } from "../UUID/UUID.js";

interface EnumObject {
	value: string;
}

interface Enum<EnumValues extends string, Enums extends Readonly<[EnumValues, ...EnumValues[]]>> {
	enum: string;

	value: string;
	postgres: string;

	get enums(): Enums;

	toString(): string;
	toJSON(): EnumObject;

	equals(string: string): boolean;
	equals(object: Character<number> | CharacterVarying<number> | Enum<string, [string, ...string[]]> | Name | Text | UUID | EnumObject): boolean;
	safeEquals(string: string): SafeEquals<Enum<EnumValues, Enums>>;
	safeEquals(
		object: Character<number> | CharacterVarying<number> | Enum<string, [string, ...string[]]> | Name | Text | UUID | EnumObject
	): SafeEquals<Enum<EnumValues, Enums>>;
}

interface EnumConstructor<EnumValues extends string, Enums extends Readonly<[EnumValues, ...EnumValues[]]>> {
	from(string: string): Enum<EnumValues, Enums>;
	from(object: Character<number> | CharacterVarying<number> | Enum<string, [string, ...string[]]> | Name | Text | UUID | EnumObject): Enum<EnumValues, Enums>;
	safeFrom(string: string): SafeFrom<Enum<EnumValues, Enums>>;
	safeFrom(
		object: Character<number> | CharacterVarying<number> | Enum<string, [string, ...string[]]> | Name | Text | UUID | EnumObject
	): SafeFrom<Enum<EnumValues, Enums>>;
	/**
	 * Returns `true` if `object` is a `Enum`, `false` otherwise.
	 */
	isEnum(object: any): object is Enum<EnumValues, Enums>;
	/**
	 * Returns `true` if `object` is a `Enum<EnumValues,Enums>`, `false` otherwise.
	 */
	isEnum<EEnumValues extends string, EEnums extends Readonly<[EEnumValues, ...EEnumValues[]]>>(object: any, enums: EEnums): object is Enum<EEnumValues, EEnums>;
	/**
	 * Returns `true` if `object` is a `Enum<string>`, `false` otherwise.
	 */
	isAnyEnum(object: any): object is Enum<string, [string, ...string[]]>;
	/**
	 * Get a `Enum` constructor for a specific `n`.
	 * @param enums An array of strings representing the enum values.
	 */
	setEnums<EEnumValues extends string, EEnums extends Readonly<[EEnumValues, ...EEnumValues[]]>>(enums: EEnums): EnumConstructor<EEnumValues, EEnums>;
	/**
	 * Get the `Enums` value for this `Enum` constructor.
	 * @returns The `Enums` value.
	 */
	get enums(): Enums;
}

/* eslint-disable brace-style */
class EnumConstructorClass<EnumValues extends string, Enums extends Readonly<[EnumValues, ...EnumValues[]]>>
	extends PgTPConstructorBase<Enum<EnumValues, Enums>>
	implements EnumConstructor<EnumValues, Enums>
{
	constructor(private _enums: Enums) {
		super();

		/* eslint-enable brace-style */

		const allowedTypes = [ParsedType.array],
			parsedType = getParsedType(_enums);

		if (!isOneOf(allowedTypes, parsedType)) {
			throwPgTPError({
				code: "invalid_type",
				expected: allowedTypes,
				received: parsedType,
			});
		}

		for (const enumValue of _enums) {
			if (typeof enumValue !== "string") {
				throwPgTPError({
					code: "invalid_type",
					expected: [ParsedType.string],
					received: getParsedType(enumValue),
				});
			}
		}

		this._enums = [...new Set(_enums)] as unknown as Enums;
	}

	_parse(context: ParseContext): ParseReturnType<Enum<EnumValues, Enums>> {
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
			allowedTypes = [ParsedType.string, ParsedType.object],
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
			case ParsedType.string:
				return this._parseString(context, argument as string);
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Enum<EnumValues, Enums>> {
		if (!this.enums.includes(argument as EnumValues)) {
			this.setIssueForContext(context, {
				code: "invalid_string",
				expected: this.enums as unknown as string[],
				received: argument,
			});
			return INVALID;
		}

		return OK(new EnumClass(argument, this._enums));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Enum<EnumValues, Enums>> {
		if (this.isAnyEnum(argument)) return this._parseString(context, argument.value);
		if (Character.isAnyCharacter(argument)) return this._parseString(context, argument.value);
		if (CharacterVarying.isAnyCharacterVarying(argument)) return this._parseString(context, argument.value);
		if (Name.isName(argument)) return this._parseString(context, argument.value);
		if (Text.isText(argument)) return this._parseString(context, argument.value);
		if (UUID.isUUID(argument)) return this._parseString(context, argument.value);
		const parsedObject = hasKeys<EnumObject>(argument, [["value", "string"]]);
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

	isEnum(object: any): object is Enum<EnumValues, Enums>;
	isEnum<EEnumValues extends string, EEnums extends Readonly<[EEnumValues, ...EEnumValues[]]>>(object: any, enums: EEnums): object is Enum<EEnumValues, EEnums>;
	isEnum(object: unknown, enums?: unknown): boolean {
		if (Array.isArray(enums)) return this.setEnums(enums as unknown as Enums).isEnum(object);

		return (
			object instanceof EnumClass &&
			Array.isArray(object.enums) &&
			object.enums.length === this._enums.length &&
			object.enums.every(v => this._enums.includes(v))
		);
	}

	isAnyEnum(object: any): object is Enum<string, [string, ...string[]]> {
		return object instanceof EnumClass;
	}

	setEnums<EEnumValues extends string, EEnums extends readonly [EEnumValues, ...EEnumValues[]]>(enums: EEnums): EnumConstructor<EEnumValues, EEnums> {
		return new EnumConstructorClass<EEnumValues, EEnums>(enums) as EnumConstructor<EEnumValues, EEnums>;
	}

	get enums(): Enums {
		return this._enums;
	}
}

const Enum: EnumConstructorClass<string, ["No", "Enums", "Setupped", "Yet"]> = new EnumConstructorClass(["No", "Enums", "Setupped", "Yet"]);

/* eslint-disable brace-style */
class EnumClass<EnumValues extends string, Enums extends Readonly<[EnumValues, ...EnumValues[]]>>
	extends PgTPBase<Enum<EnumValues, Enums>>
	implements Enum<EnumValues, Enums>
{
	constructor(
		private _enum: string,
		private _enums: Enums
	) {
		super();
	}

	/* eslint-enable brace-style */

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Enum<EnumValues, Enums> }> {
		const parsed = new EnumConstructorClass(this._enums).safeFrom(...input.data);
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
		return this._enum;
	}

	toJSON(): EnumObject {
		return {
			value: this._enum,
		};
	}

	get enum(): string {
		return this._enum;
	}

	set enum(value: string) {
		const parsed = new EnumConstructorClass(this._enums).safeFrom(value);
		if (parsed.success) this._enum = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._enum;
	}

	set value(character: string) {
		const parsed = new EnumConstructorClass(this._enums).safeFrom(character);
		if (parsed.success) this._enum = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._enum;
	}

	set postgres(character: string) {
		const parsed = new EnumConstructorClass(this._enums).safeFrom(character);
		if (parsed.success) this._enum = parsed.data.toString();
		else throw parsed.error;
	}

	get enums(): Enums {
		return this._enums;
	}
}

export { Enum, EnumConstructor, EnumObject };
