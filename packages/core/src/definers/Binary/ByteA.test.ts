import { ByteA } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineByteA } from "./ByteA";

describe("defineByteA", async () => {
	test('defineByteA({ mode: "ByteA" })', async () => {
		const postgres = new Client({
				application_name: "bytea.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("bytea", {
				_bytea: defineByteA("_bytea", { mode: "ByteA" }).array().notNull(),
				bytea: defineByteA("bytea", { mode: "ByteA" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists bytea (
				bytea bytea not null,
				_bytea _bytea not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_bytea: [ByteA.from(Buffer.from([0x12, 0x34])), ByteA.from("\\153\\154\\155")],
				bytea: ByteA.from("\\x1234"),
			})
			.returning();

		expect(ByteA.isByteA(result1[0].bytea)).toBe(true);
		expect(result1[0]._bytea.length).toBe(2);
		expect(ByteA.isByteA(result1[0]._bytea[0])).toBe(true);
		expect(ByteA.isByteA(result1[0]._bytea[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(ByteA.isByteA(result2[0].bytea)).toBe(true);
		expect(result2[0]._bytea.length).toBe(2);
		expect(ByteA.isByteA(result2[0]._bytea[0])).toBe(true);
		expect(ByteA.isByteA(result2[0]._bytea[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.bytea, ByteA.from("\\x1234")))
			.execute();

		expect(ByteA.isByteA(result3[0].bytea)).toBe(true);
		expect(result3[0]._bytea.length).toBe(2);
		expect(ByteA.isByteA(result3[0]._bytea[0])).toBe(true);
		expect(ByteA.isByteA(result3[0]._bytea[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.bytea, ByteA.from("\\x3456")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bytea, 1 as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'Buffer', received 'number'");

		await database.execute(sql`
			drop table bytea;
		`);

		expect(table.bytea.getSQLType()).toBe("bytea");
	});

	test('defineByteA({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "byteastring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("byteastring", {
				_bytea: defineByteA("_bytea", { mode: "string" }).array().notNull(),
				bytea: defineByteA("bytea", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists byteastring (
				bytea bytea not null,
				_bytea _bytea not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_bytea: ["\\x3456", "\\153\\154\\155"],
				bytea: "\\x1234",
			})
			.returning();

		expect(result1[0].bytea).toBe("\\x1234");
		expect(result1[0]._bytea.length).toBe(2);
		expect(result1[0]._bytea[0]).toBe("\\x3456");
		expect(result1[0]._bytea[1]).toBe("\\x6b6c6d");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].bytea).toBe("\\x1234");
		expect(result2[0]._bytea.length).toBe(2);
		expect(result2[0]._bytea[0]).toBe("\\x3456");
		expect(result2[0]._bytea[1]).toBe("\\x6b6c6d");

		const result3 = await database.select().from(table).where(eq(table.bytea, "\\x1234")).execute();

		expect(result3[0].bytea).toBe("\\x1234");
		expect(result3[0]._bytea.length).toBe(2);
		expect(result3[0]._bytea[0]).toBe("\\x3456");
		expect(result3[0]._bytea[1]).toBe("\\x6b6c6d");

		const result4 = await database.select().from(table).where(eq(table.bytea, "\\x3456")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bytea, 1 as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'Buffer', received 'number'");

		await database.execute(sql`
			drop table byteastring;
		`);

		expect(table.bytea.getSQLType()).toBe("bytea");
	});

	test('defineByteA({ mode: "Buffer" })', async () => {
		const postgres = new Client({
				application_name: "byteabuffer.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("byteabuffer", {
				_bytea: defineByteA("_bytea", { mode: "Buffer" }).array().notNull(),
				bytea: defineByteA("bytea", { mode: "Buffer" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists byteabuffer (
				bytea bytea not null,
				_bytea _bytea not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_bytea: [Buffer.from([0x34, 0x56]), ByteA.from("\\153\\154\\155").toBuffer()],
				bytea: ByteA.from("\\x1234").toBuffer(),
			})
			.returning();

		expect(result1[0].bytea).toEqual(Buffer.from([0x12, 0x34]));
		expect(result1[0]._bytea.length).toBe(2);
		expect(result1[0]._bytea[0]).toEqual(Buffer.from([0x34, 0x56]));
		expect(result1[0]._bytea[1]).toEqual(Buffer.from([0x6b, 0x6c, 0x6d]));

		const result2 = await database.select().from(table).execute();

		expect(result2[0].bytea).toEqual(Buffer.from([0x12, 0x34]));
		expect(result2[0]._bytea.length).toBe(2);
		expect(result2[0]._bytea[0]).toEqual(Buffer.from([0x34, 0x56]));
		expect(result2[0]._bytea[1]).toEqual(Buffer.from([0x6b, 0x6c, 0x6d]));

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.bytea, Buffer.from([0x12, 0x34])))
			.execute();

		expect(result3[0].bytea).toEqual(Buffer.from([0x12, 0x34]));
		expect(result3[0]._bytea.length).toBe(2);
		expect(result3[0]._bytea[0]).toEqual(Buffer.from([0x34, 0x56]));
		expect(result3[0]._bytea[1]).toEqual(Buffer.from([0x6b, 0x6c, 0x6d]));

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.bytea, Buffer.from([0x34, 0x56])))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bytea, 1 as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'Buffer', received 'number'");

		await database.execute(sql`
			drop table byteabuffer;
		`);

		expect(table.bytea.getSQLType()).toBe("bytea");
	});
});
