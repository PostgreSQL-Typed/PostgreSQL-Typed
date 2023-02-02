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
import { throwPGTPError } from "../../util/throwPGTPError";
import { INVALID, OK } from "../../util/validation";

interface LineObject {
	a: number;
	b: number;
	c: number;
}

interface Line {
	a: number;
	b: number;
	c: number;

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
	 * Returns `true` if `obj` is a `Line`, `false` otherwise.
	 */
	isLine(obj: any): obj is Line;
}

class LineConstructorClass extends PGTPConstructorBase<Line> implements LineConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Line> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
			parsedType = getParsedType(arg);

		if (parsedType !== ParsedType.number && ctx.data.length !== 1) {
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

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(ctx, arg as string);
			case "number":
				return this._parseNumber(ctx, arg as number, otherArgs);
			default:
				return this._parseObject(ctx, arg as object);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Line> {
		// Remove all whitespace
		arg = arg.replaceAll(/\s/g, "");

		if (arg.match(/^{(?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN),(?:-?\d+(\.\d+)?|NaN)}$/)) {
			const [a, b, c] = arg
				.slice(1, -1)
				.split(",")
				.map(l => parseFloat(l));

			if (a === 0 && b === 0) {
				this.setIssueForContext(ctx, {
					code: "too_small",
					type: "number",
					minimum: 1,
					inclusive: true,
				});
				return INVALID;
			}

			return OK(new LineClass(a, b, c));
		}

		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE {a,b,c}",
		});
		return INVALID;
	}

	private _parseNumber(ctx: ParseContext, arg: number, otherArgs: any[]): ParseReturnType<Line> {
		const totalLength = otherArgs.length + 1;
		if (totalLength !== 3) {
			this.setIssueForContext(
				ctx,
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

		for (const otherArg of otherArgs) {
			const allowedTypes = [ParsedType.number],
				parsedType = getParsedType(otherArg);

			if (!isOneOf(allowedTypes, parsedType)) {
				this.setIssueForContext(ctx, {
					code: "invalid_type",
					expected: allowedTypes as ParsedType[],
					received: parsedType,
				});
				return INVALID;
			}
		}

		const [a, b, c] = [arg, ...otherArgs] as number[];
		return OK(new LineClass(a, b, c));
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Line> {
		if (this.isLine(arg)) return OK(new LineClass(arg.a, arg.b, arg.c));
		const parsedObject = hasKeys<LineObject>(arg, [
			["a", "number"],
			["b", "number"],
			["c", "number"],
		]);
		if (parsedObject.success) return OK(new LineClass(parsedObject.obj.a, parsedObject.obj.b, parsedObject.obj.c));

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

	isLine(obj: any): obj is Line {
		return obj instanceof LineClass;
	}
}

const Line: LineConstructor = new LineConstructorClass();

class LineClass extends PGTPBase<Line> implements Line {
	constructor(private _a: number, private _b: number, private _c: number) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Line }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Line.safeFrom(...ctx.data);
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
			throwPGTPError({
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
			throwPGTPError({
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
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}
		this._c = c;
	}
}

types.setTypeParser(DataType.line as any, parser(Line));
types.setTypeParser(DataType._line as any, arrayParser(Line));

export { Line, LineObject };
