/* eslint-disable unicorn/filename-case */

import { OID } from "@postgresql-typed/oids";
import pg from "pg";
const { types } = pg;

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

interface TextObject {
	text: string;
}

interface Text {
	text: string;

	toString(): string;
	toJSON(): TextObject;

	equals(string: string): boolean;
	equals(object: Text | TextObject): boolean;
	safeEquals(string: string): SafeEquals<Text>;
	safeEquals(object: Text | TextObject): SafeEquals<Text>;
}

interface TextConstructor {
	from(string: string): Text;
	from(object: Text | TextObject): Text;
	safeFrom(string: string): SafeFrom<Text>;
	safeFrom(object: Text | TextObject): SafeFrom<Text>;
	/**
	 * Returns `true` if `object` is a `Text`, `false` otherwise.
	 */
	isText(object: any): object is Text;
}

class TextConstructorClass extends PGTPConstructorBase<Text> implements TextConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Text> {
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
				return OK(new TextClass(argument as string));
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Text> {
		if (this.isText(argument)) return OK(new TextClass(argument.text));
		const parsedObject = hasKeys<TextObject>(argument, [["text", "string"]]);
		if (parsedObject.success) return OK(new TextClass(parsedObject.obj.text));

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

	isText(object: any): object is Text {
		return object instanceof TextClass;
	}
}

const Text: TextConstructor = new TextConstructorClass();

class TextClass extends PGTPBase<Text> implements Text {
	constructor(private _text: string) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Text }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Text.safeFrom(...context.data);
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
		return this._text;
	}

	toJSON(): TextObject {
		return {
			text: this._text,
		};
	}

	get text(): string {
		return this._text;
	}

	set text(text: string) {
		const parsed = Text.safeFrom(text);
		if (parsed.success) this._text = parsed.data.toString();
		else throw parsed.error;
	}
}

types.setTypeParser(OID.text as any, parser(Text));
types.setTypeParser(OID._text as any, arrayParser(Text, ","));

export { Text, TextConstructor, TextObject };
