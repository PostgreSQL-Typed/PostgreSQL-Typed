import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getFilenameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const filesConfig = config.files,
		extension = filesConfig.preCompile ? ".js" : ".ts";

	switch (id.type) {
		case "table":
			return formatFileType(filesConfig.tableFileName, extension);
		case "tableType":
			return formatFileType(filesConfig.tableFileName, ".d.ts");
		case "tableInferType":
			return formatFileType(filesConfig.tableTypeFileName, filesConfig.preCompile ? ".d.ts" : ".ts");
		case "tableInsertInferType":
			return formatFileType(filesConfig.tableInsertTypeFileName, filesConfig.preCompile ? ".d.ts" : ".ts");
		case "column":
			return "";
		case "databaseReexport":
			return formatFileType(filesConfig.databaseFileName, extension);
		case "databaseTypeReexport":
			return formatFileType(filesConfig.databaseFileName, ".d.ts");
		case "schema":
			return formatFileType(filesConfig.schemasFileName, extension);
		case "schemaType":
			return formatFileType(filesConfig.schemasFileName, ".d.ts");
		case "schemaReexport":
			return formatFileType(filesConfig.schemaFileName, extension);
		case "schemaTypeReexport":
			return formatFileType(filesConfig.schemaFileName, ".d.ts");
		case "domain":
			return formatFileType(filesConfig.domainFileName, extension);
		case "enum":
			return formatFileType(filesConfig.enumFileName, extension);
		case "enumType":
			return formatFileType(filesConfig.enumFileName, ".d.ts");
		case "debug":
			return formatFileType(filesConfig.debugFileName, ".json");
		case "export":
			return getFilenameTemplate(config, id.of);
	}
}

function formatFileType(fileName: string, extension: string) {
	//* Remove .ts .d.ts .js extensions from file name
	fileName = fileName.replace(/\.(ts|d\.ts|js|json)$/, "");
	return `${fileName}${extension}`;
}
