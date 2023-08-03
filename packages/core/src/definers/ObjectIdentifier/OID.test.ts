/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineOID } from "./OID";

describe("defineOID", async () => {
	test('defineOID({ mode: "OID" })', async () => {
		const postgres = new Client({
				application_name: "oid.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("oid", {
				_oid: defineOID("_oid", { mode: "OID" }).array().notNull(),
				oid: defineOID("oid", { mode: "OID" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists oid (
				oid oid not null,
				_oid _oid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_oid: [OID.from("1"), OID.from("2")],
				oid: OID.from("1"),
			})
			.returning();

		expect(OID.isOID(result1[0].oid)).toBe(true);
		expect(result1[0]._oid.length).toBe(2);
		expect(OID.isOID(result1[0]._oid[0])).toBe(true);
		expect(OID.isOID(result1[0]._oid[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(OID.isOID(result2[0].oid)).toBe(true);
		expect(result2[0]._oid.length).toBe(2);
		expect(OID.isOID(result2[0]._oid[0])).toBe(true);
		expect(OID.isOID(result2[0]._oid[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.oid, OID.from("1")))
			.execute();

		expect(OID.isOID(result3[0].oid)).toBe(true);
		expect(result3[0]._oid.length).toBe(2);
		expect(OID.isOID(result3[0]._oid[0])).toBe(true);
		expect(OID.isOID(result3[0]._oid[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.oid, OID.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.oid, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table oid;
		`);

		expect(table.oid.getSQLType()).toBe("oid");
	});

	test('defineOID({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "oidstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("oidstring", {
				_oid: defineOID("_oid", { mode: "string" }).array().notNull(),
				oid: defineOID("oid", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists oidstring (
				oid oid not null,
				_oid _oid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_oid: ["1", "2"],
				oid: "1",
			})
			.returning();

		expect(result1[0].oid).toBe("1");
		expect(result1[0]._oid.length).toBe(2);
		expect(result1[0]._oid[0]).toBe("1");
		expect(result1[0]._oid[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].oid).toBe("1");
		expect(result2[0]._oid.length).toBe(2);
		expect(result2[0]._oid[0]).toBe("1");
		expect(result2[0]._oid[1]).toBe("2");

		const result3 = await database.select().from(table).where(eq(table.oid, "1")).execute();

		expect(result3[0].oid).toBe("1");
		expect(result3[0]._oid.length).toBe(2);
		expect(result3[0]._oid[0]).toBe("1");
		expect(result3[0]._oid[1]).toBe("2");

		const result4 = await database.select().from(table).where(eq(table.oid, "2")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.oid, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table oidstring;
		`);

		expect(table.oid.getSQLType()).toBe("oid");
	});

	test('defineOID({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "oidnumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("oidnumber", {
				_oid: defineOID("_oid", { mode: "number" }).array().notNull(),
				oid: defineOID("oid", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists oidnumber (
				oid oid not null,
				_oid _oid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_oid: [1, 2],
				oid: 1,
			})
			.returning();

		expect(result1[0].oid).toBe(1);
		expect(result1[0]._oid.length).toBe(2);
		expect(result1[0]._oid[0]).toBe(1);
		expect(result1[0]._oid[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].oid).toBe(1);
		expect(result2[0]._oid.length).toBe(2);
		expect(result2[0]._oid[0]).toBe(1);
		expect(result2[0]._oid[1]).toBe(2);

		const result3 = await database.select().from(table).where(eq(table.oid, 1)).execute();

		expect(result3[0].oid).toBe(1);
		expect(result3[0]._oid.length).toBe(2);
		expect(result3[0]._oid[0]).toBe(1);
		expect(result3[0]._oid[1]).toBe(2);

		const result4 = await database.select().from(table).where(eq(table.oid, 2)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.oid, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table oidnumber;
		`);

		expect(table.oid.getSQLType()).toBe("oid");
	});
});
