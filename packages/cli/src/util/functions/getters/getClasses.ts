import type { Client } from "pg";

import type { ClassKind } from "../../../types/enums/ClassKind.js";
import type { Class } from "../../../types/interfaces/Class.js";

export async function getClasses(
	client: Client,
	options: {
		schema_names: string[];
		kind: ClassKind[];
	}
): Promise<Class[]> {
	const conditions = [
			`ns.nspname IN (${options.schema_names.map(s => `'${s}'`).join(", ")})`,
			`cls.relkind IN (${options.kind.map(k => `'${k}'`).join(", ")})`,
		],
		{ rows: classes } = await client.query<Class>(`
    SELECT
      current_database() as "database_name",
      ns.oid as "schema_id",
      ns.nspname as "schema_name",
      cls.oid as "class_id",
      cls.relname as "class_name",
      cls.relkind as "kind",
      obj_description(cls.oid, 'pg_class') as "comment"
    FROM pg_catalog.pg_class cls
    INNER JOIN pg_catalog.pg_namespace ns
      ON (cls.relnamespace = ns.oid)
    ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
    ORDER BY ns.nspname ASC, cls.relname ASC;
  `);

	return classes;
}
