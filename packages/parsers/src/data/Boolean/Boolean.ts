/* eslint-disable @typescript-eslint/ban-types */
import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";

interface BooleanObject {
	value: boolean;
}

interface Boolean {
	boolean: boolean;

	value: boolean;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toBoolean(): boolean;
	toJSON(): BooleanObject;

	equals(number: number): boolean;
	equals(string: string): boolean;
	equals(boolean: boolean): boolean;
	equals(object: Boolean | BooleanObject): boolean;
	safeEquals(number: number): SafeEquals<Boolean>;
	safeEquals(string: string): SafeEquals<Boolean>;
	safeEquals(boolean: boolean): SafeEquals<Boolean>;
	safeEquals(object: Boolean | BooleanObject): SafeEquals<Boolean>;
}

interface BooleanConstructor {
	from(number: number): Boolean;
	from(string: string): Boolean;
	from(boolean: boolean): Boolean;
	from(object: Boolean | BooleanObject): Boolean;
	safeFrom(number: number): SafeFrom<Boolean>;
	safeFrom(string: string): SafeFrom<Boolean>;
	safeFrom(boolean: boolean): SafeFrom<Boolean>;
	safeFrom(object: Boolean | BooleanObject): SafeFrom<Boolean>;
	/**
	 * Returns `true` if `object` is a `Boolean`, `false` otherwise.
	 */
	isBoolean(object: any): object is Boolean;
}

class BooleanConstructorClass extends PgTPConstructorBase<Boolean> implements BooleanConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Boolean> {
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
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType.boolean],
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
				return this._parseObject(context, argument as BooleanObject);
			default:
				//* Stringify the argument to make sure it's a string
				return this._parseString(context, `${argument}`);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Boolean> {
		//* Make sure the argument is lowercase and remove all whitespace
		argument = argument.toLowerCase().replaceAll(/\s/g, "");
		const trueValues = ["true", "t", "yes", "y", "1", "on"],
			falseValues = ["false", "f", "no", "n", "0", "off", "of"];
		if (trueValues.includes(argument)) return OK(new BooleanClass(true));
		if (falseValues.includes(argument)) return OK(new BooleanClass(false));
		this.setIssueForContext(context, {
			code: "invalid_string",
			expected: [...trueValues, ...falseValues],
			received: argument,
		});
		return INVALID;
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Boolean> {
		if (this.isBoolean(argument)) return OK(new BooleanClass(argument.value));
		const parsedObject = hasKeys<BooleanObject>(argument, [["value", "boolean"]]);
		if (parsedObject.success) return OK(new BooleanClass(parsedObject.obj.value));

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

	isBoolean(object: any): object is Boolean {
		return object instanceof BooleanClass;
	}
}

const Boolean: BooleanConstructor = new BooleanConstructorClass();

class BooleanClass extends PgTPBase<Boolean> implements Boolean {
	constructor(private _boolean: boolean) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Boolean }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Boolean.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toBoolean() === this.toBoolean(),
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._boolean.toString();
	}

	toNumber(): number {
		return this._boolean ? 1 : 0;
	}

	toBoolean(): boolean {
		return this._boolean;
	}

	toJSON(): BooleanObject {
		return {
			value: this._boolean,
		};
	}

	get boolean(): boolean {
		return this._boolean;
	}

	set boolean(bool: boolean) {
		const parsed = Boolean.safeFrom(bool);
		if (parsed.success) this._boolean = parsed.data.toBoolean();
		else throw parsed.error;
	}

	get value(): boolean {
		return this._boolean;
	}

	set value(bool: boolean) {
		const parsed = Boolean.safeFrom(bool);
		if (parsed.success) this._boolean = parsed.data.toBoolean();
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(bool: string) {
		const parsed = Boolean.safeFrom(bool);
		if (parsed.success) this._boolean = parsed.data.toBoolean();
		else throw parsed.error;
	}
}

export { Boolean, BooleanConstructor, BooleanObject };
