import { describe, expect, test } from "vitest";

import errorMap from "./en";

describe("locales/en", () => {
	test("IssueCode.invalid_n_length", () => {
		expect(() =>
			errorMap({
				code: "invalid_n_length",
				maximum: 10,
				received: 11,
			})
		).not.toThrowError();
	});

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
				objectKey: "test",
				received: "string",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_key_type",
				expected: ["boolean", "number"],
				objectKey: "test",
				received: "string",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "invalid_key_type",
				expected: "boolean",
				objectKey: "test",
				received: "undefined",
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
				minimum: 1,
				type: "array",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				exact: true,
				minimum: 1,
				type: "array",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				type: "array",
			})
		).not.toThrowError();

		// number
		expect(() =>
			errorMap({
				code: "too_small",
				minimum: 1,
				type: "number",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				exact: true,
				minimum: 1,
				type: "number",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				type: "number",
			})
		).not.toThrowError();

		// bigint
		expect(() =>
			errorMap({
				code: "too_small",
				minimum: 1,
				type: "bigint",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				exact: true,
				minimum: 1,
				type: "bigint",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				type: "bigint",
			})
		).not.toThrowError();

		// arguments
		expect(() =>
			errorMap({
				code: "too_small",
				minimum: 1,
				type: "arguments",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				exact: true,
				minimum: 1,
				type: "arguments",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				type: "arguments",
			})
		).not.toThrowError();

		// unknown
		expect(() =>
			errorMap({
				code: "too_small",
				minimum: 1,
				type: "unknown" as any,
			})
		).toThrowError();
	});

	test("IssueCode.too_big", () => {
		// array
		expect(() =>
			errorMap({
				code: "too_big",
				maximum: 1,
				type: "array",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				exact: true,
				maximum: 1,
				type: "array",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				inclusive: true,
				maximum: 1,
				type: "array",
			})
		).not.toThrowError();

		// number
		expect(() =>
			errorMap({
				code: "too_big",
				maximum: 1,
				type: "number",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				exact: true,
				maximum: 1,
				type: "number",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				inclusive: true,
				maximum: 1,
				type: "number",
			})
		).not.toThrowError();

		// bigint
		expect(() =>
			errorMap({
				code: "too_big",
				maximum: 1,
				type: "bigint",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				exact: true,
				maximum: 1,
				type: "bigint",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				inclusive: true,
				maximum: 1,
				type: "bigint",
			})
		).not.toThrowError();

		// arguments
		expect(() =>
			errorMap({
				code: "too_big",
				maximum: 1,
				type: "arguments",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				exact: true,
				maximum: 1,
				type: "arguments",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				inclusive: true,
				maximum: 1,
				type: "arguments",
			})
		).not.toThrowError();

		// bytes
		expect(() =>
			errorMap({
				code: "too_big",
				maximum: 1,
				type: "bytes",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				exact: true,
				maximum: 1,
				type: "bytes",
			})
		).not.toThrowError();
		expect(() =>
			errorMap({
				code: "too_big",
				inclusive: true,
				maximum: 1,
				type: "bytes",
			})
		).not.toThrowError();

		// unknown
		expect(() =>
			errorMap({
				code: "too_big",
				maximum: 1,
				type: "unknown" as any,
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
