import { Point } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
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
			database = pgt(postgres),
			table = pgTable("point", {
				point: definePoint("point", { mode: "Point" }).notNull(),
				_point: definePoint("_point", { mode: "Point" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists point (
				point point not null,
				_point _point not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				point: Point.from("(1,2)"),
				_point: [Point.from("(1,2)"), Point.from("(3,4)")],
			})
			.returning();

		expect(Point.isPoint(result1[0].point)).toBe(true);
		expect(result1[0]._point.length).toBe(2);
		expect(Point.isPoint(result1[0]._point[0])).toBe(true);
		expect(Point.isPoint(result1[0]._point[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Point.isPoint(result2[0].point)).toBe(true);
		expect(result2[0]._point.length).toBe(2);
		expect(Point.isPoint(result2[0]._point[0])).toBe(true);
		expect(Point.isPoint(result2[0]._point[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.point, Point.from("(1,2)")))
			.execute();

		expect(Point.isPoint(result3[0].point)).toBe(true);
		expect(result3[0]._point.length).toBe(2);
		expect(Point.isPoint(result3[0]._point[0])).toBe(true);
		expect(Point.isPoint(result3[0]._point[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.point, Point.from("(1,3)")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.point, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'symbol'");

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
			database = pgt(postgres),
			table = pgTable("pointstring", {
				point: definePoint("point", { mode: "string" }).notNull(),
				_point: definePoint("_point", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists pointstring (
				point point not null,
				_point _point not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				point: "(1,2)",
				_point: ["(1,2)", "(3,4)"],
			})
			.returning();

		expect(result1[0].point).toBe("(1,2)");
		expect(result1[0]._point.length).toBe(2);
		expect(result1[0]._point[0]).toBe("(1,2)");
		expect(result1[0]._point[1]).toBe("(3,4)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].point).toBe("(1,2)");
		expect(result2[0]._point.length).toBe(2);
		expect(result2[0]._point[0]).toBe("(1,2)");
		expect(result2[0]._point[1]).toBe("(3,4)");

		const result3 = await database.select().from(table).where(sameAs(table.point, "(1,2)")).execute();

		expect(result3[0].point).toBe("(1,2)");
		expect(result3[0]._point.length).toBe(2);
		expect(result3[0]._point[0]).toBe("(1,2)");
		expect(result3[0]._point[1]).toBe("(3,4)");

		const result4 = await database.select().from(table).where(sameAs(table.point, "(1,3)")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.point, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table pointstring;
		`);

		expect(table.point.getSQLType()).toBe("point");
	});
});
