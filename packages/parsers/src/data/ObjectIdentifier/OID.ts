/* eslint-disable unicorn/filename-case */
import { OID as OIDEnum } from "@postgresql-typed/oids";
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

interface OIDObject {
	oid: number;
}

interface OID {
	oid: number;

	toString(): string;
	toNumber(): number;
	toJSON(): OIDObject;

	equals(number: number): boolean;
	equals(string: string): boolean;
	equals(object: OID | OIDObject): boolean;
	safeEquals(number: number): SafeEquals<OID>;
	safeEquals(string: string): SafeEquals<OID>;
	safeEquals(object: OID | OIDObject): SafeEquals<OID>;
}

interface OIDConstructor {
	from(number: number): OID;
	from(string: string): OID;
	from(object: OID | OIDObject): OID;
	safeFrom(number: number): SafeFrom<OID>;
	safeFrom(string: string): SafeFrom<OID>;
	safeFrom(object: OID | OIDObject): SafeFrom<OID>;
	/**
	 * Returns `true` if `object` is a `OID`, `false` otherwise.
	 */
	isOID(object: any): object is OID;
}

class OIDConstructorClass extends PGTPConstructorBase<OID> implements OIDConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<OID> {
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
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.number:
				return this._parseNumber(context, argument as number);
			case ParsedType.string:
				return this._parseString(context, argument as string);
			default:
				return this._parseObject(context, argument as OIDObject);
		}
	}

	private _parseNumber(context: ParseContext, argument: number): ParseReturnType<OID> {
		if (Number.isNaN(argument)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: "number",
				received: "nan",
			});
			return INVALID;
		}
		if (!Number.isFinite(argument)) {
			this.setIssueForContext(context, {
				code: "not_finite",
			});
			return INVALID;
		}
		if (argument % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
			});
			return INVALID;
		}
		if (argument < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
			});
			return INVALID;
		}
		if (argument > 4_294_967_295) {
			this.setIssueForContext(context, {
				code: "too_big",
				type: "number",
				maximum: 4_294_967_295,
				inclusive: true,
			});
			return INVALID;
		}
		return OK(new OIDClass(argument));
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<OID> {
		//* Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");
		const parsed = Number.parseFloat(argument);
		return this._parseNumber(context, parsed);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<OID> {
		if (this.isOID(argument)) return OK(new OIDClass(argument.oid));
		const parsedObject = hasKeys<OIDObject>(argument, [["oid", "number"]]);
		if (parsedObject.success) return this._parseNumber(context, parsedObject.obj.oid);

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

	isOID(object: any): object is OID {
		return object instanceof OIDClass;
	}
}

const OID: OIDConstructor = new OIDConstructorClass();

class OIDClass extends PGTPBase<OID> implements OID {
	constructor(private _oid: number) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: OID }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = OID.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toNumber() === this.toNumber(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._oid.toString();
	}

	toNumber(): number {
		return this._oid;
	}

	toJSON(): OIDObject {
		return {
			oid: this._oid,
		};
	}

	get oid(): number {
		return this._oid;
	}

	set oid(oid: number) {
		const parsed = OID.safeFrom(oid);
		if (parsed.success) this._oid = parsed.data.toNumber();
		else throw parsed.error;
	}
}

types.setTypeParser(OIDEnum.oid as any, parser<OID>(OID));
types.setTypeParser(OIDEnum._oid as any, arrayParser<OID>(OID, ","));

export { OID, OIDConstructor, OIDObject };