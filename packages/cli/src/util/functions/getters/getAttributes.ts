import type { Client } from "pg";

import type { Attribute } from "../../../types/interfaces/Attribute.js";

export async function getAttributes(
	client: Client,
	options: {
		database_name: string;
		schema_names?: string[];
		class_id?: number;
	}
) {
	const conditions: string[] = ["a.attisdropped = false"];
	if (options.schema_names) conditions.push(`ns.nspname IN (${options.schema_names.map(s => `'${s}'`).join(", ")})`);

	if (options.class_id) conditions.push(`cls.oid = ${options.class_id}`);

	const { rows: attributes } = await client.query<Attribute>(`
    SELECT
      current_database() AS "database_name",
      ns.oid AS "schema_id",
      ns.nspname AS "schema_name",
      cls.oid AS "class_id",
      cls.relname AS "class_name",
      a.attnum as "attribute_number",
      a.attname AS "attribute_name",
      a.attnotnull AS "not_null",
      a.atthasdef AS "has_default",
      pg_get_expr(def.adbin, def.adrelid, true) AS "default",
      col_description(a.attrelid, a.attnum) AS "comment",
      a.atttypid AS "type_id",
      a.atttypmod AS "type_length",
      format_type(a.atttypid, a.atttypmod) AS "type_name",
      clmns.character_maximum_length AS "max_length",
      clmns.numeric_precision AS "precision",
      CASE
        WHEN clmns.numeric_scale <= 1000
          THEN clmns.numeric_scale
        WHEN clmns.numeric_scale > 1000
          THEN (-(2048 - clmns.numeric_scale))
        ELSE null
      END AS scale
    FROM pg_catalog.pg_attribute a
    INNER JOIN pg_catalog.pg_class cls
      ON (a.attrelid = cls.oid)
    INNER JOIN pg_catalog.pg_namespace ns
      ON (cls.relnamespace = ns.oid)
    LEFT OUTER JOIN pg_catalog.pg_attrdef def -- default values
      ON (def.adrelid = cls.oid AND def.adnum = a.attnum)
    INNER JOIN information_schema.COLUMNS clmns -- character_maximum_length
      ON (clmns.table_catalog = current_database() AND clmns.table_schema = ns.nspname AND clmns.table_name = cls.relname AND clmns.column_name = a.attname)
    ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
    ORDER BY ns.nspname ASC, cls.relname ASC, a.attname ASC;
  `);

	return attributes;
}
