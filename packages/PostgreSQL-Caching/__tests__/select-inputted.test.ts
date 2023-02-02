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

	await createTable(sql, "JestSelectInputted");

	cacheClass = new TestClass(sql, "public", "JestSelectInputted", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestSelectInputted");
	await sql.end();
});

afterEach(async () => {
	await sql.query("DELETE FROM public.JestSelectInputted");
	await cacheClass.clear();
});

class TestClass extends PostgreSQLCaching<TestData> {}
//#endregion

describe.skip("Select inputted queries", () => {
	it("should select inputted columns", async () => {
		const dbQuerySpy = vitest.spyOn(sql, "query");

		await insertData(cacheClass);
		expect(dbQuerySpy).toHaveBeenCalledTimes(1);

		const result = await cacheClass.select(["bigint", "bool"]);

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([
			{
				bigint: insertedData.bigint,
				bool: insertedData.bool,
			},
		]);
		expect(dbQuerySpy).toHaveBeenCalledTimes(2);
		dbQuerySpy.mockRestore();
	});

	it("should select inputted columns with where", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				bool: false,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([
			{
				bigint: extraData.bigint,
				bool: extraData.bool,
			},
		]);
	});

	it("should select inputted columns with where and order by", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
		});

		expect(result1.rowCount).toEqual(2);
		expect(result1.rows).toEqual([
			{
				bigint: extraData.bigint,
				bool: extraData.bool,
			},
			{
				bigint: insertedData.bigint,
				bool: insertedData.bool,
			},
		]);

		const result2 = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8", "DESC"],
		});

		expect(result2.rowCount).toEqual(2);
		expect(result2.rows).toEqual([
			{
				bigint: insertedData.bigint,
				bool: insertedData.bool,
			},
			{
				bigint: extraData.bigint,
				bool: extraData.bool,
			},
		]);
	});

	it("should select inputted columns with where, order by and limit", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$LIMIT: 1,
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([
			{
				bigint: extraData.bigint,
				bool: extraData.bool,
			},
		]);
	});

	it("should select inputted columns with where, order by, limit and offset", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$LIMIT: [1, 1],
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([
			{
				bigint: insertedData.bigint,
				bool: insertedData.bool,
			},
		]);
	});

	it("should select inputted columns with where, order by and fetch", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$FETCH: 1,
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([
			{
				bigint: extraData.bigint,
				bool: extraData.bool,
			},
		]);
	});

	it("should select inputted columns with where, order by, fetch and offset", async () => {
		await insertData(cacheClass);
		await insertExtraData(cacheClass);

		const result1 = await cacheClass.select(["bigint", "bool"], {
			$WHERE: {
				text: { $LIKE: "Te%" },
			},
			$ORDER_BY: ["float8"],
			$FETCH: [1, 1],
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([
			{
				bigint: insertedData.bigint,
				bool: insertedData.bool,
			},
		]);
	});
});
