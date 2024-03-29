import { Character } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineCharacter } from "./Character";

describe("defineCharacter", async () => {
	test('defineCharacter({ mode: "Character" })', async () => {
		const postgres = new Client({
				application_name: "character.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("character", {
				_character: defineCharacter("_character", { mode: "Character" }).array().notNull(),
				character: defineCharacter("character", { mode: "Character" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists character (
				character char not null,
				_character _char not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_character: [Character.from("a"), Character.from("b")],
				character: Character.from("a"),
			})
			.returning();

		expect(Character.isAnyCharacter(result1[0].character)).toBe(true);
		expect(result1[0]._character.length).toBe(2);
		expect(Character.isAnyCharacter(result1[0]._character[0])).toBe(true);
		expect(Character.isAnyCharacter(result1[0]._character[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Character.isAnyCharacter(result2[0].character)).toBe(true);
		expect(result2[0]._character.length).toBe(2);
		expect(Character.isAnyCharacter(result2[0]._character[0])).toBe(true);
		expect(Character.isAnyCharacter(result2[0]._character[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.character, Character.from("a")))
			.execute();

		expect(Character.isAnyCharacter(result3[0].character)).toBe(true);
		expect(result3[0]._character.length).toBe(2);
		expect(Character.isAnyCharacter(result3[0]._character[0])).toBe(true);
		expect(Character.isAnyCharacter(result3[0]._character[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.character, Character.from("b")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.character, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table character;
		`);

		expect(table.character.getSQLType()).toBe("char");
	});

	test('defineCharacter({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "characterstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("characterstring", {
				_character: defineCharacter("_character", { mode: "string" }).array().notNull(),
				character: defineCharacter("character", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists characterstring (
				character char not null,
				_character _char not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_character: ["a", "b"],
				character: "a",
			})
			.returning();

		expect(result1[0].character).toBe("a");
		expect(result1[0]._character.length).toBe(2);
		expect(result1[0]._character[0]).toBe("a");
		expect(result1[0]._character[1]).toBe("b");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].character).toBe("a");
		expect(result2[0]._character.length).toBe(2);
		expect(result2[0]._character[0]).toBe("a");
		expect(result2[0]._character[1]).toBe("b");

		const result3 = await database.select().from(table).where(eq(table.character, "a")).execute();

		expect(result3[0].character).toBe("a");
		expect(result3[0]._character.length).toBe(2);
		expect(result3[0]._character[0]).toBe("a");
		expect(result3[0]._character[1]).toBe("b");

		const result4 = await database.select().from(table).where(eq(table.character, "b")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.character, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table characterstring;
		`);

		expect(table.character.getSQLType()).toBe("char");
	});

	test("defineCharacter({ length: 3 })", async () => {
		const postgres = new Client({
				application_name: "characterlength.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("characterlength", {
				character1: defineCharacter("character1", { length: 3, mode: "Character" }).notNull(),
				character2: defineCharacter("character2", { length: 3, mode: "string" }).notNull(),
			});

		await database.connect();

		// eslint-disable-next-line unicorn/template-indent
		await database.execute(sql`
			create table if not exists characterlength (
				character1 char(3) not null,
        character2 char(3) not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				character1: Character.setN(3).from("abc"),
				character2: "abc",
			})
			.returning();

		expect(result1[0].character1.toString()).toBe("abc");
		expect(result1[0].character2).toBe("abc");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].character1.toString()).toBe("abc");
		expect(result2[0].character2).toBe("abc");

		const result3 = await database.select().from(table).where(eq(table.character2, "abc")).execute();

		expect(result3[0].character1.toString()).toBe("abc");
		expect(result3[0].character2).toBe("abc");

		const result4 = await database.select().from(table).where(eq(table.character2, "def")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.character1, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table characterlength;
		`);

		expect(table.character1.getSQLType()).toBe("char(3)");
		expect(table.character2.getSQLType()).toBe("char(3)");
	});
});
