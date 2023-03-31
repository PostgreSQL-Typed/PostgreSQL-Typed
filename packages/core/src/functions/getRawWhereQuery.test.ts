import { UUID } from "@postgresql-typed/parsers";
import { describe, expect, test } from "vitest";

import { Client } from "../classes/Client";
import { TestData, testData } from "../classes/testData";
import { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards";
import { getRawWhereQuery } from "./getRawWhereQuery";

describe("getRawWhereQuery", () => {
	test("table1 = table2", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawWhereQuery<TestData, TestData["db1"], false, typeof table1 | typeof table2, TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table2.id": "schema1.table1.id",
			})
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
			getRawWhereQuery<TestData, TestData["db1"], false, typeof table1 | typeof table2, TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table2.id": {
					$EQUAL: uuid,
				},
			})
		).toEqual({
			query: "schema1.table2.id = %?%",
			variables: [uuid],
		});
	});

	test("RootFilterOperator", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			uuid = UUID.generate();

		expect(
			getRawWhereQuery<TestData, TestData["db1"], false, typeof table1 | typeof table2, TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
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
			})
		).toEqual({
			query: "\n  (\n    schema1.table2.id = %?%\n    AND schema1.table2.id = schema1.table1.id\n  )",
			variables: [uuid],
		});
	});

	test("depth", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			uuid = UUID.generate();

		expect(() =>
			getRawWhereQuery<TestData, TestData["db1"], false, typeof table1 | typeof table2, TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
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
				9
			)
		).toThrowError();
	});

	test("keys", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(() =>
			getRawWhereQuery<TestData, TestData["db1"], false, typeof table1 | typeof table2, TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table2.id": "schema1.table1.id",
				$AND: [
					{
						"schema1.table2.id": "schema1.table1.id",
					},
					{
						"schema1.table2.id": "schema1.table1.id",
					},
				],
			})
		).toThrowError();

		expect(() =>
			getRawWhereQuery<TestData, TestData["db1"], false, typeof table1 | typeof table2, TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				$AND: undefined,
			})
		).toThrowError();
	});
});
