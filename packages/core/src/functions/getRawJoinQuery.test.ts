import { describe, expect, test } from "vitest";

import { Client } from "../classes/Client";
import { TestData, testData } from "../classes/testData";
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
			query: "CROSS JOIN schema1.table2",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "NATURAL JOIN schema1.table2",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "NATURAL INNER JOIN schema1.table2",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "NATURAL LEFT JOIN schema1.table2",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "NATURAL RIGHT JOIN schema1.table2",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "INNER JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "INNER JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "LEFT JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "RIGHT JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "FULL JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
			variables: [],
			tableLocation: "schema1.table2",
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
			query: "FULL OUTER JOIN schema1.table2 %schema1.table2%\nON schema1.table2.id = schema1.table1.id",
			variables: [],
			tableLocation: "schema1.table2",
		});
	});

	test("other", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(() =>
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
		).toThrowError();
	});
});
