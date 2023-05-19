import { Client, isReady } from "@postgresql-typed/postgres";
import { describe, expect, it, vitest } from "vitest";

import { createTable, dropTable, insertQuery, insertQueryValues, selectQuery, selectQueryValues } from "./__mocks__/testData";
import { TestData, testData } from "./__mocks__/types";

const spiedOn = {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useless: () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useless2: () => {},
};

describe("Cache", () => {
	it("should cache the response on a second query", async () => {
		const spy = vitest.spyOn(spiedOn, "useless"),
			spy2 = vitest.spyOn(spiedOn, "useless2"),
			client = await new Client<TestData>(testData, {
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
			}).testConnection();

		client.hook("client:post-query", spiedOn.useless);
		client.hook("client:pre-query-override", spiedOn.useless2);

		if (!isReady(client)) expect.fail();

		let error: Error | undefined;
		try {
			const version = await client.query<{
					version: string;
				}>("SELECT version()"),
				versionNumber = Number(version.rows[0].version.split(" ")[1].split(".")[0]),
				queries = {
					createTable,
					insertQuery,
					insertQueryValues,
				};
			// Multirange types were introduced in PostgreSQL 14
			if (versionNumber < 14) {
				queries.createTable = createTable
					.split("\n")
					.filter(line => !line.includes("multi"))
					.join("\n")
					.replace(/,\n\)/, "\n)");
				queries.insertQuery = insertQuery
					.split("\n")
					.filter(line => !line.includes("multi"))
					.filter(line => {
						if (/^\$\d+$/.test(line)) {
							const index = Number(line.slice(1));
							if (index > 66) return false;
						}
						return true;
					})
					.join("\n")
					.replace(/,\n\)/, "\n)");
				queries.insertQueryValues = insertQueryValues.slice(0, -10);
			}

			await client.query(queries.createTable, []);

			await client.query(queries.insertQuery, queries.insertQueryValues);

			expect(spy).toHaveBeenCalledTimes(2);
			expect(spy2).toHaveBeenCalledTimes(0);

			spy.mockClear();
			spy2.mockClear();

			const response = await client.query(selectQuery, selectQueryValues);

			expect(response.rowCount).toBe(1);

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(0);

			spy.mockClear();
			spy2.mockClear();

			const response2 = await client.query(selectQuery, selectQueryValues);

			expect(response2.rowCount).toBe(1);

			expect(spy).toHaveBeenCalledTimes(0);
			expect(spy2).toHaveBeenCalledTimes(1);
		} catch (error_) {
			error = error_;

			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(dropTable, []);

		if (error) throw error;
	});
});
