import { describe, expect, test } from "vitest";

import { isRootFilterOperator } from "./isRootFilterOperator";

describe("isRootFilterOperator", () => {
	test("$AND", () => {
		expect(isRootFilterOperator("$AND")).toBe(true);
	});

	test("$OR", () => {
		expect(isRootFilterOperator("$OR")).toBe(true);
	});

	test("other", () => {
		expect(isRootFilterOperator("other")).toBe(false);
	});
});
