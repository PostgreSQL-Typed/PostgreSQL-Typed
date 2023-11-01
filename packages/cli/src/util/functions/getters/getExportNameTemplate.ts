import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getExportNameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const filesConfig = config.files;

	switch (id.type) {
		case "column": {
			const override =
				config.files.columnNameOverrides[`${id.schemaName}.${id.tableName}.${id.name}`] || config.files.columnNameOverrides[`${id.tableName}.${id.name}`];
			return override ?? filesConfig.columnName;
		}
		case "table":
		case "tableType":
			return filesConfig.tableName;
		case "tableInferType":
			return filesConfig.tableTypeName;
		case "tableInsertInferType":
			return filesConfig.tableInsertTypeName;
		case "schema":
		case "schemaType":
			return filesConfig.schemaName;
		case "enum":
		case "enumType":
			return filesConfig.enumName;
		case "domain":
			return filesConfig.domainName;
		case "debug":
		case "schemaReexport":
		case "schemaTypeReexport":
		case "databaseReexport":
		case "databaseTypeReexport":
			return "";
		case "export":
			return getExportNameTemplate(config, id.of);
	}
}
