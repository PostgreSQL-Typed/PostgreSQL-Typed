import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBasee } from "../../util/PgTPConstructorBasee.js";
import { throwPgTPErrorr } from "../../util/throwPgTPErrorr.js";

interface LineObject {
	a: number;
	b: number;
	c: number;
}

interface Line {
	a: number;
	b: number;
	c: number;

	value: string;
	postgres: string;

	toString(): string;
	toJSON(): LineObject;

	equals(string: string): boolean;
	equals(object: Line | LineObject): boolean;
	equals(a: number, b: number, c: number): boolean;
	safeEquals(string: string): SafeEquals<Line>;
	safeEquals(object: Line | LineObject): SafeEquals<Line>;
	safeEquals(a: number, b: number, c: number): SafeEquals<Line>;
}

interface LineConstructor {
	from(string: string): Line;
	from(object: Line | LineObject): Line;
	from(a: number, b: number, c: number): Line;
	safeFrom(string: string): SafeFrom<Line>;
	safeFrom(object: Line | LineObject): SafeFrom<Line>;
	safeFrom(a: number, b: number, c: number): SafeFrom<Line>;
	/**
	 * Returns `true` if `object` is a `Line`, `false` otherwise.
	 */
	isLine(object: any): object is Line;
}

class LineConstructorClass extends PgTPConstructorBasee<Line> implements LineConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Line> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.number && context.data.length !== 1) {
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

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(context, argument as string);
			case "number":
				return this._parseNumber(context, argument as number, otherArguments);
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Line> {
		// Remove all whitespace
		argument = argument.replaceAll(/\s/g, "");

		if (/^{(?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)}$/.test(argument)) {
			const [a, b, c] = argument
				.slice(1, -1)
				.split(",")
				.map(l => Number.parseFloat(l));

			if (a === 0 && b === 0) {
				this.setIssueForContext(context, {
					code: "too_small",
					type: "number",
					minimum: 1,
					inclusive: true,
				});
				return INVALID;
			}

			return OK(new LineClass(a, b, c));
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE {a,b,c}",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Line> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 3) {
			this.setIssueForContext(
				context,
				totalLength > 3
					? {
							code: "too_big",
							type: "arguments",
							maximum: 3,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 3,
							exact: true,
					  }
			);
			return INVALID;
		}

		for (const otherArgument of otherArguments) {
			const allowedTypes = [ParsedType.number],
				parsedType = getParsedType(otherArgument);

			if (!isOneOf(allowedTypes, parsedType)) {
				this.setIssueForContext(context, {
					code: "invalid_type",
					expected: allowedTypes as ParsedType[],
					received: parsedType,
				});
				return INVALID;
			}
		}

		const [a, b, c] = [argument, ...otherArguments] as number[];
		return OK(new LineClass(a, b, c));
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Line> {
		if (this.isLine(argument)) return OK(new LineClass(argument.a, argument.b, argument.c));
		const parsedObject = hasKeys<LineObject>(argument, [
			["a", "number"],
			["b", "number"],
			["c", "number"],
		]);
		if (parsedObject.success) return OK(new LineClass(parsedObject.obj.a, parsedObject.obj.b, parsedObject.obj.c));

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

	isLine(object: any): object is Line {
		return object instanceof LineClass;
	}
}

const Line: LineConstructor = new LineConstructorClass();

class LineClass extends PgTPBase<Line> implements Line {
	constructor(private _a: number, private _b: number, private _c: number) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Line }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Line.safeFrom(...context.data);
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
		return `{${this._a},${this._b},${this._c}}`;
	}

	toJSON(): LineObject {
		return {
			a: this._a,
			b: this._b,
			c: this._c,
		};
	}

	get a(): number {
		return this._a;
	}

	set a(a: number) {
		const parsedType = getParsedType(a);
		if (parsedType !== ParsedType.number) {
			throwPgTPErrorr({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._a = a;
	}

	get b(): number {
		return this._b;
	}

	set b(b: number) {
		const parsedType = getParsedType(b);
		if (parsedType !== ParsedType.number) {
			throwPgTPErrorr({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._b = b;
	}

	get c(): number {
		return this._c;
	}

	set c(c: number) {
		const parsedType = getParsedType(c);
		if (parsedType !== ParsedType.number) {
			throwPgTPErrorr({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._c = c;
	}

	get value(): string {
		return this.toString();
	}

	set value(line: string) {
		const parsed = Line.safeFrom(line);
		if (parsed.success) {
			this._a = parsed.data.a;
			this._b = parsed.data.b;
			this._c = parsed.data.c;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(line: string) {
		const parsed = Line.safeFrom(line);
		if (parsed.success) {
			this._a = parsed.data.a;
			this._b = parsed.data.b;
			this._c = parsed.data.c;
		} else throw parsed.error;
	}
}

export { Line, LineConstructor, LineObject };
