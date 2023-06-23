import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineFloat4, defineInt2, defineText } from "./definers/index.js";
import {
	abs,
	ascii,
	avg,
	bitLength,
	ceil,
	charLength,
	count,
	divide,
	floor,
	left,
	length,
	lower,
	lpad,
	ltrim,
	max,
	min,
	minus,
	neq,
	pi,
	plus,
	power,
	repeat,
	replace,
	reverse,
	right,
	round,
	rpad,
	rtrim,
	sign,
	sqrt,
	substring,
	sum,
	times,
	trim,
	upper,
} from "./operators.js";

describe("Operators", async () => {
	test("plus", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "plus.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("plus", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists plus (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, plus(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table plus;
		`);
	});

	test("minus", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "minus.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("minus", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists minus (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, minus(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table minus;
		`);
	});

	test("times", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "times.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("times", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists times (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, times(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table times;
		`);
	});

	test("divide", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "divide.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("divide", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists divide (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, divide(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table divide;
		`);
	});

	test("count", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "count.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("count", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists count (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				count: count(table.int2),
			})
			.from(table);

		expect(result2[0].count).toBe(1);

		await database.execute(sql`
			drop table count;
		`);
	});

	test("sum", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "sum.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("sum", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists sum (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				sum: sum(table.int2),
			})
			.from(table);

		expect(result2[0].sum).toBe(1);

		await database.execute(sql`
			drop table sum;
		`);
	});

	test("avg", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "avg.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("avg", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists avg (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				avg: avg(table.int2),
			})
			.from(table);

		expect(result2[0].avg).toBe(1);

		await database.execute(sql`
			drop table avg;
		`);
	});

	test("min", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "min.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("min", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists min (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				min: min(table.int2),
			})
			.from(table);

		expect(result2[0].min).toBe(1);

		await database.execute(sql`
			drop table min;
		`);
	});

	test("max", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "max.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("max", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists max (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				max: max(table.int2),
			})
			.from(table);

		expect(result2[0].max).toBe(1);

		await database.execute(sql`
			drop table max;
		`);
	});

	test("ascii", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "ascii.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("ascii", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists ascii (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "a",
			})
			.returning();

		expect(result1[0].text).toBe("a");

		const result2 = await database
			.select({
				ascii: ascii(table.text),
			})
			.from(table);

		expect(result2[0].ascii).toBe(97);

		await database.execute(sql`
			drop table ascii;
		`);
	});

	test("bitLength", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "bitLength.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("bitlength", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists bitlength (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "a",
			})
			.returning();

		expect(result1[0].text).toBe("a");

		const result2 = await database
			.select({
				bitLength: bitLength(table.text),
			})
			.from(table);

		expect(result2[0].bitLength).toBe(8);

		await database.execute(sql`
			drop table bitlength;
		`);
	});

	test("charLength", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "charLength.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("charlength", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists charlength (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "a",
			})
			.returning();

		expect(result1[0].text).toBe("a");

		const result2 = await database
			.select({
				charLength: charLength(table.text),
			})
			.from(table);

		expect(result2[0].charLength).toBe(1);

		await database.execute(sql`
			drop table charlength;
		`);
	});

	test("lower", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "lower.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("lower", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists lower (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				lower: lower(table.text),
			})
			.from(table);

		expect(result2[0].lower).toBe("text");

		await database.execute(sql`
			drop table lower;
		`);
	});

	test("upper", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "upper.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("upper", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists upper (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				upper: upper(table.text),
			})
			.from(table);

		expect(result2[0].upper).toBe("TEXT");

		await database.execute(sql`
			drop table upper;
		`);
	});

	test("length", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "length.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("length", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists length (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				length: length(table.text),
			})
			.from(table);

		expect(result2[0].length).toBe(4);

		await database.execute(sql`
			drop table length;
		`);
	});

	test("ltrim", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "ltrim.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("ltrim", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists ltrim (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: " Text",
			})
			.returning();

		expect(result1[0].text).toBe(" Text");

		const result2 = await database
			.select({
				ltrim: ltrim(table.text),
			})
			.from(table);

		expect(result2[0].ltrim).toBe("Text");

		await database.execute(sql`
			drop table ltrim;
		`);
	});

	test("rtrim", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "rtrim.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("rtrim", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists rtrim (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text ",
			})
			.returning();

		expect(result1[0].text).toBe("Text ");

		const result2 = await database
			.select({
				rtrim: rtrim(table.text),
			})
			.from(table);

		expect(result2[0].rtrim).toBe("Text");

		await database.execute(sql`
			drop table rtrim;
		`);
	});

	test("trim", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "trim.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("trim", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists trim (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: " Text ",
			})
			.returning();

		expect(result1[0].text).toBe(" Text ");

		const result2 = await database
			.select({
				trim: trim(table.text),
			})
			.from(table);

		expect(result2[0].trim).toBe("Text");

		await database.execute(sql`
			drop table trim;
		`);
	});

	test("replace", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "replace.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("replace", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists replace (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				replace: replace(table.text, "e", "E"),
			})
			.from(table);

		expect(result2[0].replace).toBe("TExt");

		await database.execute(sql`
			drop table replace;
		`);
	});

	test("reverse", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "reverse.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("reverse", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists reverse (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				reverse: reverse(table.text),
			})
			.from(table);

		expect(result2[0].reverse).toBe("txeT");

		await database.execute(sql`
			drop table reverse;
		`);
	});

	test("substring", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "substring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("substring", {
				text1: defineText("text1").notNull(),
				text2: defineText("text2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists substring (
				text1 text not null,
				text2 text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text1: "Text",
				text2: "Text",
			})
			.returning();

		expect(result1[0].text1).toBe("Text");
		expect(result1[0].text2).toBe("Text");

		const result2 = await database
			.select({
				substring1: substring(table.text1, 2),
				substring2: substring(table.text2, 2, 2),
			})
			.from(table);

		expect(result2[0].substring1).toBe("ext");
		expect(result2[0].substring2).toBe("ex");

		await database.execute(sql`
			drop table substring;
		`);
	});

	test("left", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "left.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("leftt", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists leftt (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				left: left(table.text, 2),
			})
			.from(table);

		expect(result2[0].left).toBe("Te");

		await database.execute(sql`
			drop table leftt;
		`);
	});

	test("right", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "right.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("rightt", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists rightt (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				right: right(table.text, 2),
			})
			.from(table);

		expect(result2[0].right).toBe("xt");

		await database.execute(sql`
			drop table rightt;
		`);
	});

	test("repeat", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "repeat.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("repeat", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists repeat (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				repeat: repeat(table.text, 3),
			})
			.from(table);

		expect(result2[0].repeat).toBe("TextTextText");

		await database.execute(sql`
			drop table repeat;
		`);
	});

	test("abs", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "abs.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("abs", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists abs (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				abs: abs(table.int2),
			})
			.from(table);

		expect(result2[0].abs).toBe(1);

		await database.execute(sql`
			drop table abs;
		`);
	});

	test("ceil", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "ceil.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("ceil", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists ceil (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				ceil: ceil(table.int2),
			})
			.from(table);

		expect(result2[0].ceil).toBe(1);

		await database.execute(sql`
			drop table ceil;
		`);
	});

	test("floor", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "floor.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("floor", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists floor (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				floor: floor(table.int2),
			})
			.from(table);

		expect(result2[0].floor).toBe(1);

		await database.execute(sql`
			drop table floor;
		`);
	});

	test("round", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "round.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("round", {
				float1: defineFloat4("float1").notNull(),
				float2: defineFloat4("float2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists round (
				float1 float4 not null,
				float2 float4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float1: 1.567,
				float2: 1.567,
			})
			.returning();

		expect(result1[0].float1).toBe(1.567);
		expect(result1[0].float2).toBe(1.567);

		const result2 = await database
			.select({
				round1: round(table.float1),
				round2: round(table.float2, 2),
			})
			.from(table);

		expect(result2[0].round1).toBe(2);
		expect(result2[0].round2).toBe(1.57);

		await database.execute(sql`
			drop table round;
		`);
	});

	test("sign", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "sign.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("sign", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists sign (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				sign: sign(table.int2),
			})
			.from(table);

		expect(result2[0].sign).toBe(1);

		await database.execute(sql`
			drop table sign;
		`);
	});

	test("sqrt", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "sqrt.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("sqrt", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists sqrt (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				sqrt: sqrt(table.int2),
			})
			.from(table);

		expect(result2[0].sqrt).toBe(1);

		await database.execute(sql`
			drop table sqrt;
		`);
	});

	test("power", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "power.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("power", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists power (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				power: power(table.int2, 2),
			})
			.from(table);

		expect(result2[0].power).toBe(1);

		await database.execute(sql`
			drop table power;
		`);
	});

	test("pi", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "pi.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("pi", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists pi (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				pi: pi(),
				int2: table.int2,
			})
			.from(table);

		expect(result2[0].pi).toBeTypeOf("number");
		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table pi;
		`);
	});

	test("lpad", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "lpad.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("lpad", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists lpad (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				lpad: lpad(table.text, 6, "x"),
			})
			.from(table);

		expect(result2[0].lpad).toBe("xxText");

		await database.execute(sql`
			drop table lpad;
		`);
	});

	test("rpad", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "rpad.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("rpad", {
				text: defineText("text").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists rpad (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Text",
			})
			.returning();

		expect(result1[0].text).toBe("Text");

		const result2 = await database
			.select({
				rpad: rpad(table.text, 6, "x"),
			})
			.from(table);

		expect(result2[0].rpad).toBe("Textxx");

		await database.execute(sql`
			drop table rpad;
		`);
	});
});
