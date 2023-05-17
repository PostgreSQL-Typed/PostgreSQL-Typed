import { defineUntypedSchema, SchemaDefinition } from "untyped";

import bundleSchema, { BundleConfig } from "./BundleConfig.js";
import { ImportStatement } from "./ImportStatement.js";

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

const schema: SchemaDefinition = defineUntypedSchema({
	directory: {
		$default: "__generated__",
		$resolve: value => (typeof value === "string" ? value : "__generated__"),
	},
	bundle: bundleSchema,
	debug: {
		$default: false,
		$resolve: Boolean,
	},
	debugFileName: {
		$default: "debug_{{ TIMESTAMP }}.json",
		$resolve: value => (typeof value === "string" ? value : "debug_{{ TIMESTAMP }}.json"),
	},
	defaultFormatter: {
		$default: "pascal-case",
		$resolve: value => (typeof value === "string" ? value : "pascal-case"),
	},
	domainTypeName: {
		$default: "{{ TYPE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | default }}"),
	},
	domainFileName: {
		$default: "_custom_types.ts",
		$resolve: value => (typeof value === "string" ? value : "_custom_types.ts"),
	},
	domainDataTypeName: {
		$default: "{{ TYPE_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | default }}Data"),
	},
	domainDataFileName: {
		$default: "_custom_types.ts",
		$resolve: value => (typeof value === "string" ? value : "_custom_types.ts"),
	},
	enumTypeName: {
		$default: "{{ TYPE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | default }}"),
	},
	enumFileName: {
		$default: "databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts"),
	},
	primaryKeyTypeName: {
		$default: "{{ TABLE_NAME | default }}PrimaryKey",
		$resolve: value => (typeof value === "string" ? value : "{{ TABLE_NAME | default }}PrimaryKey"),
	},
	primaryKeyFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	},
	tableTypeName: {
		$default: "{{ TABLE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ TABLE_NAME | default }}"),
	},
	tableFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	},
	tableDataTypeName: {
		$default: "{{ TABLE_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ TABLE_NAME | default }}Data"),
	},
	tableDataFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	},
	tableInsertParametersTypeName: {
		$default: "{{ TABLE_NAME | default }}InsertParameters",
		$resolve: value => (typeof value === "string" ? value : "{{ TABLE_NAME | default }}InsertParameters"),
	},
	tableInsertParametersFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	},
	tableInsertParametersDataTypeName: {
		$default: "{{ TABLE_NAME | default }}InsertParametersData",
		$resolve: value => (typeof value === "string" ? value : "{{ TABLE_NAME | default }}InsertParametersData"),
	},
	tableInsertParametersDataFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	},
	schemaTypeName: {
		$default: "{{ SCHEMA_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ SCHEMA_NAME | default }}"),
	},
	schemaFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"),
	},
	schemaDataTypeName: {
		$default: "{{ SCHEMA_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ SCHEMA_NAME | default }}Data"),
	},
	schemaDataFileName: {
		$default: "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"),
	},
	databaseTypeName: {
		$default: "{{ DATABASE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}"),
	},
	databaseFileName: {
		$default: "databases/{{ DATABASE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}.ts"),
	},
	databaseDataTypeName: {
		$default: "{{ DATABASE_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}Data"),
	},
	databaseDataFileName: {
		$default: "databases/{{ DATABASE_NAME }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME }}.ts"),
	},
	fullExportTypeName: {
		$default: "Databases",
		$resolve: value => (typeof value === "string" ? value : "Databases"),
	},
	fullExportFileName: {
		$default: "index.ts",
		$resolve: value => (typeof value === "string" ? value : "index.ts"),
	},
	fullExportDataTypeName: {
		$default: "DatabasesData",
		$resolve: value => (typeof value === "string" ? value : "DatabasesData"),
	},
	fullExportDataFileName: {
		$default: "index.ts",
		$resolve: value => (typeof value === "string" ? value : "index.ts"),
	},
	columnTypeOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
	columnParserOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
	typeOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
	parserOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
});
export default schema;
