import { describe, expect, it } from "vitest";

import { isValidDate } from "./isValidDate";

describe("isValidDate", () => {
	it("should return true if the Date is valid", () => {
		const test1 = isValidDate(new Date());
		expect(test1.isOfSameType).toBe(true);
		if (test1.isOfSameType) expect(test1.isValid).toBe(true);
		else expect.fail();
		const test2 = isValidDate(new Date("2023-01-01T00:00:00+00:00"));
		expect(test2.isOfSameType).toBe(true);
		if (test2.isOfSameType) expect(test2.isValid).toBe(true);
		else expect.fail();
		const test3 = isValidDate(new Date("2023-01-01T00:00:00+09:00"));
		expect(test3.isOfSameType).toBe(true);
		if (test3.isOfSameType) expect(test3.isValid).toBe(true);
		else expect.fail();
		const test4 = isValidDate(new Date("2023-01-01T00:00:00-09:00"));
		expect(test4.isOfSameType).toBe(true);
		if (test4.isOfSameType) expect(test4.isValid).toBe(true);
		else expect.fail();
	});

	it("should return false if the Date is invalid", () => {
		const test1 = isValidDate(new Date("foo"));
		expect(test1.isOfSameType).toBe(true);
		if (test1.isOfSameType) {
			expect(test1.isValid).toBe(false);
			if (test1.isValid) expect.fail();
			else expect(test1.error.code).toBe("invalid_date");
		} else expect.fail();
		const test2 = isValidDate(true);
		expect(test2.isOfSameType).toBe(false);
		if (test2.isOfSameType) expect.fail();
	});
});
