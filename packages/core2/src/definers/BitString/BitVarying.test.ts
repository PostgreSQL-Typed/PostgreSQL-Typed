import { BitVarying } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineBitVarying } from "./BitVarying";

describe("defineBitVarying", async () => {
	test('defineBitVarying({ mode: "BitVarying" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "varbit.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("varbit", {
				varbit: defineBitVarying("varbit", { mode: "BitVarying" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists varbit (
				varbit varbit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				varbit: BitVarying.from(1),
			})
			.returning();

		expect(BitVarying.isAnyBitVarying(result1[0].varbit)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(BitVarying.isAnyBitVarying(result2[0].varbit)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.varbit, BitVarying.from(1)))
			.execute();

		expect(BitVarying.isAnyBitVarying(result3[0].varbit)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.varbit, BitVarying.from(0)))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table varbit;
		`);

		expect(table.varbit.getSQLType()).toBe("varbit");
	});

	test('defineBitVarying({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "varbitstring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("varbitstring", {
				varbit: defineBitVarying("varbit", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists varbitstring (
				varbit varbit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				varbit: "1",
			})
			.returning();

		expect(result1[0].varbit).toBe("1");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].varbit).toBe("1");

		const result3 = await database.select().from(table).where(eq(table.varbit, "1")).execute();

		expect(result3[0].varbit).toBe("1");

		const result4 = await database.select().from(table).where(eq(table.varbit, "0")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table varbitstring;
		`);

		expect(table.varbit.getSQLType()).toBe("varbit");
	});

	test('defineBitVarying({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "varbitnumber.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("varbitnumber", {
				varbit: defineBitVarying("varbit", { mode: "number" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists varbitnumber (
				varbit varbit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				varbit: 1,
			})
			.returning();

		expect(result1[0].varbit).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].varbit).toBe(1);

		const result3 = await database.select().from(table).where(eq(table.varbit, 1)).execute();

		expect(result3[0].varbit).toBe(1);

		const result4 = await database.select().from(table).where(eq(table.varbit, 0)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table varbitnumber;
		`);

		expect(table.varbit.getSQLType()).toBe("varbit");
	});

	test("defineBitVarying({ length: 3 })", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "varbitlength.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("varbitlength", {
				varbit1: defineBitVarying("varbit1", { mode: "BitVarying", length: 3 }).notNull(),
				varbit2: defineBitVarying("varbit2", { mode: "string", length: 3 }).notNull(),
				varbit3: defineBitVarying("varbit3", { mode: "number", length: 3 }).notNull(),
			});

		await postgres.connect();

		// eslint-disable-next-line unicorn/template-indent
		await database.execute(sql`
			create table if not exists varbitlength (
				varbit1 varbit(3) not null,
        varbit2 varbit(3) not null,
        varbit3 varbit(3) not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				varbit1: BitVarying.setN(3).from(4),
				varbit2: "100",
				varbit3: 4,
			})
			.returning();

		expect(result1[0].varbit1.toNumber()).toBe(4);
		expect(result1[0].varbit2).toBe("100");
		expect(result1[0].varbit3).toBe(4);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].varbit1.toNumber()).toBe(4);
		expect(result2[0].varbit2).toBe("100");
		expect(result2[0].varbit3).toBe(4);

		const result3 = await database.select().from(table).where(eq(table.varbit3, 4)).execute();

		expect(result3[0].varbit1.toNumber()).toBe(4);
		expect(result3[0].varbit2).toBe("100");
		expect(result3[0].varbit3).toBe(4);

		const result4 = await database.select().from(table).where(eq(table.varbit3, 0)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table varbitlength;
		`);

		expect(table.varbit1.getSQLType()).toBe("varbit(3)");
		expect(table.varbit2.getSQLType()).toBe("varbit(3)");
		expect(table.varbit3.getSQLType()).toBe("varbit(3)");
	});
});
