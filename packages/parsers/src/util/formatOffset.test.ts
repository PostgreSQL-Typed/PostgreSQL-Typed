import { describe, expect, test } from "vitest";

import { formatOffset } from "./formatOffset";

describe("formatOffset", () => {
	test("formatOffset(...)", () => {
		expect(formatOffset({ direction: "plus", hour: 0, minute: 0 })).toBe("+00:00");
		expect(formatOffset({ direction: "minus", hour: 0, minute: 0 })).toBe("+00:00");
		expect(formatOffset({ direction: "minus", hour: 1, minute: 2 })).toBe("-01:02");
		expect(formatOffset({ direction: "plus", hour: 1, minute: 2 })).toBe("+01:02");
	});

	test("formatOffset(..., { returnZ: true })", () => {
		expect(formatOffset({ direction: "plus", hour: 0, minute: 0 }, { returnZ: true })).toBe("Z");
		expect(formatOffset({ direction: "minus", hour: 0, minute: 0 }, { returnZ: true })).toBe("Z");
		expect(formatOffset({ direction: "minus", hour: 1, minute: 2 }, { returnZ: true })).toBe("-01:02");
		expect(formatOffset({ direction: "plus", hour: 1, minute: 2 }, { returnZ: true })).toBe("+01:02");
	});

	test("formatOffset(..., { returnEmpty: true })", () => {
		expect(formatOffset({ direction: "plus", hour: 0, minute: 0 }, { returnEmpty: true })).toBe("");
		expect(formatOffset({ direction: "minus", hour: 0, minute: 0 }, { returnEmpty: true })).toBe("");
		expect(formatOffset({ direction: "minus", hour: 1, minute: 2 }, { returnEmpty: true })).toBe("-01:02");
		expect(formatOffset({ direction: "plus", hour: 1, minute: 2 }, { returnEmpty: true })).toBe("+01:02");
	});
});
