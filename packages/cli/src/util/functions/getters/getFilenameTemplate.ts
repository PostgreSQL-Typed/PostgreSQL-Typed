import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getFilenameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const filesConfig = config.files,
		bundleConfig = config.files.bundle;

	switch (id.type) {
		case "table":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.tableFileName);
		case "tableType":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.tableTypeFileName);
		case "tableInsertType":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.tableInsertTypeFileName);
		case "column":
			return "";
		case "databaseReexport":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.databaseFileName);
		case "schema":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.schemaFileName);
		case "schemaReexport":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.schemaFileName);
		case "domain":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.domainFileName);
		case "enum":
			return formatFileType(bundleConfig.enabled ? bundleConfig.bundleFileName : filesConfig.enumFileName);
		case "debug":
			return formatFileType(filesConfig.debugFileName, "json");
		case "export":
			return getFilenameTemplate(config, id.of);
	}
}

function formatFileType(fileName: string, extension = "ts") {
	return fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
}
