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
});
