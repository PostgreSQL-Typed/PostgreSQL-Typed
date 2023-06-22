/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineOID } from "./OID";

describe("defineOID", async () => {
	test('defineOID({ mode: "OID" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "oid.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("oid", {
				oid: defineOID("oid", { mode: "OID" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists oid (
				oid oid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				oid: OID.from("1"),
			})
			.returning();

		expect(OID.isOID(result1[0].oid)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(OID.isOID(result2[0].oid)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.oid, OID.from("1")))
			.execute();

		expect(OID.isOID(result3[0].oid)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.oid, OID.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table oid;
		`);

		expect(table.oid.getSQLType()).toBe("oid");
	});

	test('defineOID({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "oidstring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("oidstring", {
				oid: defineOID("oid", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists oidstring (
				oid oid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				oid: "1",
			})
			.returning();

		expect(result1[0].oid).toBe("1");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].oid).toBe("1");

		const result3 = await database.select().from(table).where(eq(table.oid, "1")).execute();

		expect(result3[0].oid).toBe("1");

		const result4 = await database.select().from(table).where(eq(table.oid, "2")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table oidstring;
		`);

		expect(table.oid.getSQLType()).toBe("oid");
	});

	test('defineOID({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "oidnumber.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("oidnumber", {
				oid: defineOID("oid", { mode: "number" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists oidnumber (
				oid oid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				oid: 1,
			})
			.returning();

		expect(result1[0].oid).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].oid).toBe(1);

		const result3 = await database.select().from(table).where(eq(table.oid, 1)).execute();

		expect(result3[0].oid).toBe(1);

		const result4 = await database.select().from(table).where(eq(table.oid, 2)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table oidnumber;
		`);

		expect(table.oid.getSQLType()).toBe("oid");
	});
});
