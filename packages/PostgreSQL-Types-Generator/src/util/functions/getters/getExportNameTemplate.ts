import type { Config } from "../../../types/interfaces/Config.js";
import type { TypeId } from "../../../types/types/TypeId.js";

export function getExportNameTemplate(config: Config, id: TypeId): string {
	switch (id.type) {
		case "table":
			return config.types.tableTypeName;
		case "insert_parameters":
			return config.types.tableInsertParametersTypeName;
		case "primary_key":
			return config.types.primaryKeyTypeName;
		case "schema_type":
			return config.types.schemaTypeName;
		case "schema_data":
			return config.types.schemaDataTypeName;
		case "database_type":
			return config.types.databaseTypeName;
		case "database_data":
			return config.types.databaseDataTypeName;
		case "enum":
			return config.types.enumTypeName;
		case "domain":
			return config.types.domainTypeName;
		case "z_insert_parameters":
			return config.types.zod.tableInsertParametersZodTypeName;
		case "z_schema_data":
			return config.types.zod.schemaDataZodTypeName;
		case "z_database_data":
			return config.types.zod.databaseDataZodTypeName;
		case "z_enum":
			return config.types.zod.enumZodTypeName;
		case "z_domain":
			return config.types.zod.domainZodTypeName;
		case "re_export":
			return getExportNameTemplate(config, id.of);
	}
}
