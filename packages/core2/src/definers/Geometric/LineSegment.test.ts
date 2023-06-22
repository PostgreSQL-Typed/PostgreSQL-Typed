import { LineSegment } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineLineSegment } from "./LineSegment";

describe("defineLineSegment", async () => {
	test('defineLineSegment({ mode: "LineSegment" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "linesegment.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("linesegment", {
				linesegment: defineLineSegment("linesegment", { mode: "LineSegment" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists linesegment (
				linesegment lseg not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				linesegment: LineSegment.from("[(1,2),(3,4)]"),
			})
			.returning();

		expect(LineSegment.isLineSegment(result1[0].linesegment)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(LineSegment.isLineSegment(result2[0].linesegment)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.linesegment, LineSegment.from("[(1,2),(3,4)]")))
			.execute();

		expect(LineSegment.isLineSegment(result3[0].linesegment)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.linesegment, LineSegment.from("[(1,2),(3,5)]")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table linesegment;
		`);

		expect(table.linesegment.getSQLType()).toBe("lseg");
	});

	test('defineLineSegment({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "linesegmentstring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("linesegmentstring", {
				linesegment: defineLineSegment("linesegment", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists linesegmentstring (
				linesegment lseg not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				linesegment: "[(1,2),(3,4)]",
			})
			.returning();

		expect(result1[0].linesegment).toBe("[(1,2),(3,4)]");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].linesegment).toBe("[(1,2),(3,4)]");

		const result3 = await database.select().from(table).where(eq(table.linesegment, "[(1,2),(3,4)]")).execute();

		expect(result3[0].linesegment).toBe("[(1,2),(3,4)]");

		const result4 = await database.select().from(table).where(eq(table.linesegment, "[(1,2),(3,5)]")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table linesegmentstring;
		`);

		expect(table.linesegment.getSQLType()).toBe("lseg");
	});
});
