import { describe, expect, expectTypeOf, it } from "vitest";

import { INVALID, isValid, OK } from "./validation.js";

describe("isValid", () => {
	it("should return true for OK", () => {
		expect(isValid(OK(1))).toBe(true);
	});

	it("should return false for INVALID", () => {
		expect(isValid(INVALID)).toBe(false);
	});
});

describe("OK", () => {
	it("should return a valid object", () => {
		const test1 = OK("test");
		expect(test1).toEqual({ status: "valid", value: "test" });
		//@ts-expect-error - This type is equal to the return type of OK
		expectTypeOf(test1).toEqualTypeOf<{ status: "valid"; value: "test" }>();
		const test2 = OK(1);
		expect(test2).toEqual({ status: "valid", value: 1 });
		//@ts-expect-error - This type is equal to the return type of OK
		expectTypeOf(OK).toEqualTypeOf<{ status: "valid"; value: 1 }>();
	});
});

describe("INVALID", () => {
	it("should return a valid object", () => {
		expect(INVALID).toEqual({ status: "invalid" });
		expectTypeOf(INVALID).toEqualTypeOf<{ status: "invalid" }>();
	});
});
