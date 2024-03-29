import { Path } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { definePath } from "./Path";

describe("definePath", async () => {
	test('definePath({ mode: "Path" })', async () => {
		const postgres = new Client({
				application_name: "path.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("path", {
				_path: definePath("_path", { mode: "Path" }).array().notNull(),
				path: definePath("path", { mode: "Path" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists path (
				path path not null,
				_path _path not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_path: [Path.from("((1,2),(3,4))"), Path.from("((1,2),(4,5))")],
				path: Path.from("((1,2),(3,4))"),
			})
			.returning();

		expect(Path.isPath(result1[0].path)).toBe(true);
		expect(result1[0]._path.length).toBe(2);
		expect(Path.isPath(result1[0]._path[0])).toBe(true);
		expect(Path.isPath(result1[0]._path[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Path.isPath(result2[0].path)).toBe(true);
		expect(result2[0]._path.length).toBe(2);
		expect(Path.isPath(result2[0]._path[0])).toBe(true);
		expect(Path.isPath(result2[0]._path[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.path, Path.from("((1,2),(3,4))")))
			.execute();

		expect(Path.isPath(result3[0].path)).toBe(true);
		expect(result3[0]._path.length).toBe(2);
		expect(Path.isPath(result3[0]._path[0])).toBe(true);
		expect(Path.isPath(result3[0]._path[1])).toBe(true);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.path, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table path;
		`);

		expect(table.path.getSQLType()).toBe("path");
	});

	test('definePath({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "pathstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("pathstring", {
				_path: definePath("_path", { mode: "string" }).array().notNull(),
				path: definePath("path", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists pathstring (
				path path not null,
				_path _path not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_path: ["((1,2),(3,4))", "((1,2),(4,5))"],
				path: "((1,2),(3,4))",
			})
			.returning();

		expect(result1[0].path).toBe("((1,2),(3,4))");
		expect(result1[0]._path.length).toBe(2);
		expect(result1[0]._path[0]).toBe("((1,2),(3,4))");
		expect(result1[0]._path[1]).toBe("((1,2),(4,5))");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].path).toBe("((1,2),(3,4))");
		expect(result2[0]._path.length).toBe(2);
		expect(result2[0]._path[0]).toBe("((1,2),(3,4))");
		expect(result2[0]._path[1]).toBe("((1,2),(4,5))");

		const result3 = await database.select().from(table).where(eq(table.path, "((1,2),(3,4))")).execute();

		expect(result3[0].path).toBe("((1,2),(3,4))");
		expect(result3[0]._path.length).toBe(2);
		expect(result3[0]._path[0]).toBe("((1,2),(3,4))");
		expect(result3[0]._path[1]).toBe("((1,2),(4,5))");

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.path, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table pathstring;
		`);

		expect(table.path.getSQLType()).toBe("path");
	});
});
