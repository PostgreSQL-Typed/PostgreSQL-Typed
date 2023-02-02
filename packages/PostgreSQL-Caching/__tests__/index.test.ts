import { Client } from "pg";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import PostgreSQLCaching from "../src";
import { TestData } from "./utils/data";

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

	cacheClass = new TestClass(sql, "public", "JestSelectAll", "id");
});

afterAll(async () => {
	await sql.end();
});

afterEach(async () => {
	await cacheClass.clear();
});

class TestClass extends PostgreSQLCaching<TestData> {}
//#endregion

describe("Non grouped tests", () => {
	it("should have no context", () => {
		expect(cacheClass.context).toBeUndefined();
	});

	it("should set the context", () => {
		const context = { test: true };

		cacheClass.setContext(context);

		expect(cacheClass.context).toEqual(context);
	});
});
