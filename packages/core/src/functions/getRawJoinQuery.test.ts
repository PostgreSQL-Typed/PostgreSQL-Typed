import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client";
import { type TestData, testData } from "../classes/testData";
import { getRawJoinQuery } from "./getRawJoinQuery";

describe("getRawJoinQuery", () => {
	test("CROSS", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "CROSS",
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "CROSS JOIN schema1.table2",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("NATURAL", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "NATURAL",
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "NATURAL JOIN schema1.table2",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("NATURAL INNER", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "NATURAL INNER",
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "NATURAL INNER JOIN schema1.table2",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("NATURAL LEFT", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "NATURAL LEFT",
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "NATURAL LEFT JOIN schema1.table2",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("NATURAL RIGHT", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "NATURAL RIGHT",
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "NATURAL RIGHT JOIN schema1.table2",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("INNER", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "INNER",
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "INNER JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "INNER JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("LEFT", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "LEFT",
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "LEFT JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("RIGHT", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "RIGHT",
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "RIGHT JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("FULL", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "FULL",
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "FULL JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("FULL OUTER", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "FULL OUTER",
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "FULL OUTER JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
				variables: [],
				tableLocation: "schema1.table2",
			},
		});
	});

	test("other", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$TYPE: "other",
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				} as any,
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error(
				"Expected 'CROSS' | 'NATURAL' | 'NATURAL INNER' | 'NATURAL LEFT' | 'NATURAL RIGHT' | 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'FULL OUTER' as a join type, received 'other'"
			),
		});
	});

	test("invalid input", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(true as any, table2, [table1])).toEqual({
			success: false,
			error: new Error("Expected 'object', received 'boolean'"),
		});

		expect(getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>({} as any, table2, [table1])).toEqual({
			success: false,
			error: new Error("Missing key in object: '$ON'"),
		});

		expect(getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>({ $ON: {}, b: true } as any, table2, [table1])).toEqual({
			success: false,
			error: new Error("Unrecognized key in object: 'b'"),
		});

		expect(getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>({ $ON: true } as any, table2, [table1])).toEqual({
			success: false,
			error: new Error("Expected 'object' for key '$ON', received 'boolean'"),
		});

		expect(getRawJoinQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>({ $ON: {} } as any, table2, [table1])).toEqual({
			success: false,
			error: new Error("Object must have exactly 1 key(s)"),
		});
	});
});
