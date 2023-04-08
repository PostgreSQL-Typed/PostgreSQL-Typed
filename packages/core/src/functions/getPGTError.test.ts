/* eslint-disable unicorn/filename-case */
import { describe, expect, test } from "vitest";

import { getPGTError } from "./getPGTError.js";

describe("getPGTError", () => {
	test("should throw an error", () => {
		expect(
			getPGTError({
				code: "invalid_type",
				expected: "boolean",
				received: "number",
			}).message
		).toBe("Expected 'boolean', received 'number'");
	});
});
