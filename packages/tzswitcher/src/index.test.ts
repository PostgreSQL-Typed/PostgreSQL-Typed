import { Client, isReady } from "@postgresql-typed/postgres";
import { describe, expect, it } from "vitest";

import { createTable, dropTable, insertQuery, insertQueryValues, selectQuery, selectQueryValues, valuesInSeoul } from "./__mocks__/testData";
import { TestData, testData } from "./__mocks__/types";

describe("TzSwitcher", () => {
	it("should switch timezone from one to another", async () => {
		const client = await new Client<TestData>(testData, {
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
		}).testConnection();

		if (!isReady(client)) expect.fail();

		let error: Error | undefined;
		try {
			await client.query(createTable, []);

			await client.client.unsafe(insertQuery, insertQueryValues);

			const response = await client.query<TestData["db1"]["schemas"]["schema1"]["tables"]["table1"]["columns"]>(selectQuery, selectQueryValues);

			expect(response.rowCount).toBe(1);
			const row = response.rows[0];

			expect(row.time.equals(valuesInSeoul.time)).toBe(true);
			expect(row._time).toHaveLength(2);
			expect(row._time[0].equals(valuesInSeoul._time[0])).toBe(true);
			expect(row._time[1].equals(valuesInSeoul._time[1])).toBe(true);

			expect(row.timestamp.equals(valuesInSeoul.timestamp)).toBe(true);
			expect(row._timestamp).toHaveLength(2);
			expect(row._timestamp[0].equals(valuesInSeoul._timestamp[0])).toBe(true);
			expect(row._timestamp[1].equals(valuesInSeoul._timestamp[1])).toBe(true);

			expect(row.timestamptz.equals(valuesInSeoul.timestamptz)).toBe(true);
			expect(row._timestamptz).toHaveLength(2);
			expect(row._timestamptz[0].equals(valuesInSeoul._timestamptz[0])).toBe(true);
			expect(row._timestamptz[1].equals(valuesInSeoul._timestamptz[1])).toBe(true);

			expect(row.timetz.equals(valuesInSeoul.timetz)).toBe(true);
			expect(row._timetz).toHaveLength(2);
			expect(row._timetz[0].equals(valuesInSeoul._timetz[0])).toBe(true);
			expect(row._timetz[1].equals(valuesInSeoul._timetz[1])).toBe(true);
		} catch (error_) {
			error = error_;

			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(dropTable, []);

		if (error) throw error;
	});
});
