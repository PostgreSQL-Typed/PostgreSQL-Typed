import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { UUID } from "../UUID/UUID.js";
import { Character } from "./Character.js";
import { CharacterVarying } from "./CharacterVarying.js";
import { Text } from "./Text.js";

interface NameObject {
	value: string;
}

interface Name {
	name: string;

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): NameObject;

	equals(string: string): boolean;
	equals(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | NameObject): boolean;
	safeEquals(string: string): SafeEquals<Name>;
	safeEquals(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | NameObject): SafeEquals<Name>;
}

interface NameConstructor {
	from(string: string): Name;
	from(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | NameObject): Name;
	safeFrom(string: string): SafeFrom<Name>;
	safeFrom(object: Character<number> | CharacterVarying<number> | Name | Text | UUID | NameObject): SafeFrom<Name>;
	/**
	 * Returns `true` if `object` is a `Name`, `false` otherwise.
	 */
	isName(object: any): object is Name;
}

class NameConstructorClass extends PgTPConstructorBase<Name> implements NameConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Name> {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Name> {
		//* Calculate bytes used by string
		const bytes = Buffer.byteLength(argument, "utf8");
		//* Check if string is too long
		if (bytes > 64) {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "bytes",
				maximum: 64,
				inclusive: true,
			});
			return INVALID;
		}

		return OK(new NameClass(argument));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Name> {
		if (this.isName(argument)) return OK(new NameClass(argument.value));
		if (Character.isAnyCharacter(argument)) return this._parseString(context, argument.value);
		if (CharacterVarying.isAnyCharacterVarying(argument)) return this._parseString(context, argument.value);
		if (Text.isText(argument)) return this._parseString(context, argument.value);
		if (UUID.isUUID(argument)) return this._parseString(context, argument.value);
		const parsedObject = hasKeys<NameObject>(argument, [["value", "string"]]);
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

	isName(object: any): object is Name {
		return object instanceof NameClass;
	}
}

const Name: NameConstructor = new NameConstructorClass();

class NameClass extends PgTPBase<Name> implements Name {
	constructor(private _name: string) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Name }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Name.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._name;
	}

	toJSON(): NameObject {
		return {
			value: this._name,
		};
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		const parsed = Name.safeFrom(name);
		if (parsed.success) this._name = parsed.data.toString();
		else throw parsed.error;
	}

	get value(): string {
		return this._name;
	}

	set value(name: string) {
		const parsed = Name.safeFrom(name);
		if (parsed.success) this._name = parsed.data.toString();
		else throw parsed.error;
	}

	get postgres(): string {
		return this._name;
	}

	set postgres(name: string) {
		const parsed = Name.safeFrom(name);
		if (parsed.success) this._name = parsed.data.toString();
		else throw parsed.error;
	}
}

export { Name, NameConstructor, NameObject };
