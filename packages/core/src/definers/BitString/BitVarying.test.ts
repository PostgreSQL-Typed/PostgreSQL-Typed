import { BitVarying } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineBitVarying } from "./BitVarying";

describe("defineBitVarying", async () => {
	test('defineBitVarying({ mode: "BitVarying" })', async () => {
		const postgres = new Client({
				application_name: "varbit.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("varbit", {
				_varbit: defineBitVarying("_varbit", { mode: "BitVarying" }).array().notNull(),
				varbit: defineBitVarying("varbit", { mode: "BitVarying" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists varbit (
				varbit varbit not null,
				_varbit _varbit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_varbit: [BitVarying.from(1), BitVarying.from(0)],
				varbit: BitVarying.from(1),
			})
			.returning();

		expect(BitVarying.isAnyBitVarying(result1[0].varbit)).toBe(true);
		expect(result1[0]._varbit.length).toBe(2);
		expect(BitVarying.isAnyBitVarying(result1[0]._varbit[0])).toBe(true);
		expect(BitVarying.isAnyBitVarying(result1[0]._varbit[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(BitVarying.isAnyBitVarying(result2[0].varbit)).toBe(true);
		expect(result2[0]._varbit.length).toBe(2);
		expect(BitVarying.isAnyBitVarying(result2[0]._varbit[0])).toBe(true);
		expect(BitVarying.isAnyBitVarying(result2[0]._varbit[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.varbit, BitVarying.from(1)))
			.execute();

		expect(BitVarying.isAnyBitVarying(result3[0].varbit)).toBe(true);
		expect(result3[0]._varbit.length).toBe(2);
		expect(BitVarying.isAnyBitVarying(result3[0]._varbit[0])).toBe(true);
		expect(BitVarying.isAnyBitVarying(result3[0]._varbit[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.varbit, BitVarying.from(0)))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.varbit, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table varbit;
		`);

		expect(table.varbit.getSQLType()).toBe("varbit");
	});

	test('defineBitVarying({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "varbitstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("varbitstring", {
				_varbit: defineBitVarying("_varbit", { mode: "string" }).array().notNull(),
				varbit: defineBitVarying("varbit", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists varbitstring (
				varbit varbit not null,
				_varbit _varbit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_varbit: ["1", "0"],
				varbit: "1",
			})
			.returning();

		expect(result1[0].varbit).toBe("1");
		expect(result1[0]._varbit.length).toBe(2);
		expect(result1[0]._varbit[0]).toBe("1");
		expect(result1[0]._varbit[1]).toBe("0");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].varbit).toBe("1");
		expect(result2[0]._varbit.length).toBe(2);
		expect(result2[0]._varbit[0]).toBe("1");
		expect(result2[0]._varbit[1]).toBe("0");

		const result3 = await database.select().from(table).where(eq(table.varbit, "1")).execute();

		expect(result3[0].varbit).toBe("1");
		expect(result3[0]._varbit.length).toBe(2);
		expect(result3[0]._varbit[0]).toBe("1");
		expect(result3[0]._varbit[1]).toBe("0");

		const result4 = await database.select().from(table).where(eq(table.varbit, "0")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.varbit, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table varbitstring;
		`);

		expect(table.varbit.getSQLType()).toBe("varbit");
	});

	test('defineBitVarying({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "varbitnumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("varbitnumber", {
				_varbit: defineBitVarying("_varbit", { mode: "number" }).array().notNull(),
				varbit: defineBitVarying("varbit", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists varbitnumber (
				varbit varbit not null,
				_varbit _varbit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_varbit: [1, 0],
				varbit: 1,
			})
			.returning();

		expect(result1[0].varbit).toBe(1);
		expect(result1[0]._varbit.length).toBe(2);
		expect(result1[0]._varbit[0]).toBe(1);
		expect(result1[0]._varbit[1]).toBe(0);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].varbit).toBe(1);
		expect(result2[0]._varbit.length).toBe(2);
		expect(result2[0]._varbit[0]).toBe(1);
		expect(result2[0]._varbit[1]).toBe(0);

		const result3 = await database.select().from(table).where(eq(table.varbit, 1)).execute();

		expect(result3[0].varbit).toBe(1);
		expect(result3[0]._varbit.length).toBe(2);
		expect(result3[0]._varbit[0]).toBe(1);
		expect(result3[0]._varbit[1]).toBe(0);

		const result4 = await database.select().from(table).where(eq(table.varbit, 0)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.varbit, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table varbitnumber;
		`);

		expect(table.varbit.getSQLType()).toBe("varbit");
	});

	test("defineBitVarying({ length: 3 })", async () => {
		const postgres = new Client({
				application_name: "varbitlength.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("varbitlength", {
				varbit1: defineBitVarying("varbit1", { length: 3, mode: "BitVarying" }).notNull(),
				varbit2: defineBitVarying("varbit2", { length: 3, mode: "string" }).notNull(),
				varbit3: defineBitVarying("varbit3", { length: 3, mode: "number" }).notNull(),
			});

		await database.connect();

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

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.varbit1, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table varbitlength;
		`);

		expect(table.varbit1.getSQLType()).toBe("varbit(3)");
		expect(table.varbit2.getSQLType()).toBe("varbit(3)");
		expect(table.varbit3.getSQLType()).toBe("varbit(3)");
	});
});
