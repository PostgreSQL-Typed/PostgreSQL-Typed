/* eslint-disable unicorn/filename-case */
import { Client } from "pg";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import PostgreSQLCaching from "../src";
import { insertedData, TestData } from "./utils/data";
import { createTable, insertData } from "./utils/functions";

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

	await createTable(sql, "JestDataTypes");

	cacheClass = new TestClass(sql, "public", "JestDataTypes", "id");
});

afterAll(async () => {
	await sql.query("DROP TABLE public.JestDataTypes");
	await sql.end();
});

afterEach(async () => {
	await sql.query("DELETE FROM public.JestDataTypes");
	await cacheClass.clear();
});

class TestClass extends PostgreSQLCaching<TestData> {}
//#endregion

describe.skip("Data Types", () => {
	it("bigint", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bigint: BigInt(9_007_199_254_740_991).toString(),
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("bigserial", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bigserial: "9223372036854775807",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("bit", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bit: "101",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("bit varying", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bitvarying: "10",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("bool", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bool: true,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("boolean", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				boolean: false,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("box", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				box: "(1,1),(1,1)",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("bpchar", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bpchar: "Text",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("bytea", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				bytea: Buffer.from("abc \u00DEADBEEF"),
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("cardinal_number", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				cardinalnumber: 1,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("char", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				char: "A",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("char varying", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				charvarying: "D",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("character", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				character: "B",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("character varying", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				charactervarying: "C",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("character_data", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				characterdata: "E",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("cid", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				cid: "123",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("cidr", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				cidr: "192.168.100.128/25",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("circle", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				circle: {
					x: 1,
					y: 1,
					radius: 1,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("date", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				date: "1997-08-24",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("datemultirange", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				datemultirange: "{[2021-05-01, 2021-06-01), [2020-09-01, 2020-10-01), [2021-09-01, 2021-09-13)}",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("daterange", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				daterange: "[2020-09-01,2020-10-01)",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("decimal", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				decimal: "9999",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("float4", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				float4: 8888,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("float8", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				float8: 7777,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("inet", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				inet: "192.168.100.128",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int: 6666,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int2", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int2: 5555,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int4", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int4: 4444,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int4multirange", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int4multirange: "{[1,3),[8,11),[5,7)}",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int4range", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int4range: "[1,3)",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int8", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int8: "3333",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int8multirange", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int8multirange: "{[101,103),[108,111),[105,107)}",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("int8range", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				int8range: "[101,103)",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("integer", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				integer: 2222,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("interval", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				interval: {
					hours: 1,
					minutes: 2,
					seconds: 3,
					milliseconds: 456,
				},
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("jsonb", async () => {
		await insertData(cacheClass);

		const result1 = await cacheClass.select("*", {
			$WHERE: {
				jsonb: { items: { qty: 6, product: "Beer" }, customer: "John Doe" },
			},
		});

		expect(result1.rowCount).toEqual(1);
		expect(result1.rows).toEqual([insertedData]);

		const result2 = await cacheClass.select("*", {
			$WHERE: {
				"jsonb.customer": "John Doe",
			},
		});

		expect(result2.rowCount).toEqual(1);
		expect(result2.rows).toEqual([insertedData]);

		const result3 = await cacheClass.select("*", {
			$WHERE: {
				"jsonb.items.product": "Beer",
				//! qty is casted to integer
				"jsonb.items.qty": 6,
			},
		});

		expect(result3.rowCount).toEqual(1);
		expect(result3.rows).toEqual([insertedData]);
	});

	it("money", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				money: "$1,111.00",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("name", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				name: "Jest",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("numeric", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				numeric: "1",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("smallint", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				smallint: 2,
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("text", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				text: "Text",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("time", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				time: "11:11:11",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("time with time zone", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timewithtimezone: "11:11:11+11:11",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("time without time zone", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timewithouttimezone: "11:11:11",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("timestamp", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timestamp: "1999-01-08 04:05:06",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("timestamp with time zone", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timestampwithtimezone: "1999-01-08 04:05:06+02",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("timestamp without time zone", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timestampwithouttimezone: "1999-01-08 04:05:06",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("timestamptz", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timestamptz: "1999-01-08 04:05:06+02",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("timetz", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				timetz: "11:11:11+11:11",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("uuid", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				uuid: "d006750c-e3ec-49b2-9f7e-ab81e10b4993",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});

	it("varchar", async () => {
		await insertData(cacheClass);

		const result = await cacheClass.select("*", {
			$WHERE: {
				varchar: "Hello",
			},
		});

		expect(result.rowCount).toEqual(1);
		expect(result.rows).toEqual([insertedData]);
	});
});
