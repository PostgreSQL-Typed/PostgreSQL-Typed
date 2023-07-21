/* eslint-disable @typescript-eslint/ban-types */

import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";

interface ByteAObject {
	value: Buffer;
}

interface ByteA {
	bytea: Buffer;

	value: Buffer;
	postgres: string;

	toString(): string;
	toBuffer(): Buffer;
	toJSON(): ByteAObject;

	equals(string: string): boolean;
	equals(buffer: Buffer): boolean;
	equals(object: ByteA | ByteAObject): boolean;
	safeEquals(string: string): SafeEquals<ByteA>;
	safeEquals(buffer: Buffer): SafeEquals<ByteA>;
	safeEquals(object: ByteA | ByteAObject): SafeEquals<ByteA>;
}

interface ByteAConstructor {
	from(string: string): ByteA;
	from(buffer: Buffer): ByteA;
	from(object: ByteA | ByteAObject): ByteA;
	safeFrom(string: string): SafeFrom<ByteA>;
	safeFrom(buffer: Buffer): SafeFrom<ByteA>;
	safeFrom(object: ByteA | ByteAObject): SafeFrom<ByteA>;
	/**
	 * Returns `true` if `object` is a `ByteA`, `false` otherwise.
	 */
	isByteA(object: any): object is ByteA;
}

class ByteAConstructorClass extends PgTPConstructorBase<ByteA> implements ByteAConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<ByteA> {
		if (context.data.length !== 1) {
			this.setIssueForContext(
				context,
				context.data.length > 1
					? {
							code: "too_big",
							type: "arguments",
							maximum: 1,
							exact: true,
							received: context.data.length,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 1,
							exact: true,
							received: context.data.length,
					  }
			);
			return INVALID;
		}

		const [argument] = context.data,
			allowedTypes = [ParsedType.string, ParsedType.object, ParsedType.Buffer],
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
				return this._parseObject(context, argument as ByteAObject);
			case ParsedType.Buffer:
				return OK(new ByteAClass(argument as Buffer));
			default:
				//* Stringify the argument to make sure it's a string
				return this._parseString(`${argument}`);
		}
	}

	private _parseString(argument: string): ParseReturnType<ByteA> {
		if (/^\\x/.test(argument)) return OK(new ByteAClass(Buffer.from(argument.slice(2), "hex")));
		return this._parseBinaryString(argument);
	}

	private _parseBinaryString(argument: string): ParseReturnType<ByteA> {
		let binary = "",
			index = 0;
		while (index < argument.length) {
			if (argument[index] === "\\") {
				if (/[0-7]{3}/.test(argument.slice(index + 1, index + 4))) {
					binary += String.fromCodePoint(Number.parseInt(argument.slice(index + 1, index + 4), 8));
					index += 4;
				} else {
					let backslashes = 1;
					while (index + backslashes < argument.length && argument[index + backslashes] === "\\") backslashes++;
					for (let k = 0; k < Math.floor(backslashes / 2); ++k) binary += "\\";
					index += Math.floor(backslashes / 2) * 2;
				}
			} else {
				binary += argument[index];
				++index;
			}
		}
		return OK(new ByteAClass(Buffer.from(binary, "binary")));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<ByteA> {
		if (this.isByteA(argument)) return OK(new ByteAClass(argument.value));
		const parsedObject = hasKeys<ByteAObject>(argument, [["value", "Buffer"]]);
		if (parsedObject.success) return OK(new ByteAClass(parsedObject.obj.value));

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

	isByteA(object: any): object is ByteA {
		return object instanceof ByteAClass;
	}
}

const ByteA: ByteAConstructor = new ByteAConstructorClass();

class ByteAClass extends PgTPBase<ByteA> implements ByteA {
	constructor(private _bytea: Buffer) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: ByteA }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = ByteA.safeFrom(...input.data);
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
		return `\\x${this._bytea.toString("hex")}`;
	}

	toBuffer(): Buffer {
		return this._bytea;
	}

	toJSON(): ByteAObject {
		return {
			value: this._bytea,
		};
	}

	get bytea(): Buffer {
		return this._bytea;
	}

	set bytea(bytea: Buffer) {
		const parsed = ByteA.safeFrom(bytea);
		if (parsed.success) this._bytea = parsed.data.toBuffer();
		else throw parsed.error;
	}

	get value(): Buffer {
		return this._bytea;
	}

	set value(buffer: Buffer) {
		const parsed = ByteA.safeFrom(buffer);
		if (parsed.success) this._bytea = parsed.data.toBuffer();
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(bytea: string) {
		const parsed = ByteA.safeFrom(bytea);
		if (parsed.success) this._bytea = parsed.data.toBuffer();
		else throw parsed.error;
	}
}

export { ByteA, ByteAConstructor, ByteAObject };
