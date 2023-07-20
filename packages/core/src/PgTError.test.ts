/* eslint-disable unicorn/filename-case */
import { PgTPError } from "@postgresql-typed/parsers";
import { describe, expect, it } from "vitest";

import { defineInt2 } from "./definers/index.js";
import { table as pgTable } from "./index.js";
import { PgTError } from "./PgTError.js";

describe("PgTError", () => {
	const table = pgTable("test_table", {
			id: defineInt2("id"),
		}),
		error = new PgTError(
			table.id,
			new PgTPError({
				code: "invalid_date",
				message: "Invalid date",
			})
		);

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
		expect(error.PgTPError.issue).toStrictEqual({
			code: "invalid_date",
			message: "Invalid date",
		});
	});

	it("should return column", () => {
		expect(error.column).toEqual(table.id);
	});
});
