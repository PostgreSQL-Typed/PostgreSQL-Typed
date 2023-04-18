import { UUID } from "@postgresql-typed/parsers";
import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client";
import { type TestData, testData } from "../__mocks__/testData";
import { getRawOnQuery } from "./getRawOnQuery";

describe("getRawOnQuery", () => {
	test("table1 = table2", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					"schema1.table2.id": "schema1.table1.id",
				},
				table2,
				[table1]
			)
		).toEqual({
			success: true,
			data: {
				query: "schema1.table2.id = schema1.table1.id",
				variables: [],
			},
		});
	});

	test("FilterOperator", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			uuid = UUID.generate();

		expect(
			(() => {
				const result = getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
					{
						"schema1.table2.id": {
							$EQUAL: uuid,
						},
					},
					table2,
					[table1]
				);

				if (result.success) {
					result.data.variables = result.data.variables.map(variable => {
						if (typeof variable === "string") return variable;
						return variable.value;
					}) as any;
				}

				return result;
			})()
		).toEqual({
			success: true,
			data: {
				query: "schema1.table2.id = %?%",
				variables: [uuid.value],
			},
		});
	});

	test("RootFilterOperator", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			uuid = UUID.generate();

		expect(
			(() => {
				const result = getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
					{
						$AND: [
							{
								"schema1.table2.id": {
									$EQUAL: uuid,
								},
							},
							{
								"schema1.table2.id": "schema1.table1.id",
							},
						],
					},
					table2,
					[table1]
				);

				if (result.success) {
					result.data.variables = result.data.variables.map(variable => {
						if (typeof variable === "string") return variable;
						return variable.value;
					}) as any;
				}

				return result;
			})()
		).toEqual({
			success: true,
			data: {
				query: "\n  (\n    schema1.table2.id = %?%\n    AND schema1.table2.id = schema1.table1.id\n  )",
				variables: [uuid.value],
			},
		});
	});

	test("depth", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			uuid = UUID.generate();

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$AND: [
						{
							"schema1.table2.id": {
								$EQUAL: uuid,
							},
						},
						{
							$OR: [
								{
									"schema1.table2.id": "schema1.table1.id",
								},
								{
									"schema1.table2.id": {
										$LIKE: "test",
									},
								},
							],
						},
					],
				},
				table2,
				[table1],
				9
			)
		).toEqual({
			success: false,
			error: new Error("Object must have a depth of at most 10"),
		});
	});

	test("keys", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					"schema1.table2.id": "schema1.table1.id",
					$AND: [
						{
							"schema1.table2.id": "schema1.table1.id",
						},
						{
							"schema1.table2.id": "schema1.table1.id",
						},
					],
				},
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Object must have exactly 1 key(s)"),
		});

		expect(getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>({} as any, table2, [table1])).toEqual({
			success: false,
			error: new Error("Object must have exactly 1 key(s)"),
		});

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$AND: undefined,
				},
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Expected 'array', received 'undefined'"),
		});

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					"schema1.table2.id": true as any,
				},
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Expected 'object' | 'string' | 'undefined' for key 'schema1.table2.id', received 'boolean'"),
		});

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					any: "any",
				} as any,
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Unrecognized key in object: 'any'"),
		});

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					"schema1.table2.id": undefined,
				},
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Expected 'object' | 'string', received 'undefined'"),
		});

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					"schema1.table2.id": "abc" as any,
				},
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Expected 'schema1.table1.id', received 'abc'"),
		});

		expect(
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					"schema1.table2.id": {
						$EQUAL: 1 as any,
					},
				},
				table2,
				[table1]
			)
		).toEqual({
			success: false,
			error: new Error("Expected 'string' | 'object', received 'number'"),
		});
	});
});
