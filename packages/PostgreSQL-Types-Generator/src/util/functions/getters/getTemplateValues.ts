import type { TypeID } from "../../../types/types/TypeID";

export function getTemplateValues(id: TypeID): any {
	switch (id.type) {
		case "table":
		case "insert_parameters":
		case "primary_key":
		case "z_insert_parameters":
			return {
				TABLE_NAME: id.name,
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.schemaName,
			};
		case "schema_type":
		case "schema_data":
		case "z_schema_data":
			return {
				SCHEMA_NAME: id.name,
				DATABASE_NAME: id.databaseName,
			};
		case "database_type":
		case "database_data":
		case "z_database_data":
			return {
				DATABASE_NAME: id.name,
			};
		case "enum":
		case "z_enum":
			return { TYPE_NAME: id.name, DATABASE_NAME: id.databaseName };
		case "domain":
		case "z_domain":
			return { TYPE_NAME: id.name };
		case "re_export":
			return getTemplateValues(id.of);
	}
}
