import { describe, expect, test } from "vitest";

import { formatOffset } from "./formatOffset";

describe("formatOffset", () => {
	test("formatOffset(...)", () => {
		expect(formatOffset({ hour: 0, minute: 0, direction: "plus" })).toBe("+00:00");
		expect(formatOffset({ hour: 0, minute: 0, direction: "minus" })).toBe("+00:00");
		expect(formatOffset({ hour: 1, minute: 2, direction: "minus" })).toBe("-01:02");
		expect(formatOffset({ hour: 1, minute: 2, direction: "plus" })).toBe("+01:02");
	});

	test("formatOffset(..., { returnZ: true })", () => {
		expect(formatOffset({ hour: 0, minute: 0, direction: "plus" }, { returnZ: true })).toBe("Z");
		expect(formatOffset({ hour: 0, minute: 0, direction: "minus" }, { returnZ: true })).toBe("Z");
		expect(formatOffset({ hour: 1, minute: 2, direction: "minus" }, { returnZ: true })).toBe("-01:02");
		expect(formatOffset({ hour: 1, minute: 2, direction: "plus" }, { returnZ: true })).toBe("+01:02");
	});

	test("formatOffset(..., { returnEmpty: true })", () => {
		expect(formatOffset({ hour: 0, minute: 0, direction: "plus" }, { returnEmpty: true })).toBe("");
		expect(formatOffset({ hour: 0, minute: 0, direction: "minus" }, { returnEmpty: true })).toBe("");
		expect(formatOffset({ hour: 1, minute: 2, direction: "minus" }, { returnEmpty: true })).toBe("-01:02");
		expect(formatOffset({ hour: 1, minute: 2, direction: "plus" }, { returnEmpty: true })).toBe("+01:02");
	});
});
