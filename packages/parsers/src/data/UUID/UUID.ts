/* eslint-disable unicorn/filename-case */
import { randomUUID, RandomUUIDOptions } from "node:crypto";

import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { Character } from "../Character/Character.js";
import { CharacterVarying } from "../Character/CharacterVarying.js";
import { Name } from "../Character/Name.js";
import { Text } from "../Character/Text.js";

interface UUIDObject {
	value: string;
}

interface UUID {
	uuid: string;

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): UUIDObject;

	equals(string: string): boolean;
	equals(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | UUIDObject): boolean;
	safeEquals(string: string): SafeEquals<UUID>;
	safeEquals(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | UUIDObject): SafeEquals<UUID>;
}

interface UUIDConstructor {
	from(string: string): UUID;
	from(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | UUIDObject): UUID;
	safeFrom(string: string): SafeFrom<UUID>;
	safeFrom(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | UUIDObject): SafeFrom<UUID>;
	/**
	 * Generates a random [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID. The UUID is generated using a
	 * cryptographic pseudorandom number generator.
	 */
	generate(options?: RandomUUIDOptions): UUID;
	/**
	 * Returns `true` if `object` is a `UUID`, `false` otherwise.
	 */
	isUUID(object: any): object is UUID;
}

class UUIDConstructorClass extends PgTPConstructorBase<UUID> implements UUIDConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<UUID> {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<UUID> {
		if (/^([\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12})$/i.test(argument)) return OK(new UUIDClass(argument));
		if (/^{([\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12})}$/i.test(argument)) return OK(new UUIDClass(argument.slice(1, -1)));
		if (/^([\da-f]{32})$/i.test(argument)) return OK(new UUIDClass(argument.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5")));

		this.setIssueForContext(context, {
			code: "invalid_string",
			expected: "LIKE xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			received: argument,
		});
		return INVALID;
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<UUID> {
		if (this.isUUID(argument)) return OK(new UUIDClass(argument.value));
		if (Character.isAnyCharacter(argument)) return this._parseString(context, argument.value);
		if (CharacterVarying.isAnyCharacterVarying(argument)) return this._parseString(context, argument.value);
		if (Name.isName(argument)) return this._parseString(context, argument.value);
		if (Text.isText(argument)) return this._parseString(context, argument.value);
		const parsedObject = hasKeys<UUIDObject>(argument, [["value", "string"]]);
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

	generate(options?: RandomUUIDOptions | undefined): UUID {
		return new UUIDClass(randomUUID(options));
	}

	isUUID(object: any): object is UUID {
		return object instanceof UUIDClass;
	}
}

const UUID: UUIDConstructor = new UUIDConstructorClass();

class UUIDClass extends PgTPBase<UUID> implements UUID {
	constructor(private _uuid: string) {
		super();
		this._uuid = _uuid.toLowerCase();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: UUID }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = UUID.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toString() === this.toString(),
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._uuid;
	}

	toJSON(): UUIDObject {
		return {
			value: this._uuid,
		};
	}

	get uuid(): string {
		return this._uuid;
	}

	set uuid(uuid: string) {
		const parsed = UUID.safeFrom(uuid);
		if (parsed.success) this._uuid = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._uuid;
	}

	set value(uuid: string) {
		const parsed = UUID.safeFrom(uuid);
		if (parsed.success) this._uuid = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._uuid;
	}

	set postgres(uuid: string) {
		const parsed = UUID.safeFrom(uuid);
		if (parsed.success) this._uuid = parsed.data.toString();
		else throw parsed.error;
	}
}

export { UUID, UUIDConstructor, UUIDObject };
