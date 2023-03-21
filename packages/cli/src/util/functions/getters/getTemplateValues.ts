import type { TypeId } from "../../../types/types/TypeId.js";

export function getTemplateValues(id: TypeId): any {
	switch (id.type) {
		case "table_type":
		case "table_data":
		case "insert_parameters_type":
		case "insert_parameters_data":
		case "primary_key":
			return {
				TABLE_NAME: id.name,
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.schemaName,
			};
		case "schema_type":
		case "schema_data":
			return {
				SCHEMA_NAME: id.name,
				DATABASE_NAME: id.databaseName,
			};
		case "database_type":
		case "database_data":
			return {
				DATABASE_NAME: id.name,
			};
		case "enum":
			return { TYPE_NAME: id.name, DATABASE_NAME: id.databaseName };
		case "domain_type":
			return { TYPE_NAME: id.name };
		case "domain_data":
			return { TYPE_NAME: id.name };
		case "debug":
			return {
				DATE: id.date,
				TIME: id.time,
				TIMESTAMP: id.timestamp,
				YEAR: id.year,
				MONTH: id.month,
				DAY: id.day,
				HOUR: id.hour,
				MINUTE: id.minute,
				SECOND: id.second,
				MILLISECOND: id.millisecond,
			};
		case "re_export":
			return getTemplateValues(id.of);
	}
}
