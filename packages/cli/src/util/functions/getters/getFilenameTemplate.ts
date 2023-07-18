import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getFilenameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const filesConfig = config.files;

	switch (id.type) {
		case "table":
			return formatFileType(filesConfig.tableFileName);
		case "tableType":
			return formatFileType(filesConfig.tableTypeFileName);
		case "tableInsertType":
			return formatFileType(filesConfig.tableInsertTypeFileName);
		case "column":
			return "";
		case "databaseReexport":
			return formatFileType(filesConfig.databaseFileName);
		case "schema":
			return formatFileType(filesConfig.schemasFileName);
		case "schemaReexport":
			return formatFileType(filesConfig.schemaFileName);
		case "domain":
			return formatFileType(filesConfig.domainFileName);
		case "enum":
			return formatFileType(filesConfig.enumFileName);
		case "debug":
			return formatFileType(filesConfig.debugFileName, "json");
		case "export":
			return getFilenameTemplate(config, id.of);
	}
}

function formatFileType(fileName: string, extension = "ts") {
	return fileName.endsWith(`.${extension}`) ? fileName : `${fileName}.${extension}`;
}
