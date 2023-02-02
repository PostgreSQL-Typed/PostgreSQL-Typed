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
    CREATE TABLE public.JestFetch (
      id varchar(1),
      integer integer NULL,
      CONSTRAINT JestFetch_pk PRIMARY KEY (id)
    )
  `);

	await sql.query(`
		INSERT INTO public.JestFetch (id, integer)
		VALUES
			(1, 1),
			(2, 2),
			(3, 3),
			(4, NULL),
			(5, NULL)
	`);

	cacheClass = new TestClass(sql, "public", "JestFetch", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestFetch");
	await sql.end();
});

afterEach(async () => {
	await cacheClass.clear();
});
//#endregion

describe("Select queries with $FETCH", () => {
	it("should fetch first x rows only", async () => {
		const result = await cacheClass.select("*", {
			$FETCH: 3,
		});

		expect(result.rows).toEqual([data[0], data[1], data[2]]);
	});

	it("should fetch first x rows only with x offset", async () => {
		const result = await cacheClass.select("*", {
			$FETCH: [2, 3],
		});

		expect(result.rows).toEqual([data[3], data[4]]);
	});
});
