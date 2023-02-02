import { describe, expect, test } from "vitest";

import { throwPGTPError } from "./throwPGTPError";

describe("throwPGTPError", () => {
	test("should throw an error", () => {
		expect(() => {
			throwPGTPError({
				code: "invalid_string",
				expected: "test1",
				received: "test2",
			});
		}).toThrowError("Expected 'test1', received 'test2'");
	});
});
