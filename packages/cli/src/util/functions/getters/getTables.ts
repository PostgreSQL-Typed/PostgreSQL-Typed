import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";
import type { Client } from "pg";

import type { Table } from "../../../types/interfaces/Table.js";

export async function getTables(client: Client, config: PostgreSQLTypedCLIConfig, databaseName: string): Promise<Table[]> {
	const { rows: tables } = await client.query<Table>(`
		SELECT
			t.table_schema as schema_name,
			pn.oid as schema_id,
			t.table_name,
			psut.relid as table_id,
			pg_total_relation_size(psut.relid) AS "size"
		FROM information_schema.tables t
		JOIN pg_catalog.pg_statio_user_tables psut
		ON t.table_name = psut.relname AND t.table_schema = psut.schemaname
		JOIN pg_catalog.pg_namespace pn
		ON t.table_schema = pn.nspname
		WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema') AND t.is_insertable_into = 'YES'
		ORDER BY t.table_schema
	`),
		{ rows: views } = await client.query<Table>(`
		SELECT
      ns.nspname as "schema_name",
      ns.oid as "schema_id",
      cls.oid as "table_id",
      cls.relname as "table_name",
      pg_total_relation_size(cls.oid) AS "size"
    FROM pg_catalog.pg_class cls
    INNER JOIN pg_catalog.pg_namespace ns
      ON (cls.relnamespace = ns.oid)
    WHERE
      cls.relkind IN ('m', 'v')
    ORDER BY ns.nspname ASC, cls.relname ASC;
	`),
		rows = [...tables, ...views];

	return rows
		.filter(t => {
			const { schemas } = config;

			if (schemas === "*") return true;
			if (typeof schemas === "string")
				return schemas === `${databaseName}.${t.schema_name}` || schemas === `*.${t.schema_name}` || schemas === `${databaseName}.*`;
			if (typeof schemas === "number") return schemas === t.schema_id;

			const noPositives = [...schemas].filter(s => typeof s !== "string" || !s.startsWith("!")).length === 0;
			if (noPositives) return true;

			return (
				[...schemas].filter((s): s is string => typeof s === "string").includes(`${databaseName}.${t.schema_name}`) ||
				[...schemas].filter((s): s is string => typeof s === "string").includes(`*.${t.schema_name}`) ||
				[...schemas].filter((s): s is string => typeof s === "string").includes(`${databaseName}.*`) ||
				[...schemas].filter((s): s is number => typeof s === "number").includes(t.schema_id)
			);
		})
		.filter(t => {
			const { schemas } = config;

			if (schemas === "!*") return false;
			if (typeof schemas === "string") {
				if (schemas === `!${databaseName}.${t.schema_name}` || schemas === `!*.${t.schema_name}` || schemas === `!${databaseName}.*`) return false;
				return true;
			}
			if (typeof schemas === "number") return true;

			if (
				[...schemas].filter((s): s is string => typeof s === "string").includes(`!${databaseName}.${t.schema_name}`) ||
				[...schemas].filter((s): s is string => typeof s === "string").includes(`!*.${t.schema_name}`) ||
				[...schemas].filter((s): s is string => typeof s === "string").includes(`!${databaseName}.*`)
			)
				return false;

			return true;
		})
		.filter(t => {
			const { tables } = config;

			if (tables === "*") return true;
			if (typeof tables === "string") {
				return (
					tables === `${databaseName}.${t.schema_name}.${t.table_name}` ||
					tables === `*.${t.schema_name}.${t.table_name}` ||
					tables === `*.*.${t.table_name}` ||
					tables === `${databaseName}.${t.schema_name}.*` ||
					tables === `${databaseName}.*.*` ||
					tables === `${databaseName}.*.${t.table_name}` ||
					tables === `*.${t.schema_name}.*`
				);
			}
			if (typeof tables === "number") return tables === t.table_id;

			const noPositives = [...tables].filter(s => typeof s !== "string" || !s.startsWith("!")).length === 0;
			if (noPositives) return true;

			return (
				[...tables].filter((s): s is string => typeof s === "string").includes(`${databaseName}.${t.schema_name}.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`*.${t.schema_name}.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`*.*.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`${databaseName}.${t.schema_name}.*`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`${databaseName}.*.*`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`${databaseName}.*.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`*.${t.schema_name}.*`) ||
				[...tables].filter((s): s is number => typeof s === "number").includes(t.table_id)
			);
		})
		.filter(t => {
			const { tables } = config;

			if (tables === "!*") return false;
			if (typeof tables === "string") {
				if (
					tables === `!${databaseName}.${t.schema_name}.${t.table_name}` ||
					tables === `!*.${t.schema_name}.${t.table_name}` ||
					tables === `!*.*.${t.table_name}` ||
					tables === `!${databaseName}.${t.schema_name}.*` ||
					tables === `!${databaseName}.*.*` ||
					tables === `!${databaseName}.*.${t.table_name}` ||
					tables === `!*.${t.schema_name}.*`
				)
					return false;
				return true;
			}
			if (typeof tables === "number") return true;

			if (
				[...tables].filter((s): s is string => typeof s === "string").includes(`!${databaseName}.${t.schema_name}.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`!*.${t.schema_name}.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`!*.*.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`!${databaseName}.${t.schema_name}.*`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`!${databaseName}.*.*`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`!${databaseName}.*.${t.table_name}`) ||
				[...tables].filter((s): s is string => typeof s === "string").includes(`!*.${t.schema_name}.*`)
			)
				return false;

			return true;
		});
}
