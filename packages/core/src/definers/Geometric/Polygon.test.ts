import { Polygon } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { sameAs } from "../../operators";
import { definePolygon } from "./Polygon";

describe("definePolygon", async () => {
	test('definePolygon({ mode: "Polygon" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "polygon.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("polygon", {
				polygon: definePolygon("polygon", { mode: "Polygon" }).notNull(),
				_polygon: definePolygon("_polygon", { mode: "Polygon" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists polygon (
				polygon polygon not null,
				_polygon _polygon not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				polygon: Polygon.from("((1,2),(3,4))"),
				_polygon: [Polygon.from("((1,2),(3,4))"), Polygon.from("((1,2),(4,5))")],
			})
			.returning();

		expect(Polygon.isPolygon(result1[0].polygon)).toBe(true);
		expect(result1[0]._polygon.length).toBe(2);
		expect(Polygon.isPolygon(result1[0]._polygon[0])).toBe(true);
		expect(Polygon.isPolygon(result1[0]._polygon[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Polygon.isPolygon(result2[0].polygon)).toBe(true);
		expect(result2[0]._polygon.length).toBe(2);
		expect(Polygon.isPolygon(result2[0]._polygon[0])).toBe(true);
		expect(Polygon.isPolygon(result2[0]._polygon[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.polygon, Polygon.from("((1,2),(3,4))")))
			.execute();

		expect(Polygon.isPolygon(result3[0].polygon)).toBe(true);
		expect(result3[0]._polygon.length).toBe(2);
		expect(Polygon.isPolygon(result3[0]._polygon[0])).toBe(true);
		expect(Polygon.isPolygon(result3[0]._polygon[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.polygon, Polygon.from("((1,2),(3,5))")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.polygon, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table polygon;
		`);

		expect(table.polygon.getSQLType()).toBe("polygon");
	});

	test('definePolygon({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "polygonstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("polygonstring", {
				polygon: definePolygon("polygon", { mode: "string" }).notNull(),
				_polygon: definePolygon("_polygon", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists polygonstring (
				polygon polygon not null,
				_polygon _polygon not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				polygon: "((1,2),(3,4))",
				_polygon: ["((1,2),(3,4))", "((1,2),(4,5))"],
			})
			.returning();

		expect(result1[0].polygon).toBe("((1,2),(3,4))");
		expect(result1[0]._polygon.length).toBe(2);
		expect(result1[0]._polygon[0]).toBe("((1,2),(3,4))");
		expect(result1[0]._polygon[1]).toBe("((1,2),(4,5))");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].polygon).toBe("((1,2),(3,4))");
		expect(result2[0]._polygon.length).toBe(2);
		expect(result2[0]._polygon[0]).toBe("((1,2),(3,4))");
		expect(result2[0]._polygon[1]).toBe("((1,2),(4,5))");

		const result3 = await database.select().from(table).where(sameAs(table.polygon, "((1,2),(3,4))")).execute();

		expect(result3[0].polygon).toBe("((1,2),(3,4))");
		expect(result3[0]._polygon.length).toBe(2);
		expect(result3[0]._polygon[0]).toBe("((1,2),(3,4))");
		expect(result3[0]._polygon[1]).toBe("((1,2),(4,5))");

		const result4 = await database.select().from(table).where(sameAs(table.polygon, "((1,2),(3,5))")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.polygon, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table polygonstring;
		`);

		expect(table.polygon.getSQLType()).toBe("polygon");
	});
});
