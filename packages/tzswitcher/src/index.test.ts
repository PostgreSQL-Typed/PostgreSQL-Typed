import { Client, pgt } from "@postgresql-typed/core";
import { eq } from "@postgresql-typed/core/operators";
import { Timestamp } from "@postgresql-typed/parsers";
import { describe, expect, it } from "vitest";

import { createTable, dropTable, insertQuery, insertQueryValues, TzSwitcherTable, valuesInSeoul } from "./__mocks__/testData";

describe("TzSwitcher", () => {
	it("should switch timezone from one to another", async () => {
		const client = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
			}),
			database = pgt(client);

		await database.connect();

		let error: Error | undefined;
		try {
			await client.query(createTable, []);

			await client.query(insertQuery, insertQueryValues);

			const response = await database
				.select()
				.from(TzSwitcherTable)
				.where(eq(TzSwitcherTable.timestamp, Timestamp.from("2021-01-01 21:34:56")))
				.execute();

			expect(response).toHaveLength(1);
			const row = response[0];

			expect(row.time.equals(valuesInSeoul.time)).toBe(true);
			expect(row._time).toHaveLength(2);
			expect(row._time[0].equals(valuesInSeoul._time[0])).toBe(true);
			expect(row._time[1].equals(valuesInSeoul._time[1])).toBe(true);

			console.log("foo");
			expect(row.timestamp.equals(valuesInSeoul.timestamp)).toBe(true);
			expect(row._timestamp).toHaveLength(2);
			expect(row._timestamp[0].equals(valuesInSeoul._timestamp[0])).toBe(true);
			expect(row._timestamp[1].equals(valuesInSeoul._timestamp[1])).toBe(true);

			console.log("bar");
			console.log(row.timestamptz.safeEquals(valuesInSeoul.timestamptz), row.timestamptz, valuesInSeoul.timestamptz);
			expect(row.timestamptz.equals(valuesInSeoul.timestamptz)).toBe(true);
			expect(row._timestamptz).toHaveLength(2);
			expect(row._timestamptz[0].equals(valuesInSeoul._timestamptz[0])).toBe(true);
			expect(row._timestamptz[1].equals(valuesInSeoul._timestamptz[1])).toBe(true);

			console.log("baz");
			expect(row.timetz.equals(valuesInSeoul.timetz)).toBe(true);
			expect(row._timetz).toHaveLength(2);
			expect(row._timetz[0].equals(valuesInSeoul._timetz[0])).toBe(true);
			expect(row._timetz[1].equals(valuesInSeoul._timetz[1])).toBe(true);

			console.log("qux");
			expect(row.not_a_time.equals(valuesInSeoul.not_a_time)).toBe(true);
			expect(row.nullable_time).toBeNull();
		} catch (error_) {
			error = error_;

			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(dropTable, []);

		if (error) throw error;
	});
});
