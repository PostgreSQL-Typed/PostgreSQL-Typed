import { describe, expect, it } from "vitest";

import type { ObjectFunction } from "../types/ObjectFunction.js";
import { arraySerializer } from "./arraySerializer.js";

const testObjectNumber = {
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
	} as unknown as ObjectFunction<number>,
	testObjectString = {
		from: (value: string) => {
			const parsed = Number.parseInt(value);
			if (!Number.isNaN(parsed)) throw new Error("Input should not be a number");
			return {
				postgres: value,
				value,
			};
		},
		safeFrom: (value: string) => {
			const parsed = Number.parseInt(value);
			if (!Number.isNaN(parsed)) return null;
			return {
				postgres: value,
				value,
			};
		},
	} as unknown as ObjectFunction<string>;

describe("arraySerializer", () => {
	const serializer = arraySerializer(testObjectNumber);
	it("should return a string if the Array is valid", () => {
		expect(serializer([0, 1])).toStrictEqual('{"0","1"}');
		expect(serializer([])).toStrictEqual("{}");
	});

	it("should return null if string is invalid", () => {
		expect(serializer(["bla"])).toStrictEqual("NULL");
		expect(serializer('{"a","b"}')).toStrictEqual('{"a","b"}');
		expect(serializer(null)).toStrictEqual("NULL");
	});
});

describe("arraySerializer (+ custom delimiter)", () => {
	const serializer = arraySerializer(testObjectNumber, ";");
	it("should return a string if the Array is valid", () => {
		expect(serializer([0, 1])).toStrictEqual("{0;1}");
		expect(serializer([])).toStrictEqual("{}");
	});

	it("should return null if string is invalid", () => {
		expect(serializer(["bla"])).toStrictEqual("NULL");
		expect(serializer("{a;b}")).toStrictEqual("{a;b}");
		expect(serializer(null)).toStrictEqual("NULL");
	});
});

describe("arraySerializer (text with quotes)", () => {
	const serializer = arraySerializer(testObjectString);
	it("should return a string if the Array is valid", () => {
		expect(serializer(["a", "b"])).toStrictEqual('{"a","b"}');
		expect(serializer(['a or "b"', "c"])).toStrictEqual('{"a or \\"b\\"","c"}');
		expect(serializer([])).toStrictEqual("{}");
	});

	it("should return null if string is invalid", () => {
		expect(serializer(["1"])).toStrictEqual("NULL");
		expect(serializer('{"a","b"}')).toStrictEqual('{"a","b"}');
		expect(serializer(null)).toStrictEqual("NULL");
	});
});
