import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { DataType } from "./DataTypes.js";

describe("DataType", () => {
	it("PostgreSQL data types should all be defined in DataType", async () => {
		const allDataTypes = Object.values(DataType).filter((value): value is number => typeof value === "number"),
			query = `
      SELECT
        t.typname AS "name",
        pg_catalog.obj_description(t.oid, 'pg_type') as "description",
        t.oid as "oid"
      FROM
        pg_catalog.pg_type t
      LEFT JOIN
        pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE
        (t.typrelid = 0 OR (
          SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid
        ))
        AND NOT EXISTS(
          SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid
        )
        AND pg_catalog.pg_type_is_visible(t.oid)
        and t.oid not in (${allDataTypes.join(", ")})
        and n.nspname = 'pg_catalog'
      ORDER BY 1, 2;
    `,
			client = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "DataType.test.ts",
			});

		await client.connect();

		let error;
		try {
			const response = await client.query<{
				name: string;
				description: string;
				oid: number;
			}>(query);

			// eslint-disable-next-line no-console
			for (const row of response.rows) console.log(`[MISSING] name: ${row.name} - description: ${row.description} - oid: ${row.oid}`);

			expect(response.rows.length).toBe(0);
		} catch (error_) {
			error = error_;
		}

		await client.end();

		if (error) throw error;
	});

	it("DataType should have the matching name and oid", async () => {
		const allDataTypes = Object.values(DataType).filter((value): value is number => typeof value === "number"),
			query = `
      SELECT
        t.typname AS "name",
        t.oid as "oid"
      FROM
        pg_catalog.pg_type t
      LEFT JOIN
        pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE
        (t.typrelid = 0 OR (
          SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid
        ))
        AND NOT EXISTS(
          SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid
        )
        AND pg_catalog.pg_type_is_visible(t.oid)
        and t.oid in (${allDataTypes.join(", ")})
        and n.nspname = 'pg_catalog'
      ORDER BY 1, 2;
    `,
			client = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "DataType.test.ts",
			});

		await client.connect();

		let error;
		try {
			const response = await client.query<{
				name: string;
				oid: number;
			}>(query);

			for (const row of response.rows) expect(DataType[row.oid]).toBe(row.name);
		} catch (error_) {
			error = error_;
		}

		await client.end();

		if (error) throw error;
	});
});
