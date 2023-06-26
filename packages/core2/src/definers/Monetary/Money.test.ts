import { BigNumber, Money } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineMoney } from "./Money";

describe("defineMoney", async () => {
	test('defineMoney({ mode: "Money" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "money.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("money", {
				money: defineMoney("money", { mode: "Money" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists money (
				money money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				money: Money.from("1"),
			})
			.returning();

		expect(Money.isMoney(result1[0].money)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Money.isMoney(result2[0].money)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.money, Money.from("1")))
			.execute();

		expect(Money.isMoney(result3[0].money)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.money, Money.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table money;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});

	test('defineMoney({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "moneystring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("moneystring", {
				money: defineMoney("money", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists moneystring (
				money money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				money: "1",
			})
			.returning();

		expect(result1[0].money).toBe("1.00");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].money).toBe("1.00");

		const result3 = await database.select().from(table).where(eq(table.money, "1")).execute();

		expect(result3[0].money).toBe("1.00");

		const result4 = await database.select().from(table).where(eq(table.money, "2")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table moneystring;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});

	test('defineMoney({ mode: "BigNumber" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "moneybignumber.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("moneybignumber", {
				money: defineMoney("money", { mode: "BigNumber" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists moneybignumber (
				money money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				money: BigNumber(1),
			})
			.returning();

		expect(result1[0].money.toNumber()).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].money.toNumber()).toBe(1);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.money, BigNumber(1)))
			.execute();

		expect(result3[0].money.toNumber()).toBe(1);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.money, BigNumber(2)))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table moneybignumber;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});

	test('defineMoney({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "moneynumber.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("moneynumber", {
				money: defineMoney("money", { mode: "number" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists moneynumber (
				money money not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				money: 1,
			})
			.returning();

		expect(result1[0].money).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].money).toBe(1);

		const result3 = await database.select().from(table).where(eq(table.money, 1)).execute();

		expect(result3[0].money).toBe(1);

		const result4 = await database.select().from(table).where(eq(table.money, 2)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table moneynumber;
		`);

		expect(table.money.getSQLType()).toBe("money");
	});
});
