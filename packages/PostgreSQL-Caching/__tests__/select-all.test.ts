import { Client } from "pg";
import { afterAll, afterEach, beforeAll, describe, expect, it, vitest } from "vitest";

import PostgreSQLCaching from "../src";
import { extraData, insertedData, TestData } from "./utils/data";
import { createTable, insertData, insertExtraData } from "./utils/functions";

//#region Setup Client, and TestClass
let sql: Client, cacheClass: TestClass;

beforeAll(async () => {
	sql = new Client({
		password: "password",
		host: "localhost",
		user: "postgres",
		database: "postgres",
		port: 5432,
	});

	await sql.connect();

	await createTable(sql, "JestSelectAll");

	cacheClass = new TestClass(sql, "public", "JestSelectAll", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestSelectAll");
	await sql.end();
});

afterEach(async () => {
	await sql.query("DELETE FROM public.JestSelectAll");
	await cacheClass.clear();
});

class TestClass extends PostgreSQLCaching<TestData> {}
//#endregion

describe.skip("Select all (*) queries", () => {
	it("should select all columns", async () => {
		const dbQuerySpy = vitest.spyOn(sql, "query");

		await insertData(cacheClass);
		expect(dbQuerySpy).toHaveBeenCalledTimes(1);

		const result = await cacheClass.select("*");

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
		expect(dbQuerySpy).toHaveBeenCalledTimes(2);
		dbQuerySpy.mockRestore();
	});

	it("should select all columns with where", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bool: false,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([extraData]);
	});

	it("should select all columns with where and order by", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
		});

		expect(result1.rowCount).toEqual(2);
		expect(result1.rows).toEqual([extraData, insertedData]);

		const result2 = await cacheClass.select("*", {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8", "DESC"],
		});

		expect(result2.rowCount).toEqual(2);
		expect(result2.rows).toEqual([insertedData, extraData]);
	});

	it("should select all columns with where, order by and limit", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$LIMIT: 1,
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([extraData]);
	});

	it("should select all columns with where, order by, limit and offset", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$LIMIT: [1, 1],
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([insertedData]);
	});

	it("should select all columns with where, order by and fetch", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$FETCH: 1,
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([extraData]);
	});

	it("should select all columns with where, order by, fetch and offset", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$FETCH: [1, 1],
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([insertedData]);
	});
});
