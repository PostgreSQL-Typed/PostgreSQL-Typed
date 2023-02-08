import { describe, expect, it } from "vitest";

import { getBigNumber } from "./getBigNumber.js";

describe("getBigNumber", () => {
	it("should return a function", () => {
		expect(getBigNumber("-1000", "1000")).toBeInstanceOf(Function);
	});
});

describe("BigNumber", () => {
	const BigNumber = getBigNumber("-1000", "1000");
	it("should parse Infinity", () => {
		const test1 = BigNumber(Number.POSITIVE_INFINITY);
		expect(test1.success).toBe(true);
		if (!test1.success) expect.fail();
		expect(test1.data.toNumber()).toBe(Number.POSITIVE_INFINITY);

		const test2 = BigNumber(Number.NEGATIVE_INFINITY);
		expect(test2.success).toBe(true);
		if (!test2.success) expect.fail();
		expect(test2.data.toNumber()).toBe(Number.NEGATIVE_INFINITY);

		// It works with strings
		const test3 = BigNumber("Infinity");
		expect(test3.success).toBe(true);
		if (!test3.success) expect.fail();
		expect(test3.data.toNumber()).toBe(Number.POSITIVE_INFINITY);

		const test4 = BigNumber("-Infinity");
		expect(test4.success).toBe(true);
		if (!test4.success) expect.fail();
		expect(test4.data.toNumber()).toBe(Number.NEGATIVE_INFINITY);

		// It is not case sensitive
		const test5 = BigNumber("iNfInItY");
		expect(test5.success).toBe(true);
		if (!test5.success) expect.fail();
		expect(test5.data.toNumber()).toBe(Number.POSITIVE_INFINITY);

		const test6 = BigNumber("-iNfInItY");
		expect(test6.success).toBe(true);
		if (!test6.success) expect.fail();
		expect(test6.data.toNumber()).toBe(Number.NEGATIVE_INFINITY);

		// It also works with a "+" sign
		const test7 = BigNumber("+Infinity");
		expect(test7.success).toBe(true);
		if (!test7.success) expect.fail();
		expect(test7.data.toNumber()).toBe(Number.POSITIVE_INFINITY);
	});

	it("should parse NaN", () => {
		const test1 = BigNumber(Number.NaN);
		expect(test1.success).toBe(true);
		if (!test1.success) expect.fail();
		expect(test1.data.isNaN()).toBe(true);

		const test2 = BigNumber("NaN");
		expect(test2.success).toBe(true);
		if (!test2.success) expect.fail();
		expect(test2.data.isNaN()).toBe(true);

		// It is not case sensitive
		const test3 = BigNumber("nan");
		expect(test3.success).toBe(true);
		if (!test3.success) expect.fail();
		expect(test3.data.isNaN()).toBe(true);
	});

	it("should parse numbers", () => {
		const test1 = BigNumber(1);
		expect(test1.success).toBe(true);
		if (!test1.success) expect.fail();
		expect(test1.data.toNumber()).toBe(1);

		const test2 = BigNumber("1");
		expect(test2.success).toBe(true);
		if (!test2.success) expect.fail();
		expect(test2.data.toNumber()).toBe(1);

		const test3 = BigNumber(1.1);
		expect(test3.success).toBe(true);
		if (!test3.success) expect.fail();
		expect(test3.data.toNumber()).toBe(1.1);

		const test4 = BigNumber("1.1");
		expect(test4.success).toBe(true);
		if (!test4.success) expect.fail();
		expect(test4.data.toNumber()).toBe(1.1);

		const test5 = BigNumber(1.1e1);
		expect(test5.success).toBe(true);
		if (!test5.success) expect.fail();
		expect(test5.data.toNumber()).toBe(11);

		const test6 = BigNumber("1.1e1");
		expect(test6.success).toBe(true);
		if (!test6.success) expect.fail();
		expect(test6.data.toNumber()).toBe(11);

		const test7 = BigNumber(1.1e-1);
		expect(test7.success).toBe(true);
		if (!test7.success) expect.fail();
		expect(test7.data.toNumber()).toBe(0.11);

		const test8 = BigNumber("1.1e-1");
		expect(test8.success).toBe(true);
		if (!test8.success) expect.fail();
		expect(test8.data.toNumber()).toBe(0.11);

		// Should work with negative numbers
		const test9 = BigNumber(-1);
		expect(test9.success).toBe(true);
		if (!test9.success) expect.fail();
		expect(test9.data.toNumber()).toBe(-1);

		const test10 = BigNumber("-1");
		expect(test10.success).toBe(true);
		if (!test10.success) expect.fail();
		expect(test10.data.toNumber()).toBe(-1);

		const test11 = BigNumber(-1.1);
		expect(test11.success).toBe(true);
		if (!test11.success) expect.fail();
		expect(test11.data.toNumber()).toBe(-1.1);

		const test12 = BigNumber("-1.1");
		expect(test12.success).toBe(true);
		if (!test12.success) expect.fail();
		expect(test12.data.toNumber()).toBe(-1.1);

		const test13 = BigNumber(-1.1e1);
		expect(test13.success).toBe(true);
		if (!test13.success) expect.fail();
		expect(test13.data.toNumber()).toBe(-11);

		const test14 = BigNumber("-1.1e1");
		expect(test14.success).toBe(true);
		if (!test14.success) expect.fail();
		expect(test14.data.toNumber()).toBe(-11);

		const test15 = BigNumber(-1.1e-1);
		expect(test15.success).toBe(true);
		if (!test15.success) expect.fail();
		expect(test15.data.toNumber()).toBe(-0.11);

		const test16 = BigNumber("-1.1e-1");
		expect(test16.success).toBe(true);
		if (!test16.success) expect.fail();
		expect(test16.data.toNumber()).toBe(-0.11);
	});

	it("should parse numbers with decimals", () => {
		const test1 = BigNumber(1.1);
		expect(test1.success).toBe(true);
		if (!test1.success) expect.fail();
		expect(test1.data.toNumber()).toBe(1.1);

		const test2 = BigNumber("1.1");
		expect(test2.success).toBe(true);
		if (!test2.success) expect.fail();
		expect(test2.data.toNumber()).toBe(1.1);

		const test3 = BigNumber(1.1e1);
		expect(test3.success).toBe(true);
		if (!test3.success) expect.fail();
		expect(test3.data.toNumber()).toBe(11);

		const test4 = BigNumber("1.1e1");
		expect(test4.success).toBe(true);
		if (!test4.success) expect.fail();
		expect(test4.data.toNumber()).toBe(11);

		const test5 = BigNumber(1.1e-1);
		expect(test5.success).toBe(true);
		if (!test5.success) expect.fail();
		expect(test5.data.toNumber()).toBe(0.11);

		const test6 = BigNumber("1.1e-1");
		expect(test6.success).toBe(true);
		if (!test6.success) expect.fail();
		expect(test6.data.toNumber()).toBe(0.11);

		// Should work with negative numbers
		const test7 = BigNumber(-1.1);
		expect(test7.success).toBe(true);
		if (!test7.success) expect.fail();
		expect(test7.data.toNumber()).toBe(-1.1);

		const test8 = BigNumber("-1.1");
		expect(test8.success).toBe(true);
		if (!test8.success) expect.fail();
		expect(test8.data.toNumber()).toBe(-1.1);

		const test9 = BigNumber(-1.1e1);
		expect(test9.success).toBe(true);
		if (!test9.success) expect.fail();
		expect(test9.data.toNumber()).toBe(-11);

		const test10 = BigNumber("-1.1e1");
		expect(test10.success).toBe(true);
		if (!test10.success) expect.fail();
		expect(test10.data.toNumber()).toBe(-11);

		const test11 = BigNumber(-1.1e-1);
		expect(test11.success).toBe(true);
		if (!test11.success) expect.fail();
		expect(test11.data.toNumber()).toBe(-0.11);
	});

	it("should parse bigints", () => {
		const test1 = BigNumber(1n);
		expect(test1.success).toBe(true);
		if (!test1.success) expect.fail();
		expect(test1.data.toNumber()).toBe(1);

		const test2 = BigNumber(BigInt("1"));
		expect(test2.success).toBe(true);
		if (!test2.success) expect.fail();
		expect(test2.data.toNumber()).toBe(1);

		// Should work with negative numbers
		const test3 = BigNumber(-1n);
		expect(test3.success).toBe(true);
		if (!test3.success) expect.fail();
		expect(test3.data.toNumber()).toBe(-1);

		const test4 = BigNumber(BigInt("-1"));
		expect(test4.success).toBe(true);
		if (!test4.success) expect.fail();
		expect(test4.data.toNumber()).toBe(-1);
	});

	it("should parse BigNumbers", () => {
		const test1 = BigNumber((BigNumber(1) as any).data);
		expect(test1.success).toBe(true);
		if (!test1.success) expect.fail();
		expect(test1.data.toNumber()).toBe(1);

		// Should work with negative numbers
		const test2 = BigNumber((BigNumber(-1) as any).data);
		expect(test2.success).toBe(true);
		if (!test2.success) expect.fail();
		expect(test2.data.toNumber()).toBe(-1);
	});

	it("should not allow too big numbers", () => {
		const test1 = BigNumber(1.1e100);
		expect(test1.success).toBe(false);
		if (test1.success) expect.fail();
		expect(test1.error.code).toBe("too_big");
	});

	it("should not allow too small numbers", () => {
		const test1 = BigNumber(-1.1e100);
		expect(test1.success).toBe(false);
		if (test1.success) expect.fail();
		expect(test1.error.code).toBe("too_small");
	});

	it("should not allow random input", () => {
		const test1 = BigNumber("hello");
		expect(test1.success).toBe(false);
		if (test1.success) expect.fail();
		expect(test1.error.code).toBe("invalid_string");

		const test2 = BigNumber("1.1.1");
		expect(test2.success).toBe(false);
		if (test2.success) expect.fail();
		expect(test2.error.code).toBe("invalid_string");

		const test3 = BigNumber("1.1e1.1");
		expect(test3.success).toBe(false);
		if (test3.success) expect.fail();
		expect(test3.error.code).toBe("invalid_string");

		const test4 = BigNumber("1.1e1e1");
		expect(test4.success).toBe(false);
		if (test4.success) expect.fail();
		expect(test4.error.code).toBe("invalid_string");
	});
});
