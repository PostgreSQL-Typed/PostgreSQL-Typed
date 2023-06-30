import type { TypeId } from "../../../types/types/TypeId.js";

export function getTemplateValues(id: TypeId): any {
	switch (id.type) {
		case "column":
			return {
				COLUMN_NAME: id.name,
				TABLE_NAME: id.tableName,
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.schemaName,
			};
		case "table":
		case "tableType":
		case "tableInsertType":
			return {
				TABLE_NAME: id.name,
				DATABASE_NAME: id.databaseName,
				SCHEMA_NAME: id.schemaName,
			};
		case "schema":
		case "schemaReexport":
			return {
				SCHEMA_NAME: id.name,
				DATABASE_NAME: id.databaseName,
			};
		case "databaseReexport":
			return {
				DATABASE_NAME: id.name,
			};
		case "enum":
			return { TYPE_NAME: id.name, DATABASE_NAME: id.databaseName };
		case "domain":
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
		case "export":
			return getTemplateValues(id.of);
	}
}
