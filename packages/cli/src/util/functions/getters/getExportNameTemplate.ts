import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import type { TypeId } from "../../../types/types/TypeId.js";

export function getExportNameTemplate(config: PostgreSQLTypedCLIConfig, id: TypeId): string {
	const typeConfig = config.types,
		bundleConfig = config.types.bundle;

	switch (id.type) {
		case "table_type":
			return bundleConfig.enabled ? bundleConfig.tableTypeName : typeConfig.tableTypeName;
		case "table_data":
			return bundleConfig.enabled ? bundleConfig.tableDataTypeName : typeConfig.tableDataTypeName;
		case "insert_parameters_type":
			return bundleConfig.enabled ? bundleConfig.tableInsertParametersTypeName : typeConfig.tableInsertParametersTypeName;
		case "insert_parameters_data":
			return bundleConfig.enabled ? bundleConfig.tableInsertParametersDataTypeName : typeConfig.tableInsertParametersDataTypeName;
		case "primary_key":
			return bundleConfig.enabled ? bundleConfig.primaryKeyTypeName : typeConfig.primaryKeyTypeName;
		case "schema_type":
			return bundleConfig.enabled ? bundleConfig.schemaTypeName : typeConfig.schemaTypeName;
		case "schema_data":
			return bundleConfig.enabled ? bundleConfig.schemaDataTypeName : typeConfig.schemaDataTypeName;
		case "database_type":
			return bundleConfig.enabled ? bundleConfig.databaseTypeName : typeConfig.databaseTypeName;
		case "database_data":
			return bundleConfig.enabled ? bundleConfig.databaseDataTypeName : typeConfig.databaseDataTypeName;
		case "full_export_type":
			return bundleConfig.enabled ? bundleConfig.fullExportTypeName : typeConfig.fullExportTypeName;
		case "full_export_data":
			return bundleConfig.enabled ? bundleConfig.fullExportDataTypeName : typeConfig.fullExportDataTypeName;
		case "enum":
			return bundleConfig.enabled ? bundleConfig.enumTypeName : typeConfig.enumTypeName;
		case "domain_type":
			return bundleConfig.enabled ? bundleConfig.domainTypeName : typeConfig.domainTypeName;
		case "domain_data":
			return bundleConfig.enabled ? bundleConfig.domainDataTypeName : typeConfig.domainDataTypeName;
		case "debug":
			return "";
		case "re_export":
			return getExportNameTemplate(config, id.of);
	}
}
