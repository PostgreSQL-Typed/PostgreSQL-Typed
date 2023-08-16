/* eslint-disable unicorn/filename-case */
import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";

interface JSONObject {
	value: string;
}

interface JSON {
	json: Record<string, unknown> | unknown[] | string | number | boolean | null;

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): JSONObject;

	equals(record: Record<string, unknown>): boolean;
	equals(array: unknown[]): boolean;
	equals(type: string | number | boolean | null): boolean;
	equals(object: JSON | JSONObject): boolean;
	safeEquals(record: Record<string, unknown>): SafeEquals<JSON>;
	safeEquals(array: unknown[]): SafeEquals<JSON>;
	safeEquals(type: string | number | boolean | null): SafeEquals<JSON>;
	safeEquals(object: JSON | JSONObject): SafeEquals<JSON>;
}

interface JSONConstructor {
	from(record: Record<string, unknown>): JSON;
	from(array: unknown[]): JSON;
	from(type: string | number | boolean | null): JSON;
	from(object: JSON | JSONObject): JSON;
	safeFrom(record: Record<string, unknown>): SafeFrom<JSON>;
	safeFrom(array: unknown[]): SafeFrom<JSON>;
	safeFrom(type: string | number | boolean | null): SafeFrom<JSON>;
	safeFrom(object: JSON | JSONObject): SafeFrom<JSON>;
	/**
	 * Returns `true` if `object` is a `JSON`, `false` otherwise.
	 */
	isJSON(object: any): object is JSON;
}

class JSONConstructorClass extends PgTPConstructorBase<JSON> implements JSONConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<JSON> {
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
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType.null, ParsedType.array, ParsedType.boolean],
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
			case ParsedType.object:
				return this._parseObject(context, argument as JSONObject);
			case ParsedType.array:
			case ParsedType.number:
			case ParsedType.boolean:
			case ParsedType.null:
				return this._tryParse(context, argument);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string, retried = false): ParseReturnType<JSON> {
		try {
			const parsed = globalThis.JSON.parse(argument);
			if (typeof parsed === "string" && !retried) return this._parseString(context, parsed, true);
			return OK(new JSONClass(parsed));
		} catch {
			if (retried) return OK(new JSONClass(argument));
			this.setIssueForContext(context, {
				code: "invalid_json",
				received: argument,
			});
			return INVALID;
		}
	}

	private _tryParse(context: ParseContext, argument: unknown): ParseReturnType<JSON> {
		try {
			const parsed = globalThis.JSON.parse(globalThis.JSON.stringify(argument));
			return OK(new JSONClass(parsed));
			/* c8 ignore next 7 */
		} catch {
			this.setIssueForContext(context, {
				code: "invalid_json",
				received: `${argument}`,
			});
			return INVALID;
		}
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<JSON> {
		if (this.isJSON(argument)) return OK(new JSONClass(argument.json));
		const parsedObject = hasKeys<JSONObject>(argument, [["value", "string"]]);
		if (parsedObject.success) return this._parseString(context, parsedObject.obj.value);
		return OK(new JSONClass(argument as Record<string, unknown>));
	}

	isJSON(object: any): object is JSON {
		return object instanceof JSONClass;
	}
}

const JSON: JSONConstructor = new JSONConstructorClass();

class JSONClass extends PgTPBase<JSON> implements JSON {
	constructor(private _json: Record<string, unknown> | unknown[] | string | number | boolean | null) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: JSON }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = JSON.safeFrom(...input.data);
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
		return globalThis.JSON.stringify(this._json);
	}

	toJSON(): JSONObject {
		return {
			value: this.toString(),
		};
	}

	get json(): Record<string, unknown> | unknown[] | string | number | boolean | null {
		return this._json;
	}

	set json(json: Record<string, unknown> | unknown[] | string | number | boolean | null) {
		const parsed = JSON.safeFrom(json as string);
		if (parsed.success) this._json = parsed.data.json;
		else throw parsed.error;
	}

	get value(): string {
		return this.toString();
	}

	set value(json: string) {
		const parsed = JSON.safeFrom(json as string);
		if (parsed.success) this._json = parsed.data.json;
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(json: string) {
		const parsed = JSON.safeFrom(json);
		if (parsed.success) this._json = parsed.data.json;
		else throw parsed.error;
	}
}

export { JSON, JSONConstructor, JSONObject };
