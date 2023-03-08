import type { Config } from "../../../types/interfaces/Config.js";
import type { TypeId } from "../../../types/types/TypeId.js";

export function getExportNameTemplate(config: Config, id: TypeId): string {
	switch (id.type) {
		case "table_type":
			return config.types.tableTypeName;
		case "table_data":
			return config.types.tableDataTypeName;
		case "insert_parameters_type":
			return config.types.tableInsertParametersTypeName;
		case "insert_parameters_data":
			return config.types.tableInsertParametersDataTypeName;
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
		case "full_export_type":
			return config.types.fullExportTypeName;
		case "full_export_data":
			return config.types.fullExportDataTypeName;
		case "enum":
			return config.types.enumTypeName;
		case "domain_type":
			return config.types.domainTypeName;
		case "domain_data":
			return config.types.domainDataTypeName;
		case "re_export":
			return getExportNameTemplate(config, id.of);
	}
}
