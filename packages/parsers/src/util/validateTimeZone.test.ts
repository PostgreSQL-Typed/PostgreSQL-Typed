import { describe, expect, it } from "vitest";

import { validateTimeZone } from "./validateTimeZone.js";

describe("validateTimeZone", () => {
	it("should return the offset minutes for valid timezones", () => {
		expect(validateTimeZone("Asia/Seoul")).toBe(540);
		expect(validateTimeZone("Pacific/Honolulu")).toBe(-600);
		expect(validateTimeZone("Atlantic/Reykjavik")).toBe(0);
		expect(validateTimeZone("JST")).toBe(540);
		expect(validateTimeZone("EST")).toBe(-300);
		expect(validateTimeZone("UTC")).toBe(0);
	});

	it("should return false for invalid timezones", () => {
		expect(validateTimeZone("invalid/timezone")).toBe(false);
		expect(validateTimeZone("")).toBe(false);
		expect(validateTimeZone("EARTH")).toBe(false);
	});
});
