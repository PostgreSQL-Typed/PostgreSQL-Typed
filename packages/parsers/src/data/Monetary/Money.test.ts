import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { Money } from "./Money.js";

describe("MoneyConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Money.safeFrom(1).success).toBe(true);
		expect(Money.safeFrom(10.5).success).toBe(true);
		expect(Money.safeFrom(-10.5).success).toBe(true);
		expect(Money.safeFrom("1").success).toBe(true);
		expect(Money.safeFrom("92233720368547758.07").success).toBe(true);
		expect(Money.safeFrom("-92233720368547758.08").success).toBe(true);
		expect(Money.safeFrom(Money.from(1)).success).toBe(true);
		expect(Money.safeFrom(Money.from(10.5)).success).toBe(true);
		expect(Money.safeFrom(Money.from(-10.5)).success).toBe(true);
		expect(
			Money.safeFrom({
				value: "1",
			}).success
		).toBe(true);
		expect(
			Money.safeFrom({
				value: "92233720368547758.07",
			}).success
		).toBe(true);
		expect(
			Money.safeFrom({
				value: "-92233720368547758.08",
			}).success
		).toBe(true);
		expect(Money.safeFrom(BigInt(1)).success).toBe(true);
		expect(Money.safeFrom(Money.from(-1).value).success).toBe(true);
		expect(Money.safeFrom(1.5).success).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Money.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "bigNumber", "bigint"],
				received: "boolean",
				message: "Expected 'number' | 'string' | 'object' | 'bigNumber' | 'bigint', received 'boolean'",
			});
		}

		const nanString = Money.safeFrom("abc");
		expect(nanString.success).toEqual(false);
		if (nanString.success) expect.fail();
		else {
			expect(nanString.error.issue).toStrictEqual({
				code: "invalid_string",
				expected: "LIKE 1.23",
				received: "abc",
				message: "Expected 'LIKE 1.23', received 'abc'",
			});
		}

		const tooBig = Money.safeFrom("10e400");
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "too_big",
				type: "number",
				maximum: "92233720368547758.07",
				inclusive: true,
				message: "Number must be less than or equal to 92233720368547758.07",
			});
		}

		const tooSmall = Money.safeFrom("-10e400");
		expect(tooSmall.success).toEqual(false);
		if (tooSmall.success) expect.fail();
		else {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				type: "number",
				minimum: "-92233720368547758.08",
				inclusive: true,
				message: "Number must be greater than or equal to -92233720368547758.08",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Money.safeFrom(1, 2);
		expect(tooManyArguments.success).toEqual(false);
		if (tooManyArguments.success) expect.fail();
		else {
			expect(tooManyArguments.error.issue).toStrictEqual({
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooFewArguments = Money.safeFrom();
		expect(tooFewArguments.success).toEqual(false);
		if (tooFewArguments.success) expect.fail();
		else {
			expect(tooFewArguments.error.issue).toStrictEqual({
				code: "too_small",
				type: "arguments",
				minimum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
			});
		}

		const unrecognizedKeys = Money.safeFrom({
			value: 1,
			unrecognized: true,
		} as any);
		expect(unrecognizedKeys.success).toEqual(false);
		if (unrecognizedKeys.success) expect.fail();
		else {
			expect(unrecognizedKeys.error.issue).toStrictEqual({
				code: "unrecognized_keys",
				keys: ["unrecognized"],
				message: "Unrecognized key in object: 'unrecognized'",
			});
		}

		const missingKeys = Money.safeFrom({
			// value: 1,
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["value"],
				message: "Missing key in object: 'value'",
			});
		}

		const invalidKeys = Money.safeFrom({
			value: 1,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "value",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'value', received 'number'",
			});
		}
		//#endregion
	});

	test("isMoney(...)", () => {
		//* it should return true in isMoney when value is a Money
		expect(Money.isMoney(Money.from(1))).toBe(true);

		//* it should return false in isMoney when value is not a Money
		expect(Money.isMoney(1)).toEqual(false);
		expect(Money.isMoney("1")).toEqual(false);
		expect(Money.isMoney({})).toEqual(false);
		expect(Money.isMoney({ money: 1 })).toEqual(false);
	});
});

describe("Money", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const money = Money.from(1);
		expect(money.equals(Money.from(1))).toBe(true);
		expect(money.equals(Money.from(2))).toEqual(false);
		expect(money.equals(1)).toBe(true);
		expect(money.equals(2)).toEqual(false);
		expect(money.equals("1")).toBe(true);
		expect(money.equals("2")).toEqual(false);
		expect(money.equals({ value: "1" })).toBe(true);
		expect(money.equals({ value: "2" })).toEqual(false);

		const safeEquals1 = money.safeEquals(Money.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = money.safeEquals(Money.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = money.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = money.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = money.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = money.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = money.safeEquals({ value: "1" });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = money.safeEquals({ value: "2" });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = money.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "bigNumber", "bigint"],
				received: "boolean",
				message: "Expected 'number' | 'string' | 'object' | 'bigNumber' | 'bigint', received 'boolean'",
			});
		}

		expect(() => money.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const money = Money.from(1);
		expect(money.toString()).toEqual("1.00");
		const money2 = Money.from(1.1);
		expect(money2.toString()).toEqual("1.10");
		const money3 = Money.from(1.11);
		expect(money3.toString()).toEqual("1.11");
		const money4 = Money.from(1.111);
		expect(money4.toString()).toEqual("1.11");
		const money5 = Money.from(1.115);
		expect(money5.toString()).toEqual("1.12");
	});

	test("toBigNumber()", () => {
		const money = Money.from(1);
		expect(money.toBigNumber().toNumber()).toEqual(1);
	});

	test("toJSON()", () => {
		const money = Money.from(1);
		expect(money.toJSON()).toStrictEqual({ value: "1.00" });
	});

	test("get money()", () => {
		expect(Money.from(1).money.toNumber()).toEqual(1);
		expect(Money.from("2").money.toNumber()).toEqual(2);
		expect(Money.from({ value: "3" }).money.toNumber()).toEqual(3);
	});

	test("set money(...)", () => {
		const money = Money.from(1);
		money.money = 2 as any;
		expect(money.money.toNumber()).toEqual(2);

		expect(() => (money.money = "10e400" as any)).toThrowError("Number must be less than or equal to 92233720368547758.07");
	});

	test("get value()", () => {
		expect(Money.from(1).value).toEqual("1.00");
		expect(Money.from("2").value).toEqual("2.00");
		expect(Money.from({ value: "3" }).value).toEqual("3.00");
	});

	test("set value(...)", () => {
		const money = Money.from("1");
		money.value = "2.00";
		expect(money.value).toEqual("2.00");

		expect(() => (money.value = "10e400")).toThrowError("Number must be less than or equal to 92233720368547758.07");
	});

	test("get postgres()", () => {
		expect(Money.from(1).postgres).toEqual("1.00");
		expect(Money.from("2").postgres).toEqual("2.00");
		expect(Money.from({ value: "3" }).postgres).toEqual("3.00");
	});

	test("set postgres(...)", () => {
		const money = Money.from("1");
		money.postgres = "2.00";
		expect(money.postgres).toEqual("2.00");

		expect(() => (money.postgres = "10e400")).toThrowError("Number must be less than or equal to 92233720368547758.07");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/money.sql
		// input checks
		expect(() => Money.from("1234567890")).not.toThrowError();
		expect(() => Money.from("12345678901234567")).not.toThrowError();
		expect(() => Money.from("92233720368547758.07")).not.toThrowError();
		expect(() => Money.from("-12345")).not.toThrowError();
		expect(() => Money.from("-1234567890")).not.toThrowError();
		expect(() => Money.from("-12345678901234567")).not.toThrowError();
		expect(() => Money.from("-92233720368547758.08")).not.toThrowError();

		// special characters
		expect(() => Money.from("1")).not.toThrowError();
		expect(() => Money.from("$123,456.78")).not.toThrowError();
	});

	it("should be returned as a Money", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "money.test.ts",
		});

		await client.connect();

		//* PG has a native parser for the '_money' type
		types.setTypeParser(791 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestmoney (
					money money NULL,
					_money _money NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestmoney (money, _money)
				VALUES (
					1,
					'{2, 3}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestmoney
			`);

			result.rows[0].money = parser<Money>(Money)(result.rows[0].money);
			result.rows[0]._money = arrayParser<Money>(Money, ",")(result.rows[0]._money);

			expect(Money.isMoney(result.rows[0].money)).toBe(true);
			expect(Money.from(1).equals(result.rows[0].money)).toBe(true);

			const [a, b] = result.rows[0]._money;
			expect(result.rows[0]._money).toHaveLength(2);
			expect(Money.isMoney(a)).toBe(true);
			expect(Money.from(2).equals(a)).toBe(true);
			expect(Money.isMoney(b)).toBe(true);
			expect(Money.from(3).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestmoney
			`);

		await client.end();

		if (error) throw error;
	});
});
