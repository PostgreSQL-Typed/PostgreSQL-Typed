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

	await createTable(sql, "JestCaching");

	cacheClass = new TestClass(sql, "public", "JestCaching", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestCaching");
	await sql.end();
});

afterEach(async () => {
	await sql.query("DELETE FROM public.JestCaching");
	await cacheClass.clear();
});

class TestClass extends PostgreSQLCaching<TestData> {}
//#endregion

describe.todo("Caching", () => {
	it("should cache select query, and after clearing request again", async () => {
		const databaseQuerySpy = vitest.spyOn(sql, "query"),
			result1 = await cacheClass.select("*");

		expect(result1.rowCount).toEqual(0);
		expect(result1.rows).toEqual([]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(1);

		await insertData(cacheClass);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(2);

		const result2 = await cacheClass.select("*");

		expect(result2.rowCount).toEqual(0);
		expect(result2.rows).toEqual([]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(2);

		await cacheClass.clear();

		const result3 = await cacheClass.select("*");

		expect(result3.rowCount).toEqual(1);
		expect(result3.rows).toEqual([insertedData]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(3);
		databaseQuerySpy.mockRestore();
	});

	it("should remove all cached objects with given primary key", async () => {
		const databaseQuerySpy = vitest.spyOn(sql, "query");
		await insertData(cacheClass);
		await insertExtraData(cacheClass);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(2);

		const result1 = await cacheClass.select("*");

		expect(result1.rowCount).toEqual(2);
		expect(result1.rows).toEqual([insertedData, extraData]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(3);

		const result2 = await cacheClass.select("*", {
			$WHERE: {
				id: extraData.id,
			},
		});

		expect(result2.rowCount).toEqual(1);
		expect(result2.rows).toEqual([extraData]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(4);

		await cacheClass.clearValuesWithPk(insertedData.id);

		const result3 = await cacheClass.select("*", {
			$WHERE: {
				id: extraData.id,
			},
		});

		expect(result3.rowCount).toEqual(1);
		expect(result3.rows).toEqual([extraData]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(4);

		const result4 = await cacheClass.select("*");

		expect(result4.rowCount).toEqual(2);
		expect(result4.rows).toEqual([insertedData, extraData]);
		expect(databaseQuerySpy).toHaveBeenCalledTimes(5);

		databaseQuerySpy.mockRestore();
	});
});
