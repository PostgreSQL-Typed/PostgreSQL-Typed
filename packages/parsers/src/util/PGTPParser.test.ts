/* eslint-disable unicorn/filename-case */
import { describe, expect, it, test } from "vitest";

import { Bit } from "../data/Bit/Bit.js";
import { PGTPParser } from "./PGTPParser.js";

describe("PGTPParser", () => {
	test("nullable()", () => {
		const parser = PGTPParser(Bit).nullable();
		expect(parser.isValid(null)).toBe(true);
		expect(parser.isValid("test")).toBe(false);
		expect(parser.isValid("1")).toBe(true);

		//When nullable is not set, it should return false
		const parser2 = PGTPParser(Bit);
		expect(parser2.isValid(null)).toBe(false);
	});

	test("optional()", () => {
		const parser = PGTPParser(Bit).optional();
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser.isValid(undefined)).toBe(true);
		expect(parser.isValid("test")).toBe(false);
		expect(parser.isValid("1")).toBe(true);

		//When optional is not set, it should return false
		const parser2 = PGTPParser(Bit);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser2.isValid(undefined)).toBe(false);
	});

	test("isValid()", () => {
		const parser = PGTPParser(Bit);
		expect(parser.isValid("test")).toBe(false);
		expect(parser.isValid("1")).toBe(true);
		expect(parser.isValid("0")).toBe(true);
		expect(parser.isValid(Bit.setN(3).from("101"))).toBe(false);
		expect(parser.isValid(Bit.from("1"))).toBe(true);
		expect(parser.isValid(null)).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser.isValid(undefined)).toBe(false);

		const parser2 = PGTPParser("unknown");
		expect(parser2.isValid("test")).toBe(true);
		expect(parser2.isValid("1")).toBe(true);
		expect(parser2.isValid("0")).toBe(true);
		expect(parser2.isValid(Bit.setN(3).from("101"))).toBe(true);
		expect(parser2.isValid(Bit.from("1"))).toBe(true);
		expect(parser2.isValid(null)).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser2.isValid(undefined)).toBe(false);
	});

	it("should work with arrays", () => {
		const parser = PGTPParser(Bit, true);

		expect(parser.isValid(["test"])).toBe(false);
		expect(parser.isValid(["1"])).toBe(true);
		expect(parser.isValid(["0"])).toBe(true);
		expect(parser.isValid([Bit.setN(3).from("101")])).toBe(false);
		expect(parser.isValid([Bit.from("1")])).toBe(true);
		expect(parser.isValid([null])).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser.isValid([undefined])).toBe(false);
		expect(parser.isValid(["1", "0"])).toBe(true);
		expect(parser.isValid(["1", "0", null])).toBe(false);
		expect(parser.isValid(["1", "0", undefined])).toBe(false);
		expect(parser.isValid(["1", "0", "test"])).toBe(false);
		expect(parser.isValid(["1", "0", Bit.setN(3).from("101")])).toBe(false);
		expect(parser.isValid(["1", "0", Bit.from("1")])).toBe(true);

		const parser2 = PGTPParser(Bit, true).nullable();
		expect(parser2.isValid(["test"])).toBe(false);
		expect(parser2.isValid(["1"])).toBe(true);
		expect(parser2.isValid(["0"])).toBe(true);
		expect(parser2.isValid([Bit.setN(3).from("101")])).toBe(false);
		expect(parser2.isValid([Bit.from("1")])).toBe(true);
		expect(parser2.isValid(null)).toBe(true);
		expect(parser2.isValid([null])).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser2.isValid([undefined])).toBe(false);

		const parser3 = PGTPParser(Bit, true).optional();
		expect(parser3.isValid(["test"])).toBe(false);
		expect(parser3.isValid(["1"])).toBe(true);
		expect(parser3.isValid(["0"])).toBe(true);
		expect(parser3.isValid([Bit.setN(3).from("101")])).toBe(false);
		expect(parser3.isValid([Bit.from("1")])).toBe(true);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser3.isValid([undefined])).toBe(false);
		expect(parser3.isValid([null])).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(parser3.isValid(undefined)).toBe(true);
	});
});