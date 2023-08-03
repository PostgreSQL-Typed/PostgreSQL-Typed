/* eslint-disable unicorn/no-null */
import { relations } from "drizzle-orm";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "../definers/index.js";
import { pgt } from "../driver.js";
import { sql, table as pgTable } from "../index.js";
import { isNotNull } from "../operators.js";

describe("query", () => {
	test("PgTRelationalQuery", async () => {
		const postgres = new Client({
				application_name: "relational_query_test.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			users = pgTable("users", {
				id: defineInt2("id").notNull(),
				invitedBy: defineInt2("invited_by"),
				name: defineText("name"),
			}),
			userRelation = relations(users, ({ one }) => ({
				invitee: one(users, {
					fields: [users.invitedBy],
					references: [users.id],
				}),
			})),
			database = pgt(postgres, {
				schema: {
					userRelation,
					users,
				},
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists users (
				id int2 NOT NULL,
				name text NULL,
				invited_by int2 NULL
			);
		`);

		let finalError;
		try {
			await database
				.insert(users)
				.values([
					{ id: 1, name: "test1" },
					{ id: 2, invitedBy: 1, name: "test2" },
				])
				.execute();

			const result1 = await database.query.users.findMany();

			expect(result1).toEqual([
				{ id: 1, invitedBy: null, name: "test1" },
				{ id: 2, invitedBy: 1, name: "test2" },
			]);

			const result2 = await database.query.users.findFirst();

			expect(result2).toEqual({ id: 1, invitedBy: null, name: "test1" });

			const result3 = await database.query.users
				.findFirst({
					where: isNotNull(users.invitedBy),
				})
				.execute();

			expect(result3).toEqual({ id: 2, invitedBy: 1, name: "test2" });

			const result4 = await database.query.users
				.findMany({
					where: isNotNull(users.invitedBy),
				})
				.prepare("test")
				.all();

			expect(result4).toEqual([{ id: 2, invited_by: 1, name: "test2" }]);

			const result5 = await database.transaction(async transaction => {
				const result = await transaction.query.users.findMany();
				return result;
			});

			expect(result5).toEqual([
				{ id: 1, invitedBy: null, name: "test1" },
				{ id: 2, invitedBy: 1, name: "test2" },
			]);
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists users;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
