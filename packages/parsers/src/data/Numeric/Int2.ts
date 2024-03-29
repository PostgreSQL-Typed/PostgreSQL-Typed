import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";

interface Int2Object {
	value: number;
}

interface Int2 {
	int2: number;

	value: number;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toJSON(): Int2Object;

	equals(number: number): boolean;
	equals(string: string): boolean;
	equals(object: Int2 | Int2Object): boolean;
	safeEquals(number: number): SafeEquals<Int2>;
	safeEquals(string: string): SafeEquals<Int2>;
	safeEquals(object: Int2 | Int2Object): SafeEquals<Int2>;
}

interface Int2Constructor {
	from(number: number): Int2;
	from(string: string): Int2;
	from(object: Int2 | Int2Object): Int2;
	safeFrom(number: number): SafeFrom<Int2>;
	safeFrom(string: string): SafeFrom<Int2>;
	safeFrom(object: Int2 | Int2Object): SafeFrom<Int2>;
	/**
	 * Returns `true` if `object` is a `Int2`, `false` otherwise.
	 */
	isInt2(object: any): object is Int2;
}

class Int2ConstructorClass extends PgTPConstructorBase<Int2> implements Int2Constructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Int2> {
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
				return this._parseObject(context, argument as Int2Object);
		}
	}

	private _parseNumber(context: ParseContext, argument: number): ParseReturnType<Int2> {
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
				received: argument,
			});
			return INVALID;
		}
		if (argument % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
				received: argument,
			});
			return INVALID;
		}
		if (argument < -32_768) {
			this.setIssueForContext(context, {
				code: "too_small",
				inclusive: true,
				minimum: -32_768,
				received: argument,
				type: "number",
			});
			return INVALID;
		}
		if (argument > 32_767) {
			this.setIssueForContext(context, {
				code: "too_big",
				inclusive: true,
				maximum: 32_767,
				received: argument,
				type: "number",
			});
			return INVALID;
		}
		return OK(new Int2Class(argument));
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Int2> {
		const parsed = Number.parseFloat(argument);
		return this._parseNumber(context, parsed);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Int2> {
		if (this.isInt2(argument)) return OK(new Int2Class(argument.value));
		const parsedObject = hasKeys<Int2Object>(argument, [["value", "number"]]);
		if (parsedObject.success) return this._parseNumber(context, parsedObject.obj.value);

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

	isInt2(object: any): object is Int2 {
		return object instanceof Int2Class;
	}
}

const Int2: Int2Constructor = new Int2ConstructorClass();

class Int2Class extends PgTPBase<Int2> implements Int2 {
	constructor(private _int2: number) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Int2 }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Int2.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toNumber() === this.toNumber(),
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return this._int2.toString();
	}

	toNumber(): number {
		return this._int2;
	}

	toJSON(): Int2Object {
		return {
			value: this._int2,
		};
	}

	get int2(): number {
		return this._int2;
	}

	set int2(int2: number) {
		const parsed = Int2.safeFrom(int2);
		if (parsed.success) this._int2 = parsed.data.toNumber();
		else throw parsed.error;
	}

	get value(): number {
		return this._int2;
	}

	set value(int2: number) {
		const parsed = Int2.safeFrom(int2);
		if (parsed.success) this._int2 = parsed.data.toNumber();
		else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(int2: string) {
		const parsed = Int2.safeFrom(int2);
		if (parsed.success) this._int2 = parsed.data.toNumber();
		else throw parsed.error;
	}
}

export { Int2, Int2Constructor, Int2Object };
