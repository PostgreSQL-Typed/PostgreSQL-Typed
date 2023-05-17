/* eslint-disable unicorn/filename-case */
import { getParsedType, INVALID, OK, type ParseReturnType } from "@postgresql-typed/util";
import { describe, expect, it } from "vitest";

import type { ParseContext } from "../types/ParseContext.js";
import { PGTPBase } from "./PGTPBase.js";
import { PGTPConstructorBase } from "./PgTPConstructorBasee.js";

class TestConstructorClass extends PGTPConstructorBase<TestClass> {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<TestClass> {
		const [argument] = context.data,
			type = getParsedType(argument);

		if (type === "string") return OK(new TestClass(argument as string));
		if (type === "number") return OK(new TestClass((argument as number).toString()));
		if (type === "bigint") return INVALID;
		else {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: ["string", "number"],
				received: type,
			});
			return INVALID;
		}
	}
}

const test = new TestConstructorClass();

class TestClass extends PGTPBase<TestClass> {
	constructor(private _data: string) {
		super();
	}

	toString(): string {
		return this._data;
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: TestClass }> {
		const parsed = test.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		// This is to test the fallback if no issue is set in the context
		if (!parsed.error.message.includes("nan")) this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	get value(): string {
		return this._data;
	}
}

describe("PGTPBase", () => {
	const result1 = test.from("test");

	it("should parse input without errors, and run _equals", () => {
		const equalsResult1 = result1.safeEquals("test");
		expect(equalsResult1.success).toBe(true);
		if (equalsResult1.success) expect(equalsResult1.equals).toBe(true);
		else expect.fail();

		const equalsResult2 = result1.safeEquals(123);
		expect(equalsResult2.success).toBe(true);
		if (equalsResult2.success) expect(equalsResult2.equals).toBe(false);
		else expect.fail();

		expect(result1.equals("test")).toBe(true);
		expect(result1.equals(123)).toBe(false);
	});

	it("should parse input with errors", () => {
		expect(() => result1.equals(null)).toThrowError();
		expect(() => result1.equals(true)).toThrowError();

		const equalsResult1 = result1.safeEquals(null),
			equalsResult2 = result1.safeEquals(true);

		expect(equalsResult1.success).toBe(false);
		if (equalsResult1.success) expect.fail();
		else expect(equalsResult1.error.message).toBe("Expected 'string' | 'number', received 'null'");

		expect(equalsResult2.success).toBe(false);
		if (equalsResult2.success) expect.fail();
		else expect(equalsResult2.error.message).toBe("Expected 'string' | 'number', received 'boolean'");
	});

	it("should throw error if parse with errors but no issue was set", () => {
		expect(() => result1.equals(BigInt(1))).toThrowError("Validation failed but no issue detected.");
		expect(() => result1.safeEquals(BigInt(1))).toThrowError("Validation failed but no issue detected.");
		expect(() => result1.equals(Number.NaN)).toThrowError("Validation failed but no issue detected.");
		expect(() => result1.safeEquals(Number.NaN)).toThrowError("Validation failed but no issue detected.");
	});
});
