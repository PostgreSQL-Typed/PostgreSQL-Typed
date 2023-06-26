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
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists polygon (
				polygon polygon not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				polygon: Polygon.from("((1,2),(3,4))"),
			})
			.returning();

		expect(Polygon.isPolygon(result1[0].polygon)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Polygon.isPolygon(result2[0].polygon)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.polygon, Polygon.from("((1,2),(3,4))")))
			.execute();

		expect(Polygon.isPolygon(result3[0].polygon)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.polygon, Polygon.from("((1,2),(3,5))")))
			.execute();

		expect(result4.length).toBe(0);

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
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists polygonstring (
				polygon polygon not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				polygon: "((1,2),(3,4))",
			})
			.returning();

		expect(result1[0].polygon).toBe("((1,2),(3,4))");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].polygon).toBe("((1,2),(3,4))");

		const result3 = await database.select().from(table).where(sameAs(table.polygon, "((1,2),(3,4))")).execute();

		expect(result3[0].polygon).toBe("((1,2),(3,4))");

		const result4 = await database.select().from(table).where(sameAs(table.polygon, "((1,2),(3,5))")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table polygonstring;
		`);

		expect(table.polygon.getSQLType()).toBe("polygon");
	});
});
