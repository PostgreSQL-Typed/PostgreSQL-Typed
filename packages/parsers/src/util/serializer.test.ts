import { describe, expect, it } from "vitest";

import type { ObjectFunction } from "../types/ObjectFunction.js";
import { serializer } from "./serializer.js";

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

describe("serializer", () => {
	const serializer2 = serializer(testObject);
	it("should return a string if it is valid", () => {
		expect(serializer2("0")).toStrictEqual("0");
	});

	it("should return NULL if string is invalid", () => {
		expect(serializer2("bla")).toStrictEqual("NULL");
		expect(serializer2('{"0","1"}')).toStrictEqual("NULL");
		expect(serializer2(null)).toStrictEqual("NULL");
	});
});
