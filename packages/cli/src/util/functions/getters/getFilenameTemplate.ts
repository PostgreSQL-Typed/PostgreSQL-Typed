import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getFilenameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const {
		tableFileName,
		tableDataFileName,
		tableInsertParametersFileName,
		tableInsertParametersDataFileName,
		primaryKeyFileName,
		schemaFileName,
		schemaDataFileName,
		databaseFileName,
		databaseDataFileName,
		fullExportFileName,
		fullExportDataFileName,
		enumFileName,
		domainFileName,
		domainDataFileName,
		debugFileName,
	} = config.types;

	switch (id.type) {
		case "table_type":
			return formatFileType(tableFileName);
		case "table_data":
			return formatFileType(tableDataFileName);
		case "insert_parameters_type":
			return formatFileType(tableInsertParametersFileName);
		case "insert_parameters_data":
			return formatFileType(tableInsertParametersDataFileName);
		case "primary_key":
			return formatFileType(primaryKeyFileName);
		case "schema_type":
			return formatFileType(schemaFileName);
		case "schema_data":
			return formatFileType(schemaDataFileName);
		case "database_type":
			return formatFileType(databaseFileName);
		case "database_data":
			return formatFileType(databaseDataFileName);
		case "full_export_type":
			return formatFileType(fullExportFileName);
		case "full_export_data":
			return formatFileType(fullExportDataFileName);
		case "enum":
			return formatFileType(enumFileName);
		case "domain_type":
			return formatFileType(domainFileName);
		case "domain_data":
			return formatFileType(domainDataFileName);
		case "debug":
			return formatFileType(debugFileName, "json");
		case "re_export":
			return getFilenameTemplate(config, id.of);
	}
}

function formatFileType(fileName: string, extension = "ts") {
	return fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
}
