/* eslint-disable unicorn/filename-case */
import { describe, expect, test } from "vitest";

import { throwPgTPError } from "./throwPgTPError.js";

describe("throwPgTPError", () => {
	test("should throw an error", () => {
		expect(() => {
			throwPgTPError({
				code: "invalid_string",
				expected: "test1",
				received: "test2",
			});
		}).toThrowError("Expected 'test1', received 'test2'");
	});
});
