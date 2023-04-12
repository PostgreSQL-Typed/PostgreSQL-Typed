import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client";
import { type TestData, testData } from "../classes/testData";
import type { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards";
import { getRawSelectQuery } from "./getRawSelectQuery";

describe("getRawSelectQuery", () => {
	test("*", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("*")).toBe("*");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"*": true,
			})
		).toBe("*");
	});

	test("COUNT(*)", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("COUNT(*)")).toBe("COUNT(*)");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"COUNT(*)": true,
			})
		).toBe("COUNT(*)");
	});

	test("string | string[]", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("schema1.table1.id")).toBe("schema1.table1.id");
		expect(getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(["schema1.table1.id", "schema1.table2.id"])).toBe(
			"schema1.table1.id,\nschema1.table2.id"
		);
	});

	test("object", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({ "schema1.table1.id": true })).toBe("schema1.table1.id");
		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": true,
				"schema1.table2.id": true,
			})
		).toBe("schema1.table1.id,\nschema1.table2.id");
	});

	test("alias", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": {
					alias: "identifier",
				},
			})
		).toBe("schema1.table1.id AS identifier");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": {
					alias: "identifier",
				},
				"schema1.table2.id": {
					alias: "identifier2",
				},
			})
		).toBe("schema1.table1.id AS identifier,\nschema1.table2.id AS identifier2");
	});

	test("distinct", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": {
					distinct: true,
				},
			})
		).toBe("DISTINCT schema1.table1.id");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": {
					distinct: true,
				},
				"schema1.table2.id": {
					distinct: "ON",
				},
			})
		).toBe("DISTINCT schema1.table1.id,\nDISTINCT ON (schema1.table2.id) schema1.table2.id");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": {
					distinct: true,
					alias: "identifier",
				},
				"schema1.table2.id": {
					distinct: "ON",
					alias: "identifier2",
				},
			})
		).toBe("DISTINCT schema1.table1.id AS identifier,\nDISTINCT ON (schema1.table2.id) identifier2");

		expect(
			getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({
				"schema1.table1.id": undefined,
			})
		).toBe("schema1.table1.id");
	});
});
