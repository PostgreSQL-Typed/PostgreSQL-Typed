/* eslint-disable unicorn/filename-case, unicorn/no-null */
import { Client } from "pg";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import PostgreSQLCaching from "../src";

//#region Setup Client, TestData, and TestClass
interface TestData {
	id: string;
	integer: number | null;
}

class TestClass extends PostgreSQLCaching<TestData> {}

let sql: Client, cacheClass: TestClass;
const data: TestData[] = [
	{ id: "1", integer: 1 },
	{ id: "2", integer: 2 },
	{ id: "3", integer: 3 },
	{ id: "4", integer: null },
	{ id: "5", integer: null },
];

beforeAll(async () => {
	sql = new Client({
		password: "password",
		host: "localhost",
		user: "postgres",
		database: "postgres",
		port: 5432,
	});

	await sql.connect();

	await sql.query(`
    CREATE TABLE public.JestSorting (
      id varchar(1),
      integer integer NULL,
      CONSTRAINT JestSorting_pk PRIMARY KEY (id)
    )
  `);

	await sql.query(`
		INSERT INTO public.JestSorting (id, integer)
		VALUES
			(1, 1),
			(2, 2),
			(3, 3),
			(4, NULL),
			(5, NULL)
	`);

	cacheClass = new TestClass(sql, "public", "JestSorting", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestSorting");
	await sql.end();
});

afterEach(async () => {
	await cacheClass.clear();
});
//#endregion

describe("Select queries with $ORDER_BY", () => {
	it("should order by ASC", async () => {
		const result1 = await cacheClass.select("*", {
			$ORDER_BY: ["integer"],
		});

		expect(result1.rows).toEqual([data[0], data[1], data[2], data[3], data[4]]);

		const result2 = await cacheClass.select("*", {
			$ORDER_BY: ["integer", "ASC"],
		});

		expect(result2.rows).toEqual([data[0], data[1], data[2], data[3], data[4]]);
	});

	it("should order by DESC", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", "DESC"],
		});

		expect(result.rows).toEqual([data[3], data[4], data[2], data[1], data[0]]);
	});

	it("should order by NULLS FIRST", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", "NULLS FIRST"],
		});

		expect(result.rows).toEqual([data[3], data[4], data[0], data[1], data[2]]);
	});

	it("should order by NULLS LAST", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", "NULLS LAST"],
		});

		expect(result.rows).toEqual([data[0], data[1], data[2], data[3], data[4]]);
	});

	it("should order by ASC and NULLS FIRST", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", ["ASC", "NULLS FIRST"]],
		});

		expect(result.rows).toEqual([data[3], data[4], data[0], data[1], data[2]]);
	});

	it("should order by ASC and NULLS LAST", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", ["ASC", "NULLS LAST"]],
		});

		expect(result.rows).toEqual([data[0], data[1], data[2], data[3], data[4]]);
	});

	it("should order by DESC and NULLS FIRST", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", ["DESC", "NULLS FIRST"]],
		});

		expect(result.rows).toEqual([data[3], data[4], data[2], data[1], data[0]]);
	});

	it("should order by DESC and NULLS LAST", async () => {
		const result = await cacheClass.select("*", {
			$ORDER_BY: ["integer", ["DESC", "NULLS LAST"]],
		});

		expect(result.rows).toEqual([data[2], data[1], data[0], data[3], data[4]]);
	});
});
