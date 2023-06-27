import { Circle } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { sameAs } from "../../operators.js";
import { defineCircle } from "./Circle";

describe("defineCircle", async () => {
	test('defineCircle({ mode: "Circle" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "circle.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("circle", {
				circle: defineCircle("circle", { mode: "Circle" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists circle (
				circle circle not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				circle: Circle.from("<(1,2),3>"),
			})
			.returning();

		expect(Circle.isCircle(result1[0].circle)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Circle.isCircle(result2[0].circle)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.circle, Circle.from("<(1,2),3>")))
			.execute();

		expect(Circle.isCircle(result3[0].circle)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.circle, Circle.from("<(1,2),4>")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table circle;
		`);

		expect(table.circle.getSQLType()).toBe("circle");
	});

	test('defineCircle({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "circlestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("circlestring", {
				circle: defineCircle("circle", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists circlestring (
				circle circle not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				circle: "<(1,2),3>",
			})
			.returning();

		expect(result1[0].circle).toBe("<(1,2),3>");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].circle).toBe("<(1,2),3>");

		const result3 = await database.select().from(table).where(sameAs(table.circle, "<(1,2),3>")).execute();

		expect(result3[0].circle).toBe("<(1,2),3>");

		const result4 = await database.select().from(table).where(sameAs(table.circle, "<(1,2),4>")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table circlestring;
		`);

		expect(table.circle.getSQLType()).toBe("circle");
	});
});
