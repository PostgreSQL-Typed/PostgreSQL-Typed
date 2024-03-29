import { LineSegment } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineLineSegment } from "./LineSegment";

describe("defineLineSegment", async () => {
	test('defineLineSegment({ mode: "LineSegment" })', async () => {
		const postgres = new Client({
				application_name: "linesegment.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("linesegment", {
				_linesegment: defineLineSegment("_linesegment", { mode: "LineSegment" }).array().notNull(),
				linesegment: defineLineSegment("linesegment", { mode: "LineSegment" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists linesegment (
				linesegment lseg not null,
				_linesegment _lseg not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_linesegment: [LineSegment.from("[(1,2),(3,4)]"), LineSegment.from("[(1,2),(4,5)]")],
				linesegment: LineSegment.from("[(1,2),(3,4)]"),
			})
			.returning();

		expect(LineSegment.isLineSegment(result1[0].linesegment)).toBe(true);
		expect(result1[0]._linesegment.length).toBe(2);
		expect(LineSegment.isLineSegment(result1[0]._linesegment[0])).toBe(true);
		expect(LineSegment.isLineSegment(result1[0]._linesegment[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(LineSegment.isLineSegment(result2[0].linesegment)).toBe(true);
		expect(result2[0]._linesegment.length).toBe(2);
		expect(LineSegment.isLineSegment(result2[0]._linesegment[0])).toBe(true);
		expect(LineSegment.isLineSegment(result2[0]._linesegment[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.linesegment, LineSegment.from("[(1,2),(3,4)]")))
			.execute();

		expect(LineSegment.isLineSegment(result3[0].linesegment)).toBe(true);
		expect(result3[0]._linesegment.length).toBe(2);
		expect(LineSegment.isLineSegment(result3[0]._linesegment[0])).toBe(true);
		expect(LineSegment.isLineSegment(result3[0]._linesegment[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.linesegment, LineSegment.from("[(1,2),(3,5)]")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.linesegment, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table linesegment;
		`);

		expect(table.linesegment.getSQLType()).toBe("lseg");
	});

	test('defineLineSegment({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "linesegmentstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("linesegmentstring", {
				_linesegment: defineLineSegment("_linesegment", { mode: "string" }).array().notNull(),
				linesegment: defineLineSegment("linesegment", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists linesegmentstring (
				linesegment lseg not null,
				_linesegment _lseg not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_linesegment: ["[(1,2),(3,4)]", "[(1,2),(4,5)]"],
				linesegment: "[(1,2),(3,4)]",
			})
			.returning();

		expect(result1[0].linesegment).toBe("[(1,2),(3,4)]");
		expect(result1[0]._linesegment.length).toBe(2);
		expect(result1[0]._linesegment[0]).toBe("[(1,2),(3,4)]");
		expect(result1[0]._linesegment[1]).toBe("[(1,2),(4,5)]");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].linesegment).toBe("[(1,2),(3,4)]");
		expect(result2[0]._linesegment.length).toBe(2);
		expect(result2[0]._linesegment[0]).toBe("[(1,2),(3,4)]");
		expect(result2[0]._linesegment[1]).toBe("[(1,2),(4,5)]");

		const result3 = await database.select().from(table).where(eq(table.linesegment, "[(1,2),(3,4)]")).execute();

		expect(result3[0].linesegment).toBe("[(1,2),(3,4)]");
		expect(result3[0]._linesegment.length).toBe(2);
		expect(result3[0]._linesegment[0]).toBe("[(1,2),(3,4)]");
		expect(result3[0]._linesegment[1]).toBe("[(1,2),(4,5)]");

		const result4 = await database.select().from(table).where(eq(table.linesegment, "[(1,2),(3,5)]")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.linesegment, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table linesegmentstring;
		`);

		expect(table.linesegment.getSQLType()).toBe("lseg");
	});
});
