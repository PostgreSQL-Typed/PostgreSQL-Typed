import { describe, expect, it } from "vitest";

import { parser } from "./parser";

const testObject = {
	from: (value: string) => {
		const parsed = parseInt(value);
		if (isNaN(parsed)) throw new Error("Not a number");
		return parsed;
	},
};

describe("parser", () => {
	const parser2 = parser(testObject);
	it("should return an Object array if the string is valid", () => {
		expect(parser2("0")).toStrictEqual(0);
	});

	it("should return null if string is invalid", () => {
		expect(parser2("bla")).toBeNull();
		expect(parser2('{"0","1"}')).toBeNull();
		expect(parser2(null)).toBeNull();
	});
});
