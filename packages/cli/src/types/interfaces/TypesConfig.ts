import { z } from "zod";

import { type ImportStatement, zImportStatement } from "./ImportStatement.js";

export interface TypesConfig {
	/**
	 * The directory (relative to this config) to put the generated code in
	 *
	 * @default "__generated__"
	 */
	directory: string;

	/**
	 * Whether to add debugging statements to the generated code
	 * @default false
	 */
	debug: boolean;

	/**
	 * What should custom types be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TYPE_NAME | pascal-case }}"
	 */
	domainTypeName: string;

	/**
	 * Where should custom types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TYPE_NAME | pascal-case }}_Data"
	 */
	domainDataTypeName: string;

	/**
	 * Where should domain data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TYPE_NAME | pascal-case }}"
	 */
	enumTypeName: string;

	/**
	 * Where should enum types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TABLE_NAME | pascal-case }}_PrimaryKey"
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TABLE_NAME | pascal-case }}"
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TABLE_NAME | pascal-case }}_Data"
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TABLE_NAME | pascal-case }}_InsertParameters"
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TABLE_NAME | pascal-case }}_InsertParameters_Data"
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ SCHEMA_NAME | pascal-case }}"
	 */
	schemaTypeName: string;

	/**
	 * Where should schema types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ SCHEMA_NAME | pascal-case }}_Data"
	 */
	schemaDataTypeName: string;

	/**
	 * Where should schema data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ DATABASE_NAME | pascal-case }}"
	 */
	databaseTypeName: string;

	/**
	 * Where should database types be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ DATABASE_NAME | pascal-case }}_Data"
	 */
	databaseDataTypeName: string;

	/**
	 * Where should database data be located in the generated code
	 *
	 * You may use the following placeholders:
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time)
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
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
	 * @default "Databases_Data"
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

export const zTypesConfig = z.object({
	directory: z.string().default("__generated__"),
	debug: z.boolean().default(false),
	domainTypeName: z.string().default("{{ TYPE_NAME | pascal-case }}"),
	domainFileName: z.string().default("_custom_types.ts"),
	domainDataTypeName: z.string().default("{{ TYPE_NAME | pascal-case }}_Data"),
	domainDataFileName: z.string().default("_custom_types.ts"),
	enumTypeName: z.string().default("{{ TYPE_NAME | pascal-case }}"),
	enumFileName: z.string().default("databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts"),
	primaryKeyTypeName: z.string().default("{{ TABLE_NAME | pascal-case }}_PrimaryKey"),
	primaryKeyFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	tableTypeName: z.string().default("{{ TABLE_NAME | pascal-case }}"),
	tableFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	tableDataTypeName: z.string().default("{{ TABLE_NAME | pascal-case }}_Data"),
	tableDataFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	tableInsertParametersTypeName: z.string().default("{{ TABLE_NAME | pascal-case }}_InsertParameters"),
	tableInsertParametersFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	tableInsertParametersDataTypeName: z.string().default("{{ TABLE_NAME | pascal-case }}_InsertParameters_Data"),
	tableInsertParametersDataFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	schemaTypeName: z.string().default("{{ SCHEMA_NAME | pascal-case }}"),
	schemaFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"),
	schemaDataTypeName: z.string().default("{{ SCHEMA_NAME | pascal-case }}_Data"),
	schemaDataFileName: z.string().default("databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"),
	databaseTypeName: z.string().default("{{ DATABASE_NAME | pascal-case }}"),
	databaseFileName: z.string().default("databases/{{ DATABASE_NAME }}.ts"),
	databaseDataTypeName: z.string().default("{{ DATABASE_NAME | pascal-case }}_Data"),
	databaseDataFileName: z.string().default("databases/{{ DATABASE_NAME }}.ts"),
	fullExportTypeName: z.string().default("Databases"),
	fullExportFileName: z.string().default("index.ts"),
	fullExportDataTypeName: z.string().default("Databases_Data"),
	fullExportDataFileName: z.string().default("index.ts"),
	columnTypeOverrides: z.record(z.optional(z.string())).default({}),
	typeOverrides: z.record(z.optional(z.string())).default({}),
	columnParserOverrides: z.record(z.optional(z.tuple([z.string(), z.array(zImportStatement)]))).default({}),
	parserOverrides: z.record(z.optional(z.tuple([z.string(), z.array(zImportStatement)]))).default({}),
});
