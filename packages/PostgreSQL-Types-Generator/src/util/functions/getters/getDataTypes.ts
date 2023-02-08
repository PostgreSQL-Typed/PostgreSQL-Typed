/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Client } from "pg";

import { DataTypeCategory } from "../../../types/enums/DataTypeCategory.js";
import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { DataTypeBase } from "../../../types/interfaces/DataTypeBase.js";
import type { DataTypeRecord } from "../../../types/interfaces/DataTypeRecord.js";
import type { DataType } from "../../../types/types/DataType.js";
import { getAttributes } from "../getters/getAttributes.js";
import { getEnumValues } from "../getters/getEnumValues.js";

export async function getDataTypes(client: Client, schemaNames: string[]) {
	const conditions = schemaNames.map(schemaName => `ns.nspname = '${schemaName}'`),
		{ rows: typeRecords } = await client.query<DataTypeRecord>(`
    SELECT
			current_database() as "database_name",
      ns.oid AS "schema_id",
      ns.nspname AS "schema_name",
      ty.oid as "type_id",
      ty.typname AS "type_name",
      ty.typtype AS "kind",
      ty.typcategory AS "category",
      ty.typrelid AS "class_id",
      subt.oid as "subtype_id",
      subt.typname AS "subtype_name",
      baset.oid as "base_type_id",
      baset.typname AS "base_type_name",
      obj_description(ty.oid, 'pg_type') as "comment"
    FROM pg_catalog.pg_type ty
    INNER JOIN pg_catalog.pg_namespace ns
      ON (ty.typnamespace = ns.oid)
    LEFT OUTER JOIN pg_catalog.pg_type subt
      ON (ty.typelem = subt.oid)
    LEFT OUTER JOIN pg_catalog.pg_type baset
      ON (ty.typbasetype = baset.oid)
    ${conditions.length > 0 ? `WHERE ${conditions.join(" OR ")}` : ""}
    ORDER BY ns.nspname ASC, ty.typname ASC, subt.typname ASC, baset.typname ASC
  `);

	return Promise.all(
		typeRecords.map(async (tr): Promise<DataType> => {
			const base: DataTypeBase = {
				database_name: tr.database_name,
				schema_id: tr.schema_id,
				schema_name: tr.schema_name,
				type_id: tr.type_id,
				type_name: tr.type_name,
				kind: tr.kind,
				category: tr.category,
				comment: tr.comment,
			};
			switch (base.kind) {
				case DataTypeKind.Array:
				case DataTypeKind.Base:
					// eslint-disable-next-line unicorn/prefer-ternary
					if (tr.category === DataTypeCategory.Array) {
						return {
							...base,
							kind: DataTypeKind.Array,
							subtype_id: tr.subtype_id!,
							subtype_name: tr.subtype_name!,
						};
					} else {
						return {
							...base,
							kind: DataTypeKind.Base,
							subtype_id: tr.subtype_id,
							subtype_name: tr.subtype_name,
						};
					}
				case DataTypeKind.Composite:
					return {
						...base,
						kind: DataTypeKind.Composite,
						class_id: tr.class_id!,
						attributes: await getAttributes(client, {
							class_id: tr.class_id,
							database_name: tr.database_name,
						}),
					};
				case DataTypeKind.Domain:
					return {
						...base,
						kind: DataTypeKind.Domain,
						base_type_id: tr.base_type_id!,
						base_type_name: tr.base_type_name!,
					};
				case DataTypeKind.Enum: {
					const enumValues = await getEnumValues(client, tr.type_id);
					return {
						...base,
						kind: DataTypeKind.Enum,
						values: enumValues.map(v => v.value),
					};
				}
				case DataTypeKind.Pseudo:
					return {
						...base,
						kind: DataTypeKind.Pseudo,
					};
				default: {
					const { kind } = base;
					return {
						...base,
						kind,
					};
				}
			}
		})
	);
}
