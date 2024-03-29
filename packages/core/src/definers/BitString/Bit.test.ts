import { Bit } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineBit } from "./Bit";

describe("defineBit", async () => {
	test('defineBit({ mode: "Bit" })', async () => {
		const postgres = new Client({
				application_name: "bit.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("bit", {
				_bit: defineBit("_bit", { mode: "Bit" }).array().notNull(),
				bit: defineBit("bit", { mode: "Bit" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists bit (
				bit bit not null,
				_bit _bit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_bit: [Bit.from(1), Bit.from(0)],
				bit: Bit.from(1),
			})
			.returning();

		expect(Bit.isAnyBit(result1[0].bit)).toBe(true);
		expect(result1[0]._bit.length).toBe(2);
		expect(Bit.isAnyBit(result1[0]._bit[0])).toBe(true);
		expect(Bit.isAnyBit(result1[0]._bit[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Bit.isAnyBit(result2[0].bit)).toBe(true);
		expect(result2[0]._bit.length).toBe(2);
		expect(Bit.isAnyBit(result2[0]._bit[0])).toBe(true);
		expect(Bit.isAnyBit(result2[0]._bit[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.bit, Bit.from(1)))
			.execute();

		expect(Bit.isAnyBit(result3[0].bit)).toBe(true);
		expect(result3[0]._bit.length).toBe(2);
		expect(Bit.isAnyBit(result3[0]._bit[0])).toBe(true);
		expect(Bit.isAnyBit(result3[0]._bit[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.bit, Bit.from(0)))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bit, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table bit;
		`);

		expect(table.bit.getSQLType()).toBe("bit");
	});

	test('defineBit({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "bitstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("bitstring", {
				_bit: defineBit("_bit", { mode: "string" }).array().notNull(),
				bit: defineBit("bit", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists bitstring (
				bit bit not null,
				_bit _bit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_bit: ["1", "0"],
				bit: "1",
			})
			.returning();

		expect(result1[0].bit).toBe("1");
		expect(result1[0]._bit.length).toBe(2);
		expect(result1[0]._bit[0]).toBe("1");
		expect(result1[0]._bit[1]).toBe("0");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].bit).toBe("1");
		expect(result2[0]._bit.length).toBe(2);
		expect(result2[0]._bit[0]).toBe("1");
		expect(result2[0]._bit[1]).toBe("0");

		const result3 = await database.select().from(table).where(eq(table.bit, "1")).execute();

		expect(result3[0].bit).toBe("1");
		expect(result3[0]._bit.length).toBe(2);
		expect(result3[0]._bit[0]).toBe("1");
		expect(result3[0]._bit[1]).toBe("0");

		const result4 = await database.select().from(table).where(eq(table.bit, "0")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bit, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table bitstring;
		`);

		expect(table.bit.getSQLType()).toBe("bit");
	});

	test('defineBit({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "bitnumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("bitnumber", {
				_bit: defineBit("_bit", { mode: "number" }).array().notNull(),
				bit: defineBit("bit", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists bitnumber (
				bit bit not null,
				_bit _bit not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_bit: [1, 0],
				bit: 1,
			})
			.returning();

		expect(result1[0].bit).toBe(1);
		expect(result1[0]._bit.length).toBe(2);
		expect(result1[0]._bit[0]).toBe(1);
		expect(result1[0]._bit[1]).toBe(0);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].bit).toBe(1);
		expect(result2[0]._bit.length).toBe(2);
		expect(result2[0]._bit[0]).toBe(1);
		expect(result2[0]._bit[1]).toBe(0);

		const result3 = await database.select().from(table).where(eq(table.bit, 1)).execute();

		expect(result3[0].bit).toBe(1);
		expect(result3[0]._bit.length).toBe(2);
		expect(result3[0]._bit[0]).toBe(1);
		expect(result3[0]._bit[1]).toBe(0);

		const result4 = await database.select().from(table).where(eq(table.bit, 0)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bit, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table bitnumber;
		`);

		expect(table.bit.getSQLType()).toBe("bit");
	});

	test("defineBit({ length: 3 })", async () => {
		const postgres = new Client({
				application_name: "bitlength.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("bitlength", {
				bit1: defineBit("bit1", { length: 3, mode: "Bit" }).notNull(),
				bit2: defineBit("bit2", { length: 3, mode: "string" }).notNull(),
				bit3: defineBit("bit3", { length: 3, mode: "number" }).notNull(),
			});

		await database.connect();

		// eslint-disable-next-line unicorn/template-indent
		await database.execute(sql`
			create table if not exists bitlength (
				bit1 bit(3) not null,
        bit2 bit(3) not null,
        bit3 bit(3) not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				bit1: Bit.setN(3).from(4),
				bit2: "100",
				bit3: 4,
			})
			.returning();

		expect(result1[0].bit1.toNumber()).toBe(4);
		expect(result1[0].bit2).toBe("100");
		expect(result1[0].bit3).toBe(4);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].bit1.toNumber()).toBe(4);
		expect(result2[0].bit2).toBe("100");
		expect(result2[0].bit3).toBe(4);

		const result3 = await database.select().from(table).where(eq(table.bit3, 4)).execute();

		expect(result3[0].bit1.toNumber()).toBe(4);
		expect(result3[0].bit2).toBe("100");
		expect(result3[0].bit3).toBe(4);

		const result4 = await database.select().from(table).where(eq(table.bit3, 0)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.bit1, true as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");

		await database.execute(sql`
			drop table bitlength;
		`);

		expect(table.bit1.getSQLType()).toBe("bit(3)");
		expect(table.bit2.getSQLType()).toBe("bit(3)");
		expect(table.bit3.getSQLType()).toBe("bit(3)");
	});
});
