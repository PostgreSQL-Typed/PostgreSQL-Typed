/* eslint-disable unicorn/filename-case */
import { describe, expect, test } from "vitest";

import { getPgTError } from "./getPgTError.js";

describe("getPgTError", () => {
	test("should throw an error", () => {
		expect(
			getPgTError({
				code: "invalid_type",
				expected: "boolean",
				received: "number",
			}).message
		).toBe("Expected 'boolean', received 'number'");
	});
});
