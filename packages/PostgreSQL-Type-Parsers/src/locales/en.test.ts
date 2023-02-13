import { describe, expect, test } from "vitest";

import errorMap from "./en";

describe("locales/en", () => {
	test("IssueCode.invalid_type", () => {
		expect(() =>
			errorMap({
				code: "invalid_type",
				expected: "boolean",
				received: "string",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_type",
				expected: ["boolean", "number"],
				received: "string",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_type",
				expected: "boolean",
				received: "undefined",
			})
		).not.toThrowError();
	});

	test("IssueCode.invalid_string", () => {
		expect(() =>
			errorMap({
				code: "invalid_string",
				expected: "boolean",
				received: "string",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_string",
				expected: ["boolean", "number"],
				received: "string",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_string",
				expected: "boolean",
				received: "undefined",
			})
		).not.toThrowError();
	});

	test("IssueCode.invalid_key_type", () => {
		expect(() =>
			errorMap({
				code: "invalid_key_type",
				expected: "boolean",
				received: "string",
				objectKey: "test",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_key_type",
				expected: ["boolean", "number"],
				received: "string",
				objectKey: "test",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_key_type",
				expected: "boolean",
				received: "undefined",
				objectKey: "test",
			})
		).not.toThrowError();
	});

	test("IssueCode.invalid_timezone", () => {
		expect(() =>
			errorMap({
				code: "invalid_timezone",
				received: "string",
			})
		).not.toThrowError();
	});

	test("IssueCode.invalid_range_bound", () => {
		expect(() =>
			errorMap({
				code: "invalid_range_bound",
				lower: "string",
				upper: "string",
			})
		).not.toThrowError();
	});

	test("IssueCode.unrecognized_keys", () => {
		expect(() =>
			errorMap({
				code: "unrecognized_keys",
				keys: ["test"],
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "unrecognized_keys",
				keys: ["test1", "test2"],
			})
		).not.toThrowError();
	});

	test("IssueCode.missing_keys", () => {
		expect(() =>
			errorMap({
				code: "missing_keys",
				keys: ["test"],
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "missing_keys",
				keys: ["test1", "test2"],
			})
		).not.toThrowError();
	});

	test("IssueCode.invalid_date", () => {
		expect(() =>
			errorMap({
				code: "invalid_date",
			})
		).not.toThrowError();
	});

	test("IssueCode.invalid_luxon_date", () => {
		expect(() =>
			errorMap({
				code: "invalid_luxon_date",
			})
		).not.toThrowError();
	});

	test("IssueCode.too_small", () => {
		// array
		expect(() =>
			errorMap({
				code: "too_small",
				type: "array",
				minimum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "array",
				minimum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "array",
				minimum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// number
		expect(() =>
			errorMap({
				code: "too_small",
				type: "number",
				minimum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "number",
				minimum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "number",
				minimum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// bigint
		expect(() =>
			errorMap({
				code: "too_small",
				type: "bigint",
				minimum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "bigint",
				minimum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "bigint",
				minimum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// arguments
		expect(() =>
			errorMap({
				code: "too_small",
				type: "arguments",
				minimum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "arguments",
				minimum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				type: "arguments",
				minimum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// unknown
		expect(() =>
			errorMap({
				code: "too_small",
				type: "unknown" as any,
				minimum: 1,
			})
		).toThrowError();
	});

	test("IssueCode.too_big", () => {
		// array
		expect(() =>
			errorMap({
				code: "too_big",
				type: "array",
				maximum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "array",
				maximum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "array",
				maximum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// number
		expect(() =>
			errorMap({
				code: "too_big",
				type: "number",
				maximum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "number",
				maximum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "number",
				maximum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// bigint
		expect(() =>
			errorMap({
				code: "too_big",
				type: "bigint",
				maximum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "bigint",
				maximum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "bigint",
				maximum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// arguments
		expect(() =>
			errorMap({
				code: "too_big",
				type: "arguments",
				maximum: 1,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				type: "arguments",
				maximum: 1,
				inclusive: true,
			})
		).not.toThrowError();

		// unknown
		expect(() =>
			errorMap({
				code: "too_big",
				type: "unknown" as any,
				maximum: 1,
			})
		).toThrowError();
	});

	test("IssueCode.not_finite", () => {
		expect(() =>
			errorMap({
				code: "not_finite",
			})
		).not.toThrowError();
	});

	test("IssueCode.not_whole", () => {
		expect(() =>
			errorMap({
				code: "not_whole",
			})
		).not.toThrowError();
	});

	test("IssueCode.<invalid>", () => {
		expect(() =>
			errorMap({
				code: "invalid" as any,
			})
		).toThrowError();
	});
});
