import { BundleConfig, setDefaultBundleConfig } from "./BundleConfig.js";
import { ImportStatement, validateImportStatement } from "./ImportStatement.js";

export interface TypesConfig {
	/**
	 * The directory (relative to this config) to put the generated code in
	 *
	 * @default "__generated__"
	 */
	directory: string;

	/**
	 * Whether to bundle the generated code into a single file
	 *
	 * @default { "enabled": false }
	 */
	bundle: BundleConfig;

	/**
	 * Whether to add debugging statements to the generated code
	 *
	 * @default false
	 */
	debug: boolean;

	/**
	 * What should the debug file be called
	 *
	 * You may use the following placeholders:
	 * - `DATE`: The current date (YYYY-MM-DD)
	 * - `TIME`: The current time (HH:MM:SS.sss)
	 * - `TIMESTAMP`: The current timestamp (YYYY-MM-DD_HH:MM:SS.sss)
	 * - `YEAR`: The current year (YYYY)
	 * - `MONTH`: The current month (MM)
	 * - `DAY`: The current day (DD)
	 * - `HOUR`: The current hour (HH)
	 * - `MINUTE`: The current minute (MM)
	 * - `SECOND`: The current second (SS)
	 * - `MILLISECOND`: The current millisecond (sss)
	 *
	 * Note: The timestamp is in UTC time
	 * Note: .json is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "debug_{{ TIMESTAMP }}.json"
	 */
	debugFileName: string;

	/**
	 * What the default formatter forr the type/file names should be
	 *
	 * The following formatters are available: (You can use more than one at a time, separated by a space)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "pascal-case"
	 */
	defaultFormatter: string;

	/**
	 * What should custom types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TYPE_NAME | default }}"
	 */
	domainTypeName: string;

	/**
	 * Where should custom types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "_custom_types.ts"
	 */
	domainFileName: string;

	/**
	 * What should domain data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TYPE_NAME | default }}Data"
	 */
	domainDataTypeName: string;

	/**
	 * Where should domain data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "_custom_types.ts"
	 */
	domainDataFileName: string;

	/**
	 * What should enum types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TYPE_NAME | default }}"
	 */
	enumTypeName: string;

	/**
	 * Where should enum types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts"
	 */
	enumFileName: string;

	/**
	 * What should primary key types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TABLE_NAME | default }}PrimaryKey"
	 */
	primaryKeyTypeName: string;

	/**
	 * Where should primary key types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"
	 */
	primaryKeyFileName: string;

	/**
	 * What should table types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TABLE_NAME | default }}"
	 */
	tableTypeName: string;

	/**
	 * Where should table types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"
	 */
	tableFileName: string;

	/**
	 * What should table data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TABLE_NAME | default }}Data"
	 */
	tableDataTypeName: string;

	/**
	 * Where should table data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"
	 */
	tableDataFileName: string;

	/**
	 * What should table insert parameter types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TABLE_NAME | default }}InsertParameters"
	 */
	tableInsertParametersTypeName: string;

	/**
	 * Where should table insert parameter types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"
	 */
	tableInsertParametersFileName: string;

	/**
	 * What should table insert parameter data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ TABLE_NAME | default }}InsertParametersData"
	 */
	tableInsertParametersDataTypeName: string;

	/**
	 * Where should table insert parameter data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"
	 */
	tableInsertParametersDataFileName: string;

	/**
	 * What should schema types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ SCHEMA_NAME | default }}"
	 */
	schemaTypeName: string;

	/**
	 * Where should schema types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"
	 */
	schemaFileName: string;

	/**
	 * What should schema data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ SCHEMA_NAME | default }}Data"
	 */
	schemaDataTypeName: string;

	/**
	 * Where should schema data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"
	 */
	schemaDataFileName: string;

	/**
	 * What should database types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}"
	 */
	databaseTypeName: string;

	/**
	 * Where should database types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}.ts"
	 */
	databaseFileName: string;

	/**
	 * What should database data be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * @default "{{ DATABASE_NAME | default }}Data"
	 */
	databaseDataTypeName: string;

	/**
	 * Where should database data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 * - `default`: The default formatter set by the 'defaultFormatter' option
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME }}.ts"
	 */
	databaseDataFileName: string;

	/**
	 * What should the full export of the databases types be called in the generated code
	 *
	 * @default "Databases"
	 */
	fullExportTypeName: string;

	/**
	 * Where should the full export of the databases types be located in the generated code
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "index.ts"
	 */
	fullExportFileName: string;

	/**
	 * What should the full export of the databases data be called in the generated code
	 *
	 * @default "DatabasesData"
	 */
	fullExportDataTypeName: string;

	/**
	 * Where should the full export of the databases data be located in the generated code
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "index.ts"
	 */
	fullExportDataFileName: string;

	/**
	 * Override column types for some columns. The name can be either:
	 *
	 * - "table_name.column_name"
	 * - "schema_name.table_name.column_name"
	 *
	 * @default {}
	 */
	columnTypeOverrides: { [x: string]: string | undefined };

	/**
	 * Override generated TypeScript types for some types. The name can be either:
	 *
	 * - key of OID
	 * - value of OID
	 * - "custom_type_name"
	 * - "schema_name.custom_type_name"
	 *
	 * @default {}
	 *
	 * OID:
	 * @link https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/blob/main/packages/oids/src/OIDs.ts
	 */
	typeOverrides: { [x: string]: string | undefined };

	/**
	 * Override column parsers for some columns. The name can be either:
	 *
	 * - "table_name.column_name"
	 * - "schema_name.table_name.column_name"
	 *
	 * @default {}
	 */
	columnParserOverrides: { [x: string]: [string, ImportStatement[]] | undefined };

	/**
	 * Override generated parsers for some types. The name can be either:
	 *
	 * - key of OID
	 * - value of OID
	 * - "custom_type_name"
	 * - "schema_name.custom_type_name"
	 *
	 * @default {}
	 *
	 * OID:
	 * @link https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/blob/main/packages/oids/src/OIDs.ts
	 */
	parserOverrides: { [x: string]: [string, ImportStatement[]] | undefined };
}

export function setDefaultTypesConfig(config: Record<string, any>): TypesConfig {
	if (config.directory && typeof config.directory !== "string") delete config.directory;
	if (config.bundle && (typeof config.bundle !== "object" || Array.isArray(config.bundle))) delete config.bundle;
	if (config.debug && typeof config.debug !== "boolean") delete config.debug;
	if (config.debugFileName && typeof config.debugFileName !== "string") delete config.debugFileName;
	if (config.defaultFormatter && typeof config.defaultFormatter !== "string") delete config.defaultFormatter;
	if (config.domainTypeName && typeof config.domainTypeName !== "string") delete config.domainTypeName;
	if (config.domainFileName && typeof config.domainFileName !== "string") delete config.domainFileName;
	if (config.domainDataTypeName && typeof config.domainDataTypeName !== "string") delete config.domainDataTypeName;
	if (config.domainDataFileName && typeof config.domainDataFileName !== "string") delete config.domainDataFileName;
	if (config.enumTypeName && typeof config.enumTypeName !== "string") delete config.enumTypeName;
	if (config.enumFileName && typeof config.enumFileName !== "string") delete config.enumFileName;
	if (config.primaryKeyTypeName && typeof config.primaryKeyTypeName !== "string") delete config.primaryKeyTypeName;
	if (config.primaryKeyFileName && typeof config.primaryKeyFileName !== "string") delete config.primaryKeyFileName;
	if (config.tableTypeName && typeof config.tableTypeName !== "string") delete config.tableTypeName;
	if (config.tableFileName && typeof config.tableFileName !== "string") delete config.tableFileName;
	if (config.tableDataTypeName && typeof config.tableDataTypeName !== "string") delete config.tableDataTypeName;
	if (config.tableDataFileName && typeof config.tableDataFileName !== "string") delete config.tableDataFileName;
	if (config.tableInsertParametersTypeName && typeof config.tableInsertParametersTypeName !== "string") delete config.tableInsertParametersTypeName;
	if (config.tableInsertParametersFileName && typeof config.tableInsertParametersFileName !== "string") delete config.tableInsertParametersFileName;
	if (config.tableInsertParametersDataTypeName && typeof config.tableInsertParametersDataTypeName !== "string") delete config.tableInsertParametersDataTypeName;
	if (config.tableInsertParametersDataFileName && typeof config.tableInsertParametersDataFileName !== "string") delete config.tableInsertParametersDataFileName;
	if (config.schemaTypeName && typeof config.schemaTypeName !== "string") delete config.schemaTypeName;
	if (config.schemaFileName && typeof config.schemaFileName !== "string") delete config.schemaFileName;
	if (config.schemaDataTypeName && typeof config.schemaDataTypeName !== "string") delete config.schemaDataTypeName;
	if (config.schemaDataFileName && typeof config.schemaDataFileName !== "string") delete config.schemaDataFileName;
	if (config.databaseTypeName && typeof config.databaseTypeName !== "string") delete config.databaseTypeName;
	if (config.databaseFileName && typeof config.databaseFileName !== "string") delete config.databaseFileName;
	if (config.databaseDataTypeName && typeof config.databaseDataTypeName !== "string") delete config.databaseDataTypeName;
	if (config.databaseDataFileName && typeof config.databaseDataFileName !== "string") delete config.databaseDataFileName;
	if (config.fullExportTypeName && typeof config.fullExportTypeName !== "string") delete config.fullExportTypeName;
	if (config.fullExportFileName && typeof config.fullExportFileName !== "string") delete config.fullExportFileName;
	if (config.fullExportDataTypeName && typeof config.fullExportDataTypeName !== "string") delete config.fullExportDataTypeName;
	if (config.fullExportDataFileName && typeof config.fullExportDataFileName !== "string") delete config.fullExportDataFileName;
	if (config.columnTypeOverrides) {
		if (typeof config.columnTypeOverrides === "object" && !Array.isArray(config.columnTypeOverrides)) {
			for (const key in config.columnTypeOverrides) if (typeof config.columnTypeOverrides[key] !== "string") delete config.columnTypeOverrides[key];
		} else delete config.columnTypeOverrides;
	}
	if (config.typeOverrides) {
		if (typeof config.typeOverrides === "object" && !Array.isArray(config.typeOverrides)) {
			for (const key in config.typeOverrides) if (typeof config.typeOverrides[key] !== "string") delete config.typeOverrides[key];
		} else delete config.typeOverrides;
	}
	if (config.columnParserOverrides) {
		if (typeof config.columnParserOverrides === "object" && !Array.isArray(config.columnParserOverrides)) {
			for (const key in config.columnParserOverrides) {
				if (Array.isArray(config.columnParserOverrides[key])) {
					for (let index = 0; index < config.columnParserOverrides[key].length; index++)
						config.columnParserOverrides[key][index] = validateImportStatement(config.columnParserOverrides[key][index]);

					config.columnParserOverrides[key] = config.columnParserOverrides[key].filter(Boolean);
					if (config.columnParserOverrides[key].length === 0) delete config.columnParserOverrides[key];
				} else delete config.columnParserOverrides[key];
			}
		} else delete config.columnParserOverrides;
	}
	if (config.parserOverrides) {
		if (typeof config.parserOverrides === "object" && !Array.isArray(config.parserOverrides)) {
			for (const key in config.parserOverrides) {
				if (Array.isArray(config.parserOverrides[key])) {
					for (let index = 0; index < config.parserOverrides[key].length; index++)
						config.parserOverrides[key][index] = validateImportStatement(config.parserOverrides[key][index]);

					config.parserOverrides[key] = config.parserOverrides[key].filter(Boolean);
					if (config.parserOverrides[key].length === 0) delete config.parserOverrides[key];
				} else delete config.parserOverrides[key];
			}
		} else delete config.parserOverrides;
	}

	return {
		directory: config.directory ?? "__generated__",
		bundle: setDefaultBundleConfig(config.bundle ?? {}),
		debug: config.debug ?? false,
		debugFileName: config.debugFileName ?? "debug_{{ TIMESTAMP }}.json",
		defaultFormatter: config.defaultFormatter ?? "pascal-case",
		domainTypeName: config.domainTypeName ?? "{{ TYPE_NAME | default }}",
		domainFileName: config.domainFileName ?? "_custom_types.ts",
		domainDataTypeName: config.domainDataTypeName ?? "{{ TYPE_NAME | default }}Data",
		domainDataFileName: config.domainDataFileName ?? "_custom_types.ts",
		enumTypeName: config.enumTypeName ?? "{{ TYPE_NAME | default }}",
		enumFileName: config.enumFileName ?? "databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts",
		primaryKeyTypeName: config.primaryKeyTypeName ?? "{{ TABLE_NAME | default }}PrimaryKey",
		primaryKeyFileName: config.primaryKeyFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		tableTypeName: config.tableTypeName ?? "{{ TABLE_NAME | default }}",
		tableFileName: config.tableFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		tableDataTypeName: config.tableDataTypeName ?? "{{ TABLE_NAME | default }}Data",
		tableDataFileName: config.tableDataFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		tableInsertParametersTypeName: config.tableInsertParametersTypeName ?? "{{ TABLE_NAME | default }}InsertParameters",
		tableInsertParametersFileName: config.tableInsertParametersFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		tableInsertParametersDataTypeName: config.tableInsertParametersDataTypeName ?? "{{ TABLE_NAME | default }}InsertParametersData",
		tableInsertParametersDataFileName: config.tableInsertParametersDataFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		schemaTypeName: config.schemaTypeName ?? "{{ SCHEMA_NAME | default }}",
		schemaFileName: config.schemaFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts",
		schemaDataTypeName: config.schemaDataTypeName ?? "{{ SCHEMA_NAME | default }}Data",
		schemaDataFileName: config.schemaDataFileName ?? "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts",
		databaseTypeName: config.databaseTypeName ?? "{{ DATABASE_NAME | default }}",
		databaseFileName: config.databaseFileName ?? "databases/{{ DATABASE_NAME }}.ts",
		databaseDataTypeName: config.databaseDataTypeName ?? "{{ DATABASE_NAME | default }}Data",
		databaseDataFileName: config.databaseDataFileName ?? "databases/{{ DATABASE_NAME }}.ts",
		fullExportTypeName: config.fullExportTypeName ?? "Databases",
		fullExportFileName: config.fullExportFileName ?? "index.ts",
		fullExportDataTypeName: config.fullExportDataTypeName ?? "DatabasesData",
		fullExportDataFileName: config.fullExportDataFileName ?? "index.ts",
		columnTypeOverrides: config.columnTypeOverrides ?? {},
		columnParserOverrides: config.columnParserOverrides ?? {},
		typeOverrides: config.typeOverrides ?? {},
		parserOverrides: config.parserOverrides ?? {},
	};
}
