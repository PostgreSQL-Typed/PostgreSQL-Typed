import { describe, expect, it } from "vitest";
import type { ObjectFunction } from "../types/ObjectFunction.js";

import { arrayParser } from "./arrayParser.js";

const testObject = {
	from: (value: string) => {
		const parsed = Number.parseInt(value);
		if (Number.isNaN(parsed)) throw new Error("Not a number");
		return {
			value: parsed,
			postgres: parsed.toString(),
		};
	},
	safeFrom: (value: string) => {
		const parsed = Number.parseInt(value);
		if (Number.isNaN(parsed)) return null;
		return {
			value: parsed,
			postgres: parsed.toString(),
		};
	},
} as unknown as ObjectFunction<number>;

describe("arrayParser", () => {
	const parser = arrayParser(testObject);
	it("should return an Object array if the string is valid", () => {
		expect(parser('{"0","1"}')?.map(v => v.value)).toStrictEqual([0, 1]);
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
		expect(parser("{0;1}")?.map(v => v.value)).toStrictEqual([0, 1]);
		expect(parser("{}")).toStrictEqual([]);
	});

	it("should return null if string is invalid", () => {
		expect(parser("bla")).toBeNull();
		expect(parser("{a;b}")).toBeNull();
		expect(parser(null)).toBeNull();
	});
});
