import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineFloat4, defineInt2, defineText, defineTimestamp, defineTimestampTZ } from "./definers/index.js";
import { pgt } from "./driver.js";
import {
	abs,
	and,
	ascii,
	avg,
	between,
	bitLength,
	ceil,
	charLength,
	count,
	divide,
	eq,
	extractCentury,
	extractDay,
	extractDecade,
	extractDow,
	extractDoy,
	extractEpoch,
	extractHour,
	extractIsoDow,
	extractIsoYear,
	extractMicroseconds,
	extractMillennium,
	extractMilliseconds,
	extractMinute,
	extractMonth,
	extractQuarter,
	extractSecond,
	extractTimezone,
	extractTimezoneHour,
	extractTimezoneMinute,
	extractUnix,
	extractWeek,
	extractYear,
	floor,
	gt,
	gte,
	ilike,
	inArray,
	isNotNull,
	isNull,
	left,
	length,
	like,
	lower,
	lpad,
	lt,
	lte,
	ltrim,
	max,
	min,
	minus,
	neq,
	not,
	notBetween,
	notIlike,
	notInArray,
	notLike,
	or,
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
			database = pgt(postgres),
			table = pgTable("plus", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("minus", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("times", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("divide", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("count", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("sum", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("avg", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("min", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("max", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("ascii", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("bitlengthfunc", {
				text: defineText("text").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists bitlengthfunc (
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
			drop table bitlengthfunc;
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
			database = pgt(postgres),
			table = pgTable("charlength", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("lower", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("upper", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("length", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("ltrim", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("rtrim", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("trim", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("replace", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("reverse", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("substring", {
				text1: defineText("text1").notNull(),
				text2: defineText("text2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("leftt", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("rightt", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("repeat", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("abs", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("ceil", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("floor", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("round", {
				float1: defineFloat4("float1").notNull(),
				float2: defineFloat4("float2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("sign", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("sqrt", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("power", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("pi", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("lpad", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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
			database = pgt(postgres),
			table = pgTable("rpad", {
				text: defineText("text").notNull(),
			});

		await database.connect();

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

	test("extractCentury", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractcentury.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractcentury", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractcentury (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractcentury: extractCentury(table.ts),
			})
			.from(table);

		expect(result2[0].extractcentury).toBe(21);

		await database.execute(sql`
			drop table extractcentury;
		`);
	});

	test("extractDay", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractday.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractday", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractday (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractday: extractDay(table.ts),
			})
			.from(table);

		expect(result2[0].extractday).toBe(21);

		await database.execute(sql`
			drop table extractday;
		`);
	});

	test("extractDecade", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractdecade.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractdecade", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractdecade (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractdecade: extractDecade(table.ts),
			})
			.from(table);

		expect(result2[0].extractdecade).toBe(202);

		await database.execute(sql`
			drop table extractdecade;
		`);
	});

	test("extractDow", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractdow.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractdow", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractdow (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractdow: extractDow(table.ts),
			})
			.from(table);

		expect(result2[0].extractdow).toBe(4);

		await database.execute(sql`
			drop table extractdow;
		`);
	});

	test("extractDoy", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractdoy.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractdoy", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractdoy (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractdoy: extractDoy(table.ts),
			})
			.from(table);

		expect(result2[0].extractdoy).toBe(21);

		await database.execute(sql`
			drop table extractdoy;
		`);
	});

	test("extractEpoch", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractepoch.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractepoch", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractepoch (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractepoch: extractEpoch(table.ts),
			})
			.from(table);

		expect(result2[0].extractepoch).toBe(1_611_187_200);

		await database.execute(sql`
			drop table extractepoch;
		`);
	});

	test("extractHour", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extracthour.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extracthour", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extracthour (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extracthour: extractHour(table.ts),
			})
			.from(table);

		expect(result2[0].extracthour).toBe(0);

		await database.execute(sql`
			drop table extracthour;
		`);
	});

	test("extractIsoDow", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractisodow.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractisodow", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractisodow (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractisodow: extractIsoDow(table.ts),
			})
			.from(table);

		expect(result2[0].extractisodow).toBe(4);

		await database.execute(sql`
			drop table extractisodow;
		`);
	});

	test("extractIsoYear", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractisoyear.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractisoyear", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractisoyear (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractisoyear: extractIsoYear(table.ts),
			})
			.from(table);

		expect(result2[0].extractisoyear).toBe(2021);

		await database.execute(sql`
			drop table extractisoyear;
		`);
	});

	test("extractMicroseconds", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractmicroseconds.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractmicroseconds", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractmicroseconds (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractmicroseconds: extractMicroseconds(table.ts),
			})
			.from(table);

		expect(result2[0].extractmicroseconds).toBe(0);

		await database.execute(sql`
			drop table extractmicroseconds;
		`);
	});

	test("extractMillennium", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractmillennium.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractmillennium", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractmillennium (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractmillennium: extractMillennium(table.ts),
			})
			.from(table);

		expect(result2[0].extractmillennium).toBe(3);

		await database.execute(sql`
			drop table extractmillennium;
		`);
	});

	test("extractMilliseconds", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractmilliseconds.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractmilliseconds", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractmilliseconds (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractmilliseconds: extractMilliseconds(table.ts),
			})
			.from(table);

		expect(result2[0].extractmilliseconds).toBe(0);

		await database.execute(sql`
			drop table extractmilliseconds;
		`);
	});

	test("extractMinute", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractminute.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractminute", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractminute (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractminute: extractMinute(table.ts),
			})
			.from(table);

		expect(result2[0].extractminute).toBe(0);

		await database.execute(sql`
			drop table extractminute;
		`);
	});

	test("extractMonth", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractmonth.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractmonth", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractmonth (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractmonth: extractMonth(table.ts),
			})
			.from(table);

		expect(result2[0].extractmonth).toBe(1);

		await database.execute(sql`
			drop table extractmonth;
		`);
	});

	test("extractQuarter", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractquarter.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractquarter", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractquarter (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractquarter: extractQuarter(table.ts),
			})
			.from(table);

		expect(result2[0].extractquarter).toBe(1);

		await database.execute(sql`
			drop table extractquarter;
		`);
	});

	test("extractSecond", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractsecond.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractsecond", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractsecond (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractsecond: extractSecond(table.ts),
			})
			.from(table);

		expect(result2[0].extractsecond).toBe(0);

		await database.execute(sql`
			drop table extractsecond;
		`);
	});

	test("extractTimezone", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extracttimezone.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extracttimezone", {
				ts: defineTimestampTZ("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extracttimezone (
				ts timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extracttimezone: extractTimezone(table.ts),
			})
			.from(table);

		expect(result2[0].extracttimezone).toBe(0);

		await database.execute(sql`
			drop table extracttimezone;
		`);
	});

	test("extractTimezoneHour", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extracttimezonehour.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extracttimezonehour", {
				ts: defineTimestampTZ("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extracttimezonehour (
				ts timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extracttimezonehour: extractTimezoneHour(table.ts),
			})
			.from(table);

		expect(result2[0].extracttimezonehour).toBe(0);

		await database.execute(sql`
			drop table extracttimezonehour;
		`);
	});

	test("extractTimezoneMinute", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extracttimezoneminute.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extracttimezoneminute", {
				ts: defineTimestampTZ("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extracttimezoneminute (
				ts timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extracttimezoneminute: extractTimezoneMinute(table.ts),
			})
			.from(table);

		expect(result2[0].extracttimezoneminute).toBe(0);

		await database.execute(sql`
			drop table extracttimezoneminute;
		`);
	});

	test("extractWeek", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractweek.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractweek", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractweek (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractweek: extractWeek(table.ts),
			})
			.from(table);

		expect(result2[0].extractweek).toBe(3);

		await database.execute(sql`
			drop table extractweek;
		`);
	});

	test("extractUnix", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractunix.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractunix", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractunix (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: Date.now() + 1000 * 60 * 60 * 24,
			})
			.returning();

		expect(result1[0].ts).toBeGreaterThan(Date.now());

		const result2 = await database
			.select({
				extractunix: table.ts,
			})
			.from(table)
			.where(gt(extractUnix(table.ts), Date.now()));

		expect(result2[0].extractunix).toBeGreaterThan(Date.now());

		await database.execute(sql`
			drop table extractunix;
		`);
	});

	test("extractYear", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "extractyear.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("extractyear", {
				ts: defineTimestamp("ts", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists extractyear (
				ts timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				ts: "2021-01-21 00:00:00" as any,
			})
			.returning();

		expect(result1[0].ts).toBe(1_611_187_200_000);

		const result2 = await database
			.select({
				extractyear: extractYear(table.ts),
			})
			.from(table);

		expect(result2[0].extractyear).toBe(2021);

		await database.execute(sql`
			drop table extractyear;
		`);
	});

	test("eq", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "eq.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("eq", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists eq (
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

		const result2 = await database.select().from(table).where(eq(table.int2, 1));

		expect(result2).toHaveLength(1);
		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table eq;
		`);
	});

	test("neq", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "neq.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("neq", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists neq (
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

		const result2 = await database.select().from(table).where(neq(table.int2, 2));

		expect(result2).toHaveLength(1);
		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table neq;
		`);
	});

	test("and", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "and.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("andd", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists andd (
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
			.where(and(neq(table.int2, 2), neq(table.int2, 3)));

		expect(result2).toHaveLength(1);
		expect(result2[0].int2).toBe(1);

		const result3 = await database
			.select()
			.from(table)
			.where(and(neq(table.int2, 3)));

		expect(result3).toHaveLength(1);
		expect(result3[0].int2).toBe(1);

		const result4 = await database.select().from(table).where(and());

		expect(result4).toHaveLength(1);
		expect(result4[0].int2).toBe(1);

		await database.execute(sql`
			drop table andd;
		`);
	});

	test("or", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "or.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("orr", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists orr (
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
			.where(or(eq(table.int2, 1), eq(table.int2, 2)));

		expect(result2).toHaveLength(1);
		expect(result2[0].int2).toBe(1);

		const result3 = await database
			.select()
			.from(table)
			.where(or(eq(table.int2, 1)));

		expect(result3).toHaveLength(1);
		expect(result3[0].int2).toBe(1);

		const result4 = await database.select().from(table).where(or());

		expect(result4).toHaveLength(1);
		expect(result4[0].int2).toBe(1);

		await database.execute(sql`
			drop table orr;
		`);
	});

	test("not", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "not.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("nott", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists nott (
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
				nott: not(inArray(table.int2, [2])),
			})
			.from(table);

		expect(result2[0].nott).toBe(true);

		await database.execute(sql`
			drop table nott;
		`);
	});

	test("gt", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "gt.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("gt", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists gt (
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
				gt: gt(table.int2, 0),
			})
			.from(table);

		expect(result2[0].gt).toBe(true);

		await database.execute(sql`
			drop table gt;
		`);
	});

	test("gte", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "gte.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("gte", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists gte (
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
				gte: gte(table.int2, 1),
			})
			.from(table);

		expect(result2[0].gte).toBe(true);

		await database.execute(sql`
			drop table gte;
		`);
	});

	test("lt", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "lt.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("lt", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists lt (
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
				lt: lt(table.int2, 2),
			})
			.from(table);

		expect(result2[0].lt).toBe(true);

		await database.execute(sql`
			drop table lt;
		`);
	});

	test("lte", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "lte.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("lte", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists lte (
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
				lte: lte(table.int2, 1),
			})
			.from(table);

		expect(result2[0].lte).toBe(true);

		await database.execute(sql`
			drop table lte;
		`);
	});

	test("inArray", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "inarray.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("inarray", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists inarray (
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
				inarray: inArray(table.int2, [1, 2, 3]),
			})
			.from(table);

		expect(result2[0].inarray).toBe(true);

		await database.execute(sql`
			drop table inarray;
		`);
	});

	test("notInArray", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "notinarray.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("notinarray", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists notinarray (
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
				notinarray: notInArray(table.int2, [2, 3, 4]),
			})
			.from(table);

		expect(result2[0].notinarray).toBe(true);

		await database.execute(sql`
			drop table notinarray;
		`);
	});

	test("isNull", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "isnull.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("isnulll", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists isnulll (
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
				isnull: isNull(table.int2),
			})
			.from(table);

		expect(result2[0].isnull).toBe(false);

		await database.execute(sql`
			drop table isnulll;
		`);
	});

	test("isNotNull", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "isnotnull.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("isnotnull", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists isnotnull (
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
				isnotnull: isNotNull(table.int2),
			})
			.from(table);

		expect(result2[0].isnotnull).toBe(true);

		await database.execute(sql`
			drop table isnotnull;
		`);
	});

	test("between", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "between.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("between", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists between (
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
				between: between(table.int2, 0, 2),
			})
			.from(table);

		expect(result2[0].between).toBe(true);

		await database.execute(sql`
			drop table between;
		`);
	});

	test("notBetween", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "notbetween.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("notbetween", {
				int2: defineInt2("int2").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists notbetween (
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
				notbetween: notBetween(table.int2, 2, 4),
			})
			.from(table);

		expect(result2[0].notbetween).toBe(true);

		await database.execute(sql`
			drop table notbetween;
		`);
	});

	test("like", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "likee.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("likee", {
				text: defineText("text").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists likee (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Foo",
			})
			.returning();

		expect(result1[0].text).toBe("Foo");

		const result2 = await database
			.select({
				likee: like(table.text, "%oo"),
			})
			.from(table);

		expect(result2[0].likee).toBe(true);

		await database.execute(sql`
			drop table likee;
		`);
	});

	test("notLike", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "notlikee.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("notlikee", {
				text: defineText("text").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists notlikee (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Foo",
			})
			.returning();

		expect(result1[0].text).toBe("Foo");

		const result2 = await database
			.select({
				notlikee: notLike(table.text, "%ar"),
			})
			.from(table);

		expect(result2[0].notlikee).toBe(true);

		await database.execute(sql`
			drop table notlikee;
		`);
	});

	test("ilike", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "ilikee.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("ilikee", {
				text: defineText("text").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists ilikee (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Foo",
			})
			.returning();

		expect(result1[0].text).toBe("Foo");

		const result2 = await database
			.select({
				ilikee: ilike(table.text, "%oo"),
			})
			.from(table);

		expect(result2[0].ilikee).toBe(true);

		await database.execute(sql`
			drop table ilikee;
		`);
	});

	test("notIlike", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "notilikee.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("notilikee", {
				text: defineText("text").notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists notilikee (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "Foo",
			})
			.returning();

		expect(result1[0].text).toBe("Foo");

		const result2 = await database
			.select({
				notilikee: notIlike(table.text, "%ar"),
			})
			.from(table);

		expect(result2[0].notilikee).toBe(true);

		await database.execute(sql`
			drop table notilikee;
		`);
	});
});
