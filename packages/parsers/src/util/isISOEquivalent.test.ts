/* eslint-disable unicorn/filename-case */
import { describe, expect, it } from "vitest";

import { isISOEquivalent } from "./isISOEquivalent.js";

describe("isISOEquivalent", () => {
	it("should return true if the 2 ISO's are equivalent", () => {
		expect(isISOEquivalent("2023-01-01T00:00:00+00:00", "2023-01-01T09:00:00+09:00")).toBe(true);
		expect(isISOEquivalent("2023-01-01T00:00:00+00:00", "2023-01-01T00:00:00+00:00")).toBe(true);
		expect(isISOEquivalent("2023-01-01T00:00:00+00:00", "2022-12-31T18:00:00-06:00")).toBe(true);

		expect(isISOEquivalent("2023-01-01T09:00:00+09:00", "2023-01-01T00:00:00+00:00")).toBe(true);
		expect(isISOEquivalent("2023-01-01T00:00:00-00:00", "2023-01-01T00:00:00-00:00")).toBe(true);
		expect(isISOEquivalent("2022-12-31T18:00:00-06:00", "2023-01-01T00:00:00+00:00")).toBe(true);
	});

	it("should return false if the 2 ISO's are not equivalent", () => {
		expect(isISOEquivalent("2023-01-01T00:00:00+00:00", "2023-01-01T09:00:00+08:00")).toBe(false);
		expect(isISOEquivalent("2023-01-01T00:00:00+00:00", "2023-01-01T00:00:00+01:00")).toBe(false);
		expect(isISOEquivalent("2023-01-01T00:00:00+00:00", "2022-12-31T18:00:00-05:00")).toBe(false);

		expect(isISOEquivalent("2023-01-01T09:00:00+08:00", "2023-01-01T00:00:00+00:00")).toBe(false);
		expect(isISOEquivalent("2023-01-01T00:00:00+01:00", "2023-01-01T00:00:00+00:00")).toBe(false);
		expect(isISOEquivalent("2022-12-31T18:00:00-05:00", "2023-01-01T00:00:00+00:00")).toBe(false);
	});
});
