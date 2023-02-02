import { Client } from "pg";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import PostgreSQLCaching from "../src";
import { insertedData, nullData, TestData } from "./utils/data";
import { createTable, insertData, insertNullData } from "./utils/functions";

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

	await createTable(sql, "JestOperators");

	cacheClass = new TestClass(sql, "public", "JestOperators", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestOperators");
	await sql.end();
});

afterEach(async () => {
	await sql.query("DELETE FROM public.JestOperators");
	await cacheClass.clear();
});

class TestClass extends PostgreSQLCaching<TestData> {}
//#endregion

describe.skip("Filter Operators", () => {
	it("should filter using equals", async () => {
		await insertData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				text: "Text",
			},
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([insertedData]);

		const resul2 = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$EQUAL: "Text",
				},
			},
		});

		expect(resul2.rowCount).toEqual(1);
		expect(resul2.rows).toEqual([insertedData]);
	});

	it("should filter using not equals", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$NOT_EQUAL: "TText",
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using less than", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$LESS_THAN: 9000,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using less than or equal to", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$LESS_THAN_OR_EQUAL: 6666,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using greater than", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$GREATER_THAN: 5000,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using greater than or equal to", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$GREATER_THAN_OR_EQUAL: 6666,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using like", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$LIKE: "Te%",
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using not like", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$NOT_LIKE: "TTe%",
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using ilike", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$ILIKE: "tE%",
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using not ilike", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$NOT_ILIKE: "TtE%",
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using in", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$IN: ["Text", "Text2"],
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using not in", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: {
					$NOT_IN: ["Text2", "Text3"],
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using between", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$BETWEEN: [6000, 7000],
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using not between", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$NOT_BETWEEN: [7000, 8000],
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using is null", async () => {
		await insertData(cacheClass);
		await insertNullData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$IS_NULL: true,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([nullData]);
	});

	it("should filter using is not null", async () => {
		await insertData(cacheClass);
		await insertNullData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: {
					$IS_NOT_NULL: true,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});
});

describe.skip("Root Filter Operators", () => {
	it("should filter using and", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				$AND: [
					{
						int: {
							$EQUAL: 6666,
						},
					},
					{
						text: {
							$LIKE: "Te%",
						},
					},
				],
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("should filter using or", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				$OR: [
					{
						int: {
							$EQUAL: 6667,
						},
					},
					{
						text: {
							$LIKE: "Te%",
						},
					},
				],
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});
});
