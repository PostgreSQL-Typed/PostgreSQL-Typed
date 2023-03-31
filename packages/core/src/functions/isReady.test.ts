import { describe, expect, expectTypeOf, test } from "vitest";

import { Client } from "../classes/Client";
import { TestData, testData } from "../classes/testData";
import { isReady } from "./isReady";

describe("isReady", () => {
	test("false", async () => {
		let client: Client<TestData, false> | Client<TestData, true> = new Client<TestData>(testData);

		expect(client).toBeInstanceOf(Client);
		expect(client.ready).toBe(false);

		client = await client.testConnection();

		expect(client.ready).toBe(false);
		expect(client.connectionError).toBeInstanceOf(Error);

		expect(isReady(client)).toBe(false);
		if (isReady(client)) expect.fail("Client should not be ready");

		expectTypeOf(client).toEqualTypeOf<Client<TestData, false>>();
	});

	test("true", async () => {
		let client: Client<TestData, false> | Client<TestData, true> = new Client<TestData>(testData, {
			options: {
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
			},
		});

		client = await client.testConnection();

		expect(client.ready).toBe(true);
		expect(client.connectionError).toBe(undefined);

		expect(isReady(client)).toBe(true);
		if (!isReady(client)) expect.fail("Client should be ready");

		expectTypeOf(client).toEqualTypeOf<Client<TestData, true>>();
	});
});
