import { Client, pgt } from "@postgresql-typed/core";
import { PgTExtensionContext, PostQueryHookData } from "@postgresql-typed/util";
import { describe, expect, it, vitest } from "vitest";

import { createTable, dropTable, insertQuery, TestTable } from "./__mocks__/testData";
import type { PgTCacheContext } from "./index.js";

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
			client = new Client({
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(client);

		await database.connect();

		database.extensions.hook("pgt:post-query", spiedOn.useless);
		database.extensions.hook("pgt:pre-query-override", spiedOn.useless2);

		let error: Error | undefined;
		try {
			await client.query(createTable, []);

			await database.insert(TestTable).values(insertQuery).execute({}, {});

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(0);

			spy.mockClear();
			spy2.mockClear();

			const response = await database.select().from(TestTable);

			expect(response).toHaveLength(1);

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(0);

			spy.mockClear();
			spy2.mockClear();

			const response2 = await database.select().from(TestTable);

			expect(response2).toHaveLength(1);

			expect(spy).toHaveBeenCalledTimes(0);
			expect(spy2).toHaveBeenCalledTimes(1);

			spy.mockClear();
			spy2.mockClear();

			let context: (PgTExtensionContext & { cache?: PgTCacheContext }) | PostQueryHookData = {
				cache: {
					enabled: false,
				},
				nonce: "test",
			};
			const response3 = await database.select().from(TestTable).execute({}, context);

			expect(response3).toHaveLength(1);

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(0);

			expect(context).toHaveProperty("context");
			expect(context).toHaveProperty("input");
			expect(context).toHaveProperty("output");

			spy.mockClear();
			spy2.mockClear();

			context = {
				cache: {
					enabled: true,
					key: "test",
				},
				nonce: "test2",
			};

			const response4 = await database.select().from(TestTable).execute({}, context);

			expect(response4).toHaveLength(1);

			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy2).toHaveBeenCalledTimes(0);

			expect(context).toHaveProperty("context");
			expect(context).toHaveProperty("input");
			expect(context).toHaveProperty("output");

			spy.mockClear();
			spy2.mockClear();
		} catch (error_) {
			error = error_;

			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(dropTable, []);

		if (error) throw error;
	});
});
