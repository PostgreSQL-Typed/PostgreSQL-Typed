import { Path } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { definePath } from "./Path";

describe("definePath", async () => {
	test('definePath({ mode: "Path" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "path.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("path", {
				path: definePath("path", { mode: "Path" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists path (
				path path not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				path: Path.from("((1,2),(3,4))"),
			})
			.returning();

		expect(Path.isPath(result1[0].path)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Path.isPath(result2[0].path)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.path, Path.from("((1,2),(3,4))")))
			.execute();

		expect(Path.isPath(result3[0].path)).toBe(true);

		await database.execute(sql`
			drop table path;
		`);

		expect(table.path.getSQLType()).toBe("path");
	});

	test('definePath({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "pathstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("pathstring", {
				path: definePath("path", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists pathstring (
				path path not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				path: "((1,2),(3,4))",
			})
			.returning();

		expect(result1[0].path).toBe("((1,2),(3,4))");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].path).toBe("((1,2),(3,4))");

		const result3 = await database.select().from(table).where(eq(table.path, "((1,2),(3,4))")).execute();

		expect(result3[0].path).toBe("((1,2),(3,4))");

		await database.execute(sql`
			drop table pathstring;
		`);

		expect(table.path.getSQLType()).toBe("path");
	});
});
