import { describe, expect, it } from "vitest";

import { ParsedType } from "./getParsedType";
import { isOneOf } from "./isOneOf";

describe("isOneOf", () => {
	it("should return true when value is one of the types", () => {
		expect(isOneOf([ParsedType.string, ParsedType.number], "number")).toBe(true);
	});

	it("should return false when value is not one of the types", () => {
		expect(isOneOf([ParsedType.string, ParsedType.number], "boolean")).toBe(false);
	});
});
