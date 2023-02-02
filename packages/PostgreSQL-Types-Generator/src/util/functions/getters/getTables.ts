import type { Client } from "pg";

import type { Config } from "../../../types/interfaces/Config";
import type { Table } from "../../../types/interfaces/Table";

export async function getTables(client: Client, config: Config, dbName: string): Promise<Table[]> {
	const { rows } = await client.query<Table>(`
			SELECT t.table_schema as schema_name, pn.oid as schema_id, t.table_name, psut.relid as table_id FROM information_schema.tables t
			JOIN pg_catalog.pg_statio_user_tables psut
			ON t.table_name = psut.relname AND t.table_schema = psut.schemaname
			JOIN pg_catalog.pg_namespace pn
			ON t.table_schema = pn.nspname
			WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema') AND t.is_insertable_into = 'YES'
			ORDER BY t.table_schema
		`);

	return rows
		.filter(t => {
			const { schemas } = config;

			if (schemas === "*") return true;
			if (typeof schemas === "string") return schemas === `${dbName}.${t.schema_name}`;
			if (typeof schemas === "number") return schemas === t.schema_id;

			return (
				[...schemas].filter((s): s is string => typeof s === "string").includes(`${dbName}.${t.schema_name}`) ||
				[...schemas].filter((s): s is number => typeof s === "number").includes(t.schema_id)
			);
		})
		.filter(t => {
			const { tables } = config;

			if (tables === "*") return true;
			if (typeof tables === "string") return tables === `${dbName}.${t.schema_name}.${t.table_name}`;
			if (typeof tables === "number") return tables === t.table_id;

			return (
				[...tables].filter((s): s is string => typeof s === "string").includes(`${dbName}.${t.schema_name}.${t.table_name}`) ||
				[...tables].filter((s): s is number => typeof s === "number").includes(t.table_id)
			);
		});
}
