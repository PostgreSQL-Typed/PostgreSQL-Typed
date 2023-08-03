import { Circle } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { sameAs } from "../../operators.js";
import { defineCircle } from "./Circle";

describe("defineCircle", async () => {
	test('defineCircle({ mode: "Circle" })', async () => {
		const postgres = new Client({
				application_name: "circle.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("circle", {
				_circle: defineCircle("_circle", { mode: "Circle" }).array().notNull(),
				circle: defineCircle("circle", { mode: "Circle" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists circle (
				circle circle not null,
				_circle _circle not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_circle: [Circle.from("<(1,2),3>"), Circle.from("<(1,2),4>")],
				circle: Circle.from("<(1,2),3>"),
			})
			.returning();

		expect(Circle.isCircle(result1[0].circle)).toBe(true);
		expect(result1[0]._circle.length).toBe(2);
		expect(Circle.isCircle(result1[0]._circle[0])).toBe(true);
		expect(Circle.isCircle(result1[0]._circle[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Circle.isCircle(result2[0].circle)).toBe(true);
		expect(result2[0]._circle.length).toBe(2);
		expect(Circle.isCircle(result2[0]._circle[0])).toBe(true);
		expect(Circle.isCircle(result2[0]._circle[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.circle, Circle.from("<(1,2),3>")))
			.execute();

		expect(Circle.isCircle(result3[0].circle)).toBe(true);
		expect(result3[0]._circle.length).toBe(2);
		expect(Circle.isCircle(result3[0]._circle[0])).toBe(true);
		expect(Circle.isCircle(result3[0]._circle[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.circle, Circle.from("<(1,2),4>")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.circle, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table circle;
		`);

		expect(table.circle.getSQLType()).toBe("circle");
	});

	test('defineCircle({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "circlestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("circlestring", {
				_circle: defineCircle("_circle", { mode: "string" }).array().notNull(),
				circle: defineCircle("circle", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists circlestring (
				circle circle not null,
				_circle _circle not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_circle: ["<(1,2),3>", "<(1,2),4>"],
				circle: "<(1,2),3>",
			})
			.returning();

		expect(result1[0].circle).toBe("<(1,2),3>");
		expect(result1[0]._circle.length).toBe(2);
		expect(result1[0]._circle[0]).toBe("<(1,2),3>");
		expect(result1[0]._circle[1]).toBe("<(1,2),4>");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].circle).toBe("<(1,2),3>");
		expect(result2[0]._circle.length).toBe(2);
		expect(result2[0]._circle[0]).toBe("<(1,2),3>");
		expect(result2[0]._circle[1]).toBe("<(1,2),4>");

		const result3 = await database.select().from(table).where(sameAs(table.circle, "<(1,2),3>")).execute();

		expect(result3[0].circle).toBe("<(1,2),3>");
		expect(result3[0]._circle.length).toBe(2);
		expect(result3[0]._circle[0]).toBe("<(1,2),3>");
		expect(result3[0]._circle[1]).toBe("<(1,2),4>");

		const result4 = await database.select().from(table).where(sameAs(table.circle, "<(1,2),4>")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.circle, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table circlestring;
		`);

		expect(table.circle.getSQLType()).toBe("circle");
	});
});
