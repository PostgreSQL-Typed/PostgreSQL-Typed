/* eslint-disable unicorn/filename-case */

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
import { INVALID, OK } from "../../util/validation.js";

interface NameObject {
	name: string;
}

interface Name {
	name: string;

	toString(): string;
	toJSON(): NameObject;

	equals(string: string): boolean;
	equals(object: Name | NameObject): boolean;
	safeEquals(string: string): SafeEquals<Name>;
	safeEquals(object: Name | NameObject): SafeEquals<Name>;
}

interface NameConstructor {
	from(string: string): Name;
	from(object: Name | NameObject): Name;
	safeFrom(string: string): SafeFrom<Name>;
	safeFrom(object: Name | NameObject): SafeFrom<Name>;
	/**
	 * Returns `true` if `object` is a `Name`, `false` otherwise.
	 */
	isName(object: any): object is Name;
}

class NameConstructorClass extends PGTPConstructorBase<Name> implements NameConstructor {
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
		if (this.isName(argument)) return OK(new NameClass(argument.name));
		const parsedObject = hasKeys<NameObject>(argument, [["name", "string"]]);
		if (parsedObject.success) return this._parseString(context, parsedObject.obj.name);

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

class NameClass extends PGTPBase<Name> implements Name {
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
			name: this._name,
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
}

types.setTypeParser(OID.name as any, parser(Name));
types.setTypeParser(OID._name as any, arrayParser(Name, ","));

export { Name, NameConstructor, NameObject };