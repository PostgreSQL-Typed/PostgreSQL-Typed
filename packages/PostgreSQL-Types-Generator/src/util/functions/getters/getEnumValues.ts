import type { Client } from "pg";

import type { EnumValue } from "../../../types/interfaces/EnumValue";

export async function getEnumValues(connection: Client, typeId: number): Promise<EnumValue[]> {
	const conditions = [`ty.oid = ${typeId}`],
		{ rows: enumValues } = await connection.query<EnumValue>(`
    SELECT
      ns.oid AS "schema_id",
      ns.nspname AS "schema_name",
      ty.oid AS "type_id",
      ty.typname AS "type_name",
      e.enumlabel AS "value"
    FROM pg_catalog.pg_enum e
    INNER JOIN pg_catalog.pg_type ty
      ON (e.enumtypid = ty.oid)
    INNER JOIN pg_catalog.pg_namespace ns
      ON (ty.typnamespace = ns.oid)
    LEFT OUTER JOIN pg_catalog.pg_type subt
      ON (ty.typelem = subt.oid)
    ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
    ORDER BY ns.nspname ASC, ty.typname ASC, e.enumlabel ASC
  `);

	return enumValues;
}
