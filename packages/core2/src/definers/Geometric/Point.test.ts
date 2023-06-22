import { Point } from "@postgresql-typed/parsers";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { sameAs } from "../../operators";
import { definePoint } from "./Point";

describe("definePoint", async () => {
	test('definePoint({ mode: "Point" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "point.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("point", {
				point: definePoint("point", { mode: "Point" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists point (
				point point not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				point: Point.from("(1,2)"),
			})
			.returning();

		expect(Point.isPoint(result1[0].point)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Point.isPoint(result2[0].point)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.point, Point.from("(1,2)")))
			.execute();

		expect(Point.isPoint(result3[0].point)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.point, Point.from("(1,3)")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table point;
		`);

		expect(table.point.getSQLType()).toBe("point");
	});

	test('definePoint({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "pointstring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("pointstring", {
				point: definePoint("point", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists pointstring (
				point point not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				point: "(1,2)",
			})
			.returning();

		expect(result1[0].point).toBe("(1,2)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].point).toBe("(1,2)");

		const result3 = await database.select().from(table).where(sameAs(table.point, "(1,2)")).execute();

		expect(result3[0].point).toBe("(1,2)");

		const result4 = await database.select().from(table).where(sameAs(table.point, "(1,3)")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table pointstring;
		`);

		expect(table.point.getSQLType()).toBe("point");
	});
});
