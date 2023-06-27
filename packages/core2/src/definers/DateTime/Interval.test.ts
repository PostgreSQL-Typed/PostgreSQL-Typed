import { Interval } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInterval } from "./Interval";

describe("defineInterval", async () => {
	test('defineInterval({ mode: "Interval" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "interval.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("interval", {
				interval: defineInterval("interval", { mode: "Interval" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists interval (
				interval interval not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				interval: Interval.from("2022 years 9 months 2 days"),
			})
			.returning();

		expect(Interval.isInterval(result1[0].interval)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Interval.isInterval(result2[0].interval)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.interval, Interval.from("2022 years 9 months 2 days")))
			.execute();

		expect(Interval.isInterval(result3[0].interval)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.interval, Interval.from("2022 years 9 months 3 days")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table interval;
		`);

		expect(table.interval.getSQLType()).toBe("interval");
	});

	test('defineInterval({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "intervalstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("intervalstring", {
				interval: defineInterval("interval", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists intervalstring (
				interval interval not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				interval: "2022 years 9 months 2 days",
			})
			.returning();

		expect(result1[0].interval).toBe("2022 years 9 months 2 days");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].interval).toBe("2022 years 9 months 2 days");

		const result3 = await database.select().from(table).where(eq(table.interval, "2022 years 9 months 2 days")).execute();

		expect(result3[0].interval).toBe("2022 years 9 months 2 days");

		const result4 = await database.select().from(table).where(eq(table.interval, "2022 years 9 months 3 days")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table intervalstring;
		`);

		expect(table.interval.getSQLType()).toBe("interval");
	});
});
