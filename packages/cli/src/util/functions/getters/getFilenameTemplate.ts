import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getFilenameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const typeConfig = config.types,
		bundleConfig = config.types.bundle;

	switch (id.type) {
		case "table_type":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.tableFileName);
		case "table_data":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.tableDataFileName);
		case "insert_parameters_type":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.tableInsertParametersFileName);
		case "insert_parameters_data":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.tableInsertParametersDataFileName);
		case "primary_key":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.primaryKeyFileName);
		case "schema_type":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.schemaFileName);
		case "schema_data":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.schemaDataFileName);
		case "database_type":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.databaseFileName);
		case "database_data":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.databaseDataFileName);
		case "full_export_type":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.fullExportFileName);
		case "full_export_data":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.fullExportDataFileName);
		case "enum":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.enumFileName);
		case "domain_type":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.domainFileName);
		case "domain_data":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.domainDataFileName);
		case "debug":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : typeConfig.debugFileName, "json");
		case "re_export":
			return getFilenameTemplate(config, id.of);
	}
}

function formatFileType(fileName: string, extension = "ts") {
	return fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
}
