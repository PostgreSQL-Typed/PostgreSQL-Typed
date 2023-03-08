import type { Client } from "pg";

import type { Constraint } from "../../../types/interfaces/Constraint.js";

export async function getConstraints(client: Client, schemaNames: string[]) {
	const conditions = [`ns.nspname IN (${schemaNames.map(s => `'${s}'`).join(", ")})`],
		{ rows: constraints } = await client.query<Constraint>(`
    SELECT
      conname AS "constraint_name",
      contype AS "constraint_type",
      conrelid AS "class_id",
      confrelid AS "referenced_class_id",
      confupdtype AS "foreign_key_update_action",
      confdeltype AS "foreign_key_deletion_action",
      confmatchtype AS "foreign_key_match_type",
      conkey AS "table_attribute_numbers",
      confkey AS "referenced_attribute_numbers",
      pg_get_constraintdef(c.oid, true) AS "constraint_description"
    FROM pg_catalog.pg_constraint c
    INNER JOIN pg_catalog.pg_class cls
      ON (c.conindid = cls.oid)
    INNER JOIN pg_catalog.pg_namespace ns
      ON (c.connamespace = ns.oid)
    ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
    ORDER BY ns.nspname ASC, c.conname ASC
  `);

	return constraints;
}
