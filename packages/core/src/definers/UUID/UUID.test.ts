/* eslint-disable unicorn/filename-case */
import { UUID } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineUUID } from "./UUID";

describe("defineUUID", async () => {
	test('defineUUID({ mode: "UUID" })', async () => {
		const postgres = new Client({
				application_name: "uuid.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("uuid", {
				_uuid: defineUUID("_uuid", { mode: "UUID" }).array().notNull(),
				uuid: defineUUID("uuid", { mode: "UUID" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists uuid (
				uuid uuid not null,
				_uuid _uuid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_uuid: [UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), UUID.from("cd65d0c9-3818-4cdc-ad3c-52f5757a1b63")],
				uuid: UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"),
			})
			.returning();

		expect(UUID.isUUID(result1[0].uuid)).toBe(true);
		expect(result1[0]._uuid.length).toBe(2);
		expect(UUID.isUUID(result1[0]._uuid[0])).toBe(true);
		expect(UUID.isUUID(result1[0]._uuid[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(UUID.isUUID(result2[0].uuid)).toBe(true);
		expect(result2[0]._uuid.length).toBe(2);
		expect(UUID.isUUID(result2[0]._uuid[0])).toBe(true);
		expect(UUID.isUUID(result2[0]._uuid[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.uuid, UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")))
			.execute();

		expect(UUID.isUUID(result3[0].uuid)).toBe(true);
		expect(result3[0]._uuid.length).toBe(2);
		expect(UUID.isUUID(result3[0]._uuid[0])).toBe(true);
		expect(UUID.isUUID(result3[0]._uuid[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.uuid, UUID.from("cd65d0c9-3818-4cdc-ad3c-52f5757a1b63")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.uuid, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table uuid;
		`);

		expect(table.uuid.getSQLType()).toBe("uuid");
	});

	test('defineUUID({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "uuidstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("uuidstring", {
				_uuid: defineUUID("_uuid", { mode: "string" }).array().notNull(),
				uuid: defineUUID("uuid", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists uuidstring (
				uuid uuid not null,
				_uuid _uuid not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_uuid: ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "cd65d0c9-3818-4cdc-ad3c-52f5757a1b63"],
				uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
			})
			.returning();

		expect(result1[0].uuid).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(result1[0]._uuid.length).toBe(2);
		expect(result1[0]._uuid[0]).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(result1[0]._uuid[1]).toBe("cd65d0c9-3818-4cdc-ad3c-52f5757a1b63");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].uuid).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(result2[0]._uuid.length).toBe(2);
		expect(result2[0]._uuid[0]).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(result2[0]._uuid[1]).toBe("cd65d0c9-3818-4cdc-ad3c-52f5757a1b63");

		const result3 = await database.select().from(table).where(eq(table.uuid, "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")).execute();

		expect(result3[0].uuid).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(result3[0]._uuid.length).toBe(2);
		expect(result3[0]._uuid[0]).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
		expect(result3[0]._uuid[1]).toBe("cd65d0c9-3818-4cdc-ad3c-52f5757a1b63");

		const result4 = await database.select().from(table).where(eq(table.uuid, "cd65d0c9-3818-4cdc-ad3c-52f5757a1b63")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.uuid, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table uuidstring;
		`);

		expect(table.uuid.getSQLType()).toBe("uuid");
	});
});
