import { describe, expect, test } from "vitest";

import { isJoinType } from "./isJoinType";

describe("isJoinType", () => {
	test("CROSS", () => {
		expect(isJoinType("CROSS")).toBe(true);
	});

	test("NATURAL", () => {
		expect(isJoinType("NATURAL")).toBe(true);
	});

	test("NATURAL INNER", () => {
		expect(isJoinType("NATURAL INNER")).toBe(true);
	});

	test("NATURAL LEFT", () => {
		expect(isJoinType("NATURAL LEFT")).toBe(true);
	});

	test("NATURAL RIGHT", () => {
		expect(isJoinType("NATURAL RIGHT")).toBe(true);
	});

	test("INNER", () => {
		expect(isJoinType("INNER")).toBe(true);
	});

	test("LEFT", () => {
		expect(isJoinType("LEFT")).toBe(true);
	});

	test("RIGHT", () => {
		expect(isJoinType("RIGHT")).toBe(true);
	});

	test("FULL", () => {
		expect(isJoinType("FULL")).toBe(true);
	});

	test("FULL OUTER", () => {
		expect(isJoinType("FULL OUTER")).toBe(true);
	});

	test("other", () => {
		expect(isJoinType("other")).toBe(false);
	});
});
