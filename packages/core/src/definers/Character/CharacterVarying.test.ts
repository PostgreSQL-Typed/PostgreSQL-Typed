import { CharacterVarying } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineCharacterVarying } from "./CharacterVarying";

describe("defineCharacterVarying", async () => {
	test('defineCharacterVarying({ mode: "CharacterVarying" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "charactervarying.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("charactervarying", {
				charactervarying: defineCharacterVarying("charactervarying", { mode: "CharacterVarying" }).notNull(),
				_charactervarying: defineCharacterVarying("_charactervarying", { mode: "CharacterVarying" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists charactervarying (
				charactervarying varchar not null,
				_charactervarying _varchar not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				charactervarying: CharacterVarying.from("a"),
				_charactervarying: [CharacterVarying.from("a"), CharacterVarying.from("b")],
			})
			.returning();

		expect(CharacterVarying.isAnyCharacterVarying(result1[0].charactervarying)).toBe(true);
		expect(result1[0]._charactervarying.length).toBe(2);
		expect(CharacterVarying.isAnyCharacterVarying(result1[0]._charactervarying[0])).toBe(true);
		expect(CharacterVarying.isAnyCharacterVarying(result1[0]._charactervarying[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(CharacterVarying.isAnyCharacterVarying(result2[0].charactervarying)).toBe(true);
		expect(result2[0]._charactervarying.length).toBe(2);
		expect(CharacterVarying.isAnyCharacterVarying(result2[0]._charactervarying[0])).toBe(true);
		expect(CharacterVarying.isAnyCharacterVarying(result2[0]._charactervarying[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.charactervarying, CharacterVarying.from("a")))
			.execute();

		expect(CharacterVarying.isAnyCharacterVarying(result3[0].charactervarying)).toBe(true);
		expect(result3[0]._charactervarying.length).toBe(2);
		expect(CharacterVarying.isAnyCharacterVarying(result3[0]._charactervarying[0])).toBe(true);
		expect(CharacterVarying.isAnyCharacterVarying(result3[0]._charactervarying[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.charactervarying, CharacterVarying.from("b")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.charactervarying, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table charactervarying;
		`);

		expect(table.charactervarying.getSQLType()).toBe("varchar");
	});

	test('defineCharacterVarying({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "charactervaryingstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("charactervaryingstring", {
				charactervarying: defineCharacterVarying("charactervarying", { mode: "string" }).notNull(),
				_charactervarying: defineCharacterVarying("_charactervarying", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists charactervaryingstring (
				charactervarying varchar not null,
				_charactervarying _varchar not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				charactervarying: "a",
				_charactervarying: ["a", "b"],
			})
			.returning();

		expect(result1[0].charactervarying).toBe("a");
		expect(result1[0]._charactervarying.length).toBe(2);
		expect(result1[0]._charactervarying[0]).toBe("a");
		expect(result1[0]._charactervarying[1]).toBe("b");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].charactervarying).toBe("a");
		expect(result2[0]._charactervarying.length).toBe(2);
		expect(result2[0]._charactervarying[0]).toBe("a");
		expect(result2[0]._charactervarying[1]).toBe("b");

		const result3 = await database.select().from(table).where(eq(table.charactervarying, "a")).execute();

		expect(result3[0].charactervarying).toBe("a");
		expect(result3[0]._charactervarying.length).toBe(2);
		expect(result3[0]._charactervarying[0]).toBe("a");
		expect(result3[0]._charactervarying[1]).toBe("b");

		const result4 = await database.select().from(table).where(eq(table.charactervarying, "b")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.charactervarying, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table charactervaryingstring;
		`);

		expect(table.charactervarying.getSQLType()).toBe("varchar");
	});

	test("defineCharacterVarying({ length: 3 })", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "charactervaryinglength.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("charactervaryinglength", {
				charactervarying1: defineCharacterVarying("charactervarying1", { mode: "CharacterVarying", length: 3 }).notNull(),
				charactervarying2: defineCharacterVarying("charactervarying2", { mode: "string", length: 3 }).notNull(),
			});

		await database.connect();

		// eslint-disable-next-line unicorn/template-indent
		await database.execute(sql`
			create table if not exists charactervaryinglength (
				charactervarying1 varchar(3) not null,
        charactervarying2 varchar(3) not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				charactervarying1: CharacterVarying.setN(3).from("abc"),
				charactervarying2: "abc",
			})
			.returning();

		expect(result1[0].charactervarying1.toString()).toBe("abc");
		expect(result1[0].charactervarying2).toBe("abc");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].charactervarying1.toString()).toBe("abc");
		expect(result2[0].charactervarying2).toBe("abc");

		const result3 = await database.select().from(table).where(eq(table.charactervarying2, "abc")).execute();

		expect(result3[0].charactervarying1.toString()).toBe("abc");
		expect(result3[0].charactervarying2).toBe("abc");

		const result4 = await database.select().from(table).where(eq(table.charactervarying2, "def")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.charactervarying1, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table charactervaryinglength;
		`);

		expect(table.charactervarying1.getSQLType()).toBe("varchar(3)");
		expect(table.charactervarying2.getSQLType()).toBe("varchar(3)");
	});
});
