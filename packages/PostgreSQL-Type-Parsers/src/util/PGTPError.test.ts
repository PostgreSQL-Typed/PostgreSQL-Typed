import { describe, expect, it } from "vitest";

import { IssueCode, PGTPError } from "./PGTPError";

describe("PGTPError", () => {
	const error = new PGTPError({
		code: "invalid_date",
		message: "Invalid date",
	});

	it("should return the correct code", () => {
		expect(error.code).toBe("invalid_date");
	});

	it("should return the correct message", () => {
		expect(error.message).toBe("Invalid date");
		expect(error.toString()).toBe("Invalid date");
	});

	it("should return the full error object", () => {
		expect(error.error).toStrictEqual({
			code: "invalid_date",
			message: "Invalid date",
		});
		expect(error.issue).toStrictEqual({
			code: "invalid_date",
			message: "Invalid date",
		});
	});

	it("all error codes should be unique", () => {
		const codes = Object.keys(IssueCode);
		expect(codes.length).toBe(new Set(codes).size);
	});
});
