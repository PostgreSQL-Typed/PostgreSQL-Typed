import type { Config } from "../../../types/interfaces/Config";
import type { TypeID } from "../../../types/types/TypeID";

export function getFilenameTemplate(config: Config, id: TypeID): string {
	const {
			tableFileName,
			tableInsertParametersFileName,
			primaryKeyFileName,
			schemaFileName,
			schemaDataFileName,
			databaseFileName,
			databaseDataFileName,
			enumFileName,
			domainFileName,
			zod,
		} = config.types,
		{ tableInsertParametersZodFileName, schemaDataZodFileName, databaseDataZodFileName, enumZodFileName, domainZodFileName } = zod;

	switch (id.type) {
		case "table":
			return formatFileType(tableFileName);
		case "insert_parameters":
			return formatFileType(tableInsertParametersFileName);
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
		case "enum":
			return formatFileType(enumFileName);
		case "domain":
			return formatFileType(domainFileName);
		case "z_insert_parameters":
			return formatFileType(tableInsertParametersZodFileName);
		case "z_schema_data":
			return formatFileType(schemaDataZodFileName);
		case "z_database_data":
			return formatFileType(databaseDataZodFileName);
		case "z_enum":
			return formatFileType(enumZodFileName);
		case "z_domain":
			return formatFileType(domainZodFileName);
		case "re_export":
			return getFilenameTemplate(config, id.of);
	}
}

function formatFileType(fileName: string) {
	return fileName.endsWith(".ts") ? fileName : `${fileName}.ts`;
}
