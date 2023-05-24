/* eslint-disable unicorn/filename-case */
import { getParsedType, INVALID, OK, type ParseReturnType } from "@postgresql-typed/util";
import { describe, expect, it } from "vitest";

import type { ParseContext } from "../types/ParseContext.js";
import { PgTPConstructorBase } from "./PgTPConstructorBase.js";

class TestClass extends PgTPConstructorBase<string> {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<string> {
		const [argument] = context.data,
			type = getParsedType(argument);

		if (type === "string") return OK(argument as string);
		if (type === "number") return OK((argument as number).toString());
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

const test = new TestClass();

describe("PgTPConstructorBase", () => {
	it("should parse without errors", () => {
		expect(test.from("test")).toBe("test");
		expect(test.from(123)).toBe("123");

		const result1 = test.safeFrom("test"),
			result2 = test.safeFrom(123);

		expect(result1.success).toBe(true);
		if (result1.success) expect(result1.data).toBe("test");
		else expect.fail();

		expect(result2.success).toBe(true);
		if (result2.success) expect(result2.data).toBe("123");
		else expect.fail();
	});

	it("should parse with errors", () => {
		expect(() => test.from(null)).toThrowError();
		expect(() => test.from(true)).toThrowError();

		const result1 = test.safeFrom(null),
			result2 = test.safeFrom(true);

		expect(result1.success).toBe(false);
		if (result1.success) expect.fail();
		else expect(result1.error.message).toBe("Expected 'string' | 'number', received 'null'");

		expect(result2.success).toBe(false);
		if (result2.success) expect.fail();
		else expect(result2.error.message).toBe("Expected 'string' | 'number', received 'boolean'");
	});

	it("should throw error if parse with errors but no issue was set", () => {
		expect(() => test.from(BigInt(1))).toThrowError("Validation failed but no issue detected.");
		expect(() => test.safeFrom(BigInt(1))).toThrowError("Validation failed but no issue detected.");
	});
});
