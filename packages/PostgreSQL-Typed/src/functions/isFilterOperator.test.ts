import { describe, expect, test } from "vitest";

import { isFilterOperator } from "./isFilterOperator";

describe("isFilterOperator", () => {
	test("$EQUAL", () => {
		expect(isFilterOperator("$EQUAL")).toBe(true);
	});

	test("$NOT_EQUAL", () => {
		expect(isFilterOperator("$NOT_EQUAL")).toBe(true);
	});

	test("$LESS_THAN", () => {
		expect(isFilterOperator("$LESS_THAN")).toBe(true);
	});

	test("$LESS_THAN_OR_EQUAL", () => {
		expect(isFilterOperator("$LESS_THAN_OR_EQUAL")).toBe(true);
	});

	test("$GREATER_THAN", () => {
		expect(isFilterOperator("$GREATER_THAN")).toBe(true);
	});

	test("$GREATER_THAN_OR_EQUAL", () => {
		expect(isFilterOperator("$GREATER_THAN_OR_EQUAL")).toBe(true);
	});

	test("$LIKE", () => {
		expect(isFilterOperator("$LIKE")).toBe(true);
	});

	test("$NOT_LIKE", () => {
		expect(isFilterOperator("$NOT_LIKE")).toBe(true);
	});

	test("$ILIKE", () => {
		expect(isFilterOperator("$ILIKE")).toBe(true);
	});

	test("$NOT_ILIKE", () => {
		expect(isFilterOperator("$NOT_ILIKE")).toBe(true);
	});

	test("$IN", () => {
		expect(isFilterOperator("$IN")).toBe(true);
	});

	test("$NOT_IN", () => {
		expect(isFilterOperator("$NOT_IN")).toBe(true);
	});

	test("$BETWEEN", () => {
		expect(isFilterOperator("$BETWEEN")).toBe(true);
	});

	test("$NOT_BETWEEN", () => {
		expect(isFilterOperator("$NOT_BETWEEN")).toBe(true);
	});

	test("$IS_NULL", () => {
		expect(isFilterOperator("$IS_NULL")).toBe(true);
	});

	test("$IS_NOT_NULL", () => {
		expect(isFilterOperator("$IS_NOT_NULL")).toBe(true);
	});

	test("other", () => {
		expect(isFilterOperator("other")).toBe(false);
	});
});
