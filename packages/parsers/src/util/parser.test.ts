import { describe, expect, it } from "vitest";

import type { ObjectFunction } from "../types/ObjectFunction.js";
import { parser } from "./parser.js";

const testObject = {
	from: (value: string) => {
		const parsed = Number.parseInt(value);
		if (Number.isNaN(parsed)) throw new Error("Not a number");
		return {
			postgres: parsed.toString(),
			value: parsed,
		};
	},
	safeFrom: (value: string) => {
		const parsed = Number.parseInt(value);
		if (Number.isNaN(parsed)) return null;
		return {
			postgres: parsed.toString(),
			value: parsed,
		};
	},
} as unknown as ObjectFunction<number>;

describe("parser", () => {
	const parser2 = parser(testObject);
	it("should return an Object array if the string is valid", () => {
		expect(parser2("0")?.value).toStrictEqual(0);
	});

	it("should return null if string is invalid", () => {
		expect(parser2("bla")).toBeNull();
		expect(parser2('{"0","1"}')).toBeNull();
		expect(parser2(null)).toBeNull();
	});
});
