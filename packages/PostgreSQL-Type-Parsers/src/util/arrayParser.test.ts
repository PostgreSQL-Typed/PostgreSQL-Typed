import { describe, expect, it } from "vitest";

import { arrayParser } from "./arrayParser";

const testObject = {
	from: (value: string) => {
		const parsed = parseInt(value);
		if (isNaN(parsed)) throw new Error("Not a number");
		return parsed;
	},
};

describe("arrayParser", () => {
	const parser = arrayParser(testObject);
	it("should return an Object array if the string is valid", () => {
		expect(parser('{"0","1"}')).toStrictEqual([0, 1]);
		expect(parser("{}")).toStrictEqual([]);
	});

	it("should return null if string is invalid", () => {
		expect(parser("bla")).toBeNull();
		expect(parser('{"a","b"}')).toBeNull();
		expect(parser(null)).toBeNull();
	});
});

describe("arrayParser (+ custom delimiter)", () => {
	const parser = arrayParser(testObject, ";");
	it("should return an Object array if the string is valid", () => {
		expect(parser("{0;1}")).toStrictEqual([0, 1]);
		expect(parser("{}")).toStrictEqual([]);
	});

	it("should return null if string is invalid", () => {
		expect(parser("bla")).toBeNull();
		expect(parser("{a;b}")).toBeNull();
		expect(parser(null)).toBeNull();
	});
});
