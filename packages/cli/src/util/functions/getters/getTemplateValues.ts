import type { TypeId } from "../../../types/types/TypeId.js";

export function getTemplateValues(id: TypeId): Record<string, string> {
	switch (id.type) {
		case "column":
			return {
				COLUMN_NAME: id.name,
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.schemaName,
				TABLE_NAME: id.tableName,
			};
		case "table":
		case "tableType":
		case "tableInferType":
		case "tableInsertInferType":
			return {
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.schemaName,
				TABLE_NAME: id.name,
			};
		case "schema":
		case "schemaType":
		case "schemaReexport":
		case "schemaTypeReexport":
			return {
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.name,
			};
		case "databaseReexport":
		case "databaseTypeReexport":
			return {
				DATABASE_NAME: id.name,
			};
		case "enum":
		case "enumType":
			return { DATABASE_NAME: id.databaseName, TYPE_NAME: id.name };
		case "domain":
			return { TYPE_NAME: id.name };
		case "debug":
			return {
				DATE: id.date,
				DAY: id.day,
				HOUR: id.hour,
				MILLISECOND: id.millisecond,
				MINUTE: id.minute,
				MONTH: id.month,
				SECOND: id.second,
				TIME: id.time,
				TIMESTAMP: id.timestamp,
				YEAR: id.year,
			};
		case "export":
			return getTemplateValues(id.of);
	}
}
