/* eslint-disable unicorn/filename-case */
import { describe, expect, it, test } from "vitest";

import { Bit } from "../data/BitString/Bit.js";
import { PGTPParser, PGTPParserClass } from "./PGTPParser.js";

describe("PGTPParser", () => {
	test("nullable()", () => {
		const parser = PGTPParser(Bit).nullable();
		expect(parser.isValid(null).success).toBe(true);
		expect(parser.isValid("test").success).toBe(false);
		expect(parser.isValid("1").success).toBe(true);

		//When nullable is not set, it should return false
		const parser2 = PGTPParser(Bit);
		expect(parser2.isValid(null).success).toBe(false);

		expect(parser2).toBeInstanceOf(PGTPParserClass);
	});

	test("optional()", () => {
		const parser = PGTPParser(Bit).optional();
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser.isValid(undefined).success).toBe(true);
		expect(parser.isValid("test").success).toBe(false);
		expect(parser.isValid("1").success).toBe(true);

		//When optional is not set, it should return false
		const parser2 = PGTPParser(Bit);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser2.isValid(undefined).success).toBe(false);
	});

	test("isValid()", () => {
		const parser = PGTPParser(Bit);
		expect(parser.isValid("test").success).toBe(false);
		expect(parser.isValid("1").success).toBe(true);
		expect(parser.isValid("0").success).toBe(true);
		expect(parser.isValid(Bit.setN(3).from("101")).success).toBe(false);
		expect(parser.isValid(Bit.from("1")).success).toBe(true);
		expect(parser.isValid(null).success).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser.isValid(undefined).success).toBe(false);

		const parser2 = PGTPParser("unknown");
		expect(parser2.isValid("test").success).toBe(true);
		expect(parser2.isValid("1").success).toBe(true);
		expect(parser2.isValid("0").success).toBe(true);
		expect(parser2.isValid(Bit.setN(3).from("101")).success).toBe(true);
		expect(parser2.isValid(Bit.from("1")).success).toBe(true);
		expect(parser2.isValid(null).success).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser2.isValid(undefined).success).toBe(false);
	});

	it("should work with arrays", () => {
		const parser = PGTPParser(Bit, true);

		expect(parser.isValid(["test"]).success).toBe(false);
		expect(parser.isValid(["1"]).success).toBe(true);
		expect(parser.isValid(["0"]).success).toBe(true);
		expect(parser.isValid([Bit.setN(3).from("101")]).success).toBe(false);
		expect(parser.isValid([Bit.from("1")]).success).toBe(true);
		expect(parser.isValid([null]).success).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser.isValid([undefined]).success).toBe(false);
		expect(parser.isValid(["1", "0"]).success).toBe(true);
		expect(parser.isValid(["1", "0", null]).success).toBe(false);
		expect(parser.isValid(["1", "0", undefined]).success).toBe(false);
		expect(parser.isValid(["1", "0", "test"]).success).toBe(false);
		expect(parser.isValid(["1", "0", Bit.setN(3).from("101")]).success).toBe(false);
		expect(parser.isValid(["1", "0", Bit.from("1")]).success).toBe(true);

		const parser2 = PGTPParser(Bit, true).nullable();
		expect(parser2.isValid(["test"]).success).toBe(false);
		expect(parser2.isValid(["1"]).success).toBe(true);
		expect(parser2.isValid(["0"]).success).toBe(true);
		expect(parser2.isValid([Bit.setN(3).from("101")]).success).toBe(false);
		expect(parser2.isValid([Bit.from("1")]).success).toBe(true);
		expect(parser2.isValid(null).success).toBe(true);
		expect(parser2.isValid([null]).success).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser2.isValid([undefined]).success).toBe(false);

		const parser3 = PGTPParser(Bit, true).optional();
		expect(parser3.isValid(["test"]).success).toBe(false);
		expect(parser3.isValid(["1"]).success).toBe(true);
		expect(parser3.isValid(["0"]).success).toBe(true);
		expect(parser3.isValid([Bit.setN(3).from("101")]).success).toBe(false);
		expect(parser3.isValid([Bit.from("1")]).success).toBe(true);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser3.isValid([undefined]).success).toBe(false);
		expect(parser3.isValid([null]).success).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser3.isValid(undefined).success).toBe(true);
		expect(parser3.isValid("test").success).toBe(false);
	});
});
