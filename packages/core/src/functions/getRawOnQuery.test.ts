import { UUID } from "@postgresql-typed/parsers";
import { describe, expect, test } from "vitest";

import { Client } from "../classes/Client";
import { TestData, testData } from "../classes/testData";
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
			query: "schema1.table2.id = schema1.table1.id",
			variables: [],
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

				return {
					query: result.query,
					variables: result.variables.map(variable => {
						if (typeof variable === "string") return variable;
						return variable.value;
					}),
				};
			})()
		).toEqual({
			query: "schema1.table2.id = %?%",
			variables: [uuid.value],
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

				return {
					query: result.query,
					variables: result.variables.map(variable => {
						if (typeof variable === "string") return variable;
						return variable.value;
					}),
				};
			})()
		).toEqual({
			query: "\n  (\n    schema1.table2.id = %?%\n    AND schema1.table2.id = schema1.table1.id\n  )",
			variables: [uuid.value],
		});
	});

	test("depth", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			uuid = UUID.generate();

		expect(() =>
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
		).toThrowError();
	});

	test("keys", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(() =>
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
		).toThrowError();

		expect(() =>
			getRawOnQuery<TestData, TestData["db1"], false, typeof table1, typeof table2>(
				{
					$AND: undefined,
				},
				table2,
				[table1]
			)
		).toThrowError();
	});
});
