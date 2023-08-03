import { BigNumber, Money } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineMoney } from "./Money";

describe("defineMoney", async () => {
	test('defineMoney({ mode: "Money" })', async () => {
		const postgres = new Client({
				application_name: "money.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("money", {
				_money: defineMoney("_money", { mode: "Money" }).array().notNull(),
				money: defineMoney("money", { mode: "Money" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists money (
				money money not null,
				_money _money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_money: [Money.from("1"), Money.from("2")],
				money: Money.from("1"),
			})
			.returning();

		expect(Money.isMoney(result1[0].money)).toBe(true);
		expect(result1[0]._money.length).toBe(2);
		expect(Money.isMoney(result1[0]._money[0])).toBe(true);
		expect(Money.isMoney(result1[0]._money[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Money.isMoney(result2[0].money)).toBe(true);
		expect(result2[0]._money.length).toBe(2);
		expect(Money.isMoney(result2[0]._money[0])).toBe(true);
		expect(Money.isMoney(result2[0]._money[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.money, Money.from("1")))
			.execute();

		expect(Money.isMoney(result3[0].money)).toBe(true);
		expect(result3[0]._money.length).toBe(2);
		expect(Money.isMoney(result3[0]._money[0])).toBe(true);
		expect(Money.isMoney(result3[0]._money[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.money, Money.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.money, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table money;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});

	test('defineMoney({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "moneystring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("moneystring", {
				_money: defineMoney("_money", { mode: "string" }).array().notNull(),
				money: defineMoney("money", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists moneystring (
				money money not null,
				_money _money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_money: ["1", "2"],
				money: "1",
			})
			.returning();

		expect(result1[0].money).toBe("1.00");
		expect(result1[0]._money.length).toBe(2);
		expect(result1[0]._money[0]).toBe("1.00");
		expect(result1[0]._money[1]).toBe("2.00");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].money).toBe("1.00");
		expect(result2[0]._money.length).toBe(2);
		expect(result2[0]._money[0]).toBe("1.00");
		expect(result2[0]._money[1]).toBe("2.00");

		const result3 = await database.select().from(table).where(eq(table.money, "1")).execute();

		expect(result3[0].money).toBe("1.00");
		expect(result3[0]._money.length).toBe(2);
		expect(result3[0]._money[0]).toBe("1.00");
		expect(result3[0]._money[1]).toBe("2.00");

		const result4 = await database.select().from(table).where(eq(table.money, "2")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.money, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table moneystring;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});

	test('defineMoney({ mode: "BigNumber" })', async () => {
		const postgres = new Client({
				application_name: "moneybignumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("moneybignumber", {
				_money: defineMoney("_money", { mode: "BigNumber" }).array().notNull(),
				money: defineMoney("money", { mode: "BigNumber" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists moneybignumber (
				money money not null,
				_money _money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_money: [BigNumber(1), BigNumber(2)],
				money: BigNumber(1),
			})
			.returning();

		expect(result1[0].money.toNumber()).toBe(1);
		expect(result1[0]._money.length).toBe(2);
		expect(result1[0]._money[0].toNumber()).toBe(1);
		expect(result1[0]._money[1].toNumber()).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].money.toNumber()).toBe(1);
		expect(result2[0]._money.length).toBe(2);
		expect(result2[0]._money[0].toNumber()).toBe(1);
		expect(result2[0]._money[1].toNumber()).toBe(2);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.money, BigNumber(1)))
			.execute();

		expect(result3[0].money.toNumber()).toBe(1);
		expect(result3[0]._money.length).toBe(2);
		expect(result3[0]._money[0].toNumber()).toBe(1);
		expect(result3[0]._money[1].toNumber()).toBe(2);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.money, BigNumber(2)))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.money, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table moneybignumber;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});

	test('defineMoney({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "moneynumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("moneynumber", {
				_money: defineMoney("_money", { mode: "number" }).array().notNull(),
				money: defineMoney("money", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists moneynumber (
				money money not null,
				_money _money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_money: [1, 2],
				money: 1,
			})
			.returning();

		expect(result1[0].money).toBe(1);
		expect(result1[0]._money.length).toBe(2);
		expect(result1[0]._money[0]).toBe(1);
		expect(result1[0]._money[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].money).toBe(1);
		expect(result2[0]._money.length).toBe(2);
		expect(result2[0]._money[0]).toBe(1);
		expect(result2[0]._money[1]).toBe(2);

		const result3 = await database.select().from(table).where(eq(table.money, 1)).execute();

		expect(result3[0].money).toBe(1);
		expect(result3[0]._money.length).toBe(2);
		expect(result3[0]._money[0]).toBe(1);
		expect(result3[0]._money[1]).toBe(2);

		const result4 = await database.select().from(table).where(eq(table.money, 2)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.money, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table moneynumber;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});
});
