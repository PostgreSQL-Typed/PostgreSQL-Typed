import { randomUUID, RandomUUIDOptions } from "node:crypto";

import { types } from "pg";
import { DataType } from "postgresql-data-types";

import type { ParseContext } from "../../types/ParseContext";
import type { ParseReturnType } from "../../types/ParseReturnType";
import type { SafeEquals } from "../../types/SafeEquals";
import type { SafeFrom } from "../../types/SafeFrom";
import { arrayParser } from "../../util/arrayParser";
import { getParsedType, ParsedType } from "../../util/getParsedType";
import { hasKeys } from "../../util/hasKeys";
import { isOneOf } from "../../util/isOneOf";
import { parser } from "../../util/parser";
import { PGTPBase } from "../../util/PGTPBase";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase";
import { INVALID, OK } from "../../util/validation";

interface UUIDObject {
	uuid: string;
}

interface UUID {
	uuid: string;

	toString(): string;
	toJSON(): UUIDObject;

	equals(string: string): boolean;
	equals(object: UUID | UUIDObject): boolean;
	safeEquals(string: string): SafeEquals<UUID>;
	safeEquals(object: UUID | UUIDObject): SafeEquals<UUID>;
}

interface UUIDConstructor {
	from(string: string): UUID;
	from(object: UUID | UUIDObject): UUID;
	safeFrom(string: string): SafeFrom<UUID>;
	safeFrom(object: UUID | UUIDObject): SafeFrom<UUID>;
	/**
	 * Generates a random [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID. The UUID is generated using a
	 * cryptographic pseudorandom number generator.
	 */
	generate(options?: RandomUUIDOptions): UUID;
	/**
	 * Returns `true` if `obj` is a `UUID`, `false` otherwise.
	 */
	isUUID(obj: any): obj is UUID;
}

class UUIDConstructorClass extends PGTPConstructorBase<UUID> implements UUIDConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<UUID> {
		if (ctx.data.length !== 1) {
			this.setIssueForContext(
				ctx,
				ctx.data.length > 1
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

		const [arg] = ctx.data,
			allowedTypes = [ParsedType.string, ParsedType.object],
			parsedType = getParsedType(arg);

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.string:
				return this._parseString(ctx, arg as string);
			default:
				return this._parseObject(ctx, arg as object);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<UUID> {
		if (arg.match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i)) return OK(new UUIDClass(arg));
		if (arg.match(/^{([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})}$/i)) return OK(new UUIDClass(arg.slice(1, -1)));
		if (arg.match(/^([a-f0-9]{32})$/i)) return OK(new UUIDClass(arg.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5")));

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
		});
		return INVALID;
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<UUID> {
		if (this.isUUID(arg)) return OK(new UUIDClass(arg.uuid));
		const parsedObject = hasKeys<UUIDObject>(arg, [["uuid", "string"]]);
		if (parsedObject.success) return this._parseString(ctx, parsedObject.obj.uuid);

		switch (true) {
			case parsedObject.otherKeys.length > 0:
				this.setIssueForContext(ctx, {
					code: "unrecognized_keys",
					keys: parsedObject.otherKeys,
				});
				break;
			case parsedObject.missingKeys.length > 0:
				this.setIssueForContext(ctx, {
					code: "missing_keys",
					keys: parsedObject.missingKeys,
				});
				break;
			case parsedObject.invalidKeys.length > 0:
				this.setIssueForContext(ctx, {
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

	isUUID(obj: any): obj is UUID {
		return obj instanceof UUIDClass;
	}
}

const UUID: UUIDConstructor = new UUIDConstructorClass();

class UUIDClass extends PGTPBase<UUID> implements UUID {
	constructor(private _uuid: string) {
		super();
		this._uuid = _uuid.toLowerCase();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: UUID }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = UUID.safeFrom(...ctx.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(ctx, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._uuid;
	}

	toJSON(): UUIDObject {
		return {
			uuid: this._uuid,
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
}

types.setTypeParser(DataType.uuid as any, parser(UUID));
types.setTypeParser(DataType._uuid as any, arrayParser(UUID, ","));

export { UUID, UUIDObject };
