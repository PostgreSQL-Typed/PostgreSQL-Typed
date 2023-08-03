import { Enum } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineEnum } from "./Enum";

describe("defineEnum", async () => {
	test('defineEnum({ mode: "Enum" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "enum.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("enum", {
				enum: defineEnum("enum", { mode: "Enum", enumName: "mood", enumValues: ["sad", "ok", "happy"] }).notNull(),
				_enum: defineEnum("_enum", { mode: "Enum", enumName: "mood", enumValues: ["sad", "ok", "happy"] })
					.array()
					.notNull(),
			});

		await database.connect();

		await database.execute(sql`
			drop type if exists mood;
			create type mood as enum ('sad', 'ok', 'happy');

			create table if not exists enum (
				enum mood not null,
				_enum _mood not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				enum: Enum.setEnums(["sad", "ok", "happy"]).from("sad"),
				_enum: [Enum.setEnums(["sad", "ok", "happy"]).from("ok"), Enum.setEnums(["sad", "ok", "happy"]).from("happy")],
			})
			.returning();

		expect(Enum.isAnyEnum(result1[0].enum)).toBe(true);
		expect(result1[0]._enum.length).toBe(2);
		expect(Enum.isAnyEnum(result1[0]._enum[0])).toBe(true);
		expect(Enum.isAnyEnum(result1[0]._enum[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Enum.isAnyEnum(result2[0].enum)).toBe(true);
		expect(result2[0]._enum.length).toBe(2);
		expect(Enum.isAnyEnum(result2[0]._enum[0])).toBe(true);
		expect(Enum.isAnyEnum(result2[0]._enum[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.enum, Enum.setEnums(["sad", "ok", "happy"]).from("sad")))
			.execute();

		expect(Enum.isAnyEnum(result3[0].enum)).toBe(true);
		expect(result3[0]._enum.length).toBe(2);
		expect(Enum.isAnyEnum(result3[0]._enum[0])).toBe(true);
		expect(Enum.isAnyEnum(result3[0]._enum[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.enum, Enum.setEnums(["sad", "ok", "happy"]).from("ok")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.enum, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table enum;
			drop type mood;
		`);

		expect(table.enum.getSQLType()).toBe("mood");
	});

	test('defineEnum({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "enumstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("enumstring", {
				enum: defineEnum("enum", { mode: "string", enumName: "rgb", enumValues: ["red", "green", "blue"] }).notNull(),
				_enum: defineEnum("_enum", { mode: "string", enumName: "rgb", enumValues: ["red", "green", "blue"] })
					.array()
					.notNull(),
			});

		await database.connect();

		await database.execute(sql`
			drop type if exists rgb;
			create type rgb as enum ('red', 'green', 'blue');

			create table if not exists enumstring (
				enum rgb not null,
				_enum _rgb not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				enum: "red",
				_enum: ["green", "blue"],
			})
			.returning();

		expect(result1[0].enum).toBe("red");
		expect(result1[0]._enum.length).toBe(2);
		expect(result1[0]._enum[0]).toBe("green");
		expect(result1[0]._enum[1]).toBe("blue");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].enum).toBe("red");
		expect(result2[0]._enum.length).toBe(2);
		expect(result2[0]._enum[0]).toBe("green");
		expect(result2[0]._enum[1]).toBe("blue");

		const result3 = await database.select().from(table).where(eq(table.enum, "red")).execute();

		expect(result3[0].enum).toBe("red");
		expect(result3[0]._enum.length).toBe(2);
		expect(result3[0]._enum[0]).toBe("green");
		expect(result3[0]._enum[1]).toBe("blue");

		const result4 = await database.select().from(table).where(eq(table.enum, "green")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.enum, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table enumstring;
			drop type rgb;
		`);

		expect(table.enum.getSQLType()).toBe("rgb");
	});
});
