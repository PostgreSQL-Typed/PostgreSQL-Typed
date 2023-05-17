/* eslint-disable unicorn/filename-case */
import { describe, expect, it } from "vitest";

import { IssueCode, PgTErrorr } from "./PgTErrorr.js";

describe("PGTPError", () => {
	const error = new PgTErrorr({
		code: "invalid_type",
		expected: "string",
		received: "number",
		message: "Invalid type",
	});

	it("should return the correct code", () => {
		expect(error.code).toBe("invalid_type");
	});

	it("should return the correct message", () => {
		expect(error.message).toBe("Invalid type");
		expect(error.toString()).toBe("Invalid type");
	});

	it("should return the full error object", () => {
		expect(error.error).toStrictEqual({
			code: "invalid_type",
			expected: "string",
			received: "number",
			message: "Invalid type",
		});
		expect(error.issue).toStrictEqual({
			code: "invalid_type",
			expected: "string",
			received: "number",
			message: "Invalid type",
		});
	});

	it("all error codes should be unique", () => {
		const codes = Object.keys(IssueCode);
		expect(codes.length).toBe(new Set(codes).size);
	});
});
