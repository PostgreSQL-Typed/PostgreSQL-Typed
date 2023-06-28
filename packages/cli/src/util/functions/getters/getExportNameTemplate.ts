import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getExportNameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const filesConfig = config.files;

	switch (id.type) {
		case "column":
			return filesConfig.columnName;
		case "table":
			return filesConfig.tableName;
		case "tableType":
			return filesConfig.tableTypeName;
		case "tableInsertType":
			return filesConfig.tableInsertTypeName;
		case "schema":
			return filesConfig.schemaName;
		case "enum":
			return filesConfig.enumName;
		case "domain":
			return filesConfig.domainName;
		case "debug":
			return "";
		case "schemaReexport":
			return "";
		case "databaseReexport":
			return "";
		case "export":
			return getExportNameTemplate(config, id.of);
	}
}
