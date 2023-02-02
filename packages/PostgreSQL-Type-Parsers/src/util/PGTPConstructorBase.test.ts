import { describe, expect, it } from "vitest";

import type { ParseContext } from "../types/ParseContext";
import type { ParseReturnType } from "../types/ParseReturnType";
import { getParsedType } from "./getParsedType";
import { PGTPConstructorBase } from "./PGTPConstructorBase";
import { INVALID, OK } from "./validation";

class TestClass extends PGTPConstructorBase<string> {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<string> {
		const [arg] = ctx.data,
			type = getParsedType(arg);

		if (type === "string") return OK(arg as string);
		if (type === "number") return OK((arg as number).toString());
		if (type === "bigint") return INVALID;
		else {
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: ["string", "number"],
				received: type,
			});
			return INVALID;
		}
	}
}

const test = new TestClass();

describe("PGTPConstructorBase", () => {
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
		if (!result1.success) expect(result1.error.message).toBe("Expected 'string' | 'number', received 'null'");
		else expect.fail();

		expect(result2.success).toBe(false);
		if (!result2.success) expect(result2.error.message).toBe("Expected 'string' | 'number', received 'boolean'");
		else expect.fail();
	});

	it("should throw error if parse with errors but no issue was set", () => {
		expect(() => test.from(BigInt(1))).toThrowError("Validation failed but no issue detected.");
		expect(() => test.safeFrom(BigInt(1))).toThrowError("Validation failed but no issue detected.");
	});
});
