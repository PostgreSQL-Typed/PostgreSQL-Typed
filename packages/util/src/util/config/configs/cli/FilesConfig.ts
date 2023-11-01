import { defineUntypedSchema, SchemaDefinition } from "untyped";

import definerSchema, { type DefinerModes } from "./DefinerModes.js";
import type { ImportStatement } from "./ImportStatement.js";

export interface FilesConfig {
	/**
	 * The directory (relative to this config) to put the generated code in
	 *
	 * @default "__generated__"
	 */
	directory: string;

	/**
	 * Whether to add debugging statements to the generated code
	 *
	 * @default false
	 */
	debug: boolean;

	/**
	 * Whether to pre-compile the generated code
	 *
	 * This will make the generated code run faster, but will only generate .d.ts and .js files
	 *
	 * @default false
	 */
	preCompile: boolean;

	/**
	 * Definer modes
	 */
	definerModes: DefinerModes;

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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "_custom_types.ts"
	 */
	domainFileName: string;

	/**
	 * What should domain be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `TYPE_NAME`: The name of the type
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ TYPE_NAME | camel-case }}"
	 */
	domainName: string;

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
	 *
	 * @default "{{ TYPE_NAME | pascal-case }}"
	 */
	enumName: string;

	/**
	 * What should columns be called in the generated code
	 *
	 * You may use the following placeholders:
	 * - `COLUMN_NAME`: The name of the column
	 * - `TABLE_NAME`: The name of the table
	 * - `SCHEMA_NAME`: The name of the schema
	 * - `DATABASE_NAME`: The name of the database
	 *
	 * You may use the following formatters: (You can use more than one at a time, serparated by " | ")
	 * - `pascal-case`: Capitalize the first letter of each word
	 * - `camel-case`: Capitalize the first letter of each word, except for the first word
	 * - `plural`: Add an "s" to the end of the type name
	 * - `singular`: Remove the "s" from the end of the type name
	 *
	 * @default "{{ COLUMN_NAME | camel-case }}"
	 */
	columnName: string;

	/**
	 * Where should enums be located in the generated code
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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}/enums/{{ TYPE_NAME | pascal-case }}.ts"
	 */
	enumFileName: string;

	/**
	 * What should table type be called in the generated code
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
	 *
	 * @default "{{ SCHEMA_NAME | pascal-case }}{{ TABLE_NAME | pascal-case }}"
	 */
	tableTypeName: string;

	/**
	 * Where should table type be located in the generated code
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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts"
	 */
	tableTypeFileName: string;

	/**
	 * What should table insert type be called in the generated code
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
	 *
	 * @default "New{{ SCHEMA_NAME | pascal-case }}{{ TABLE_NAME | pascal-case }}"
	 */
	tableInsertTypeName: string;

	/**
	 * Where should table insert type be located in the generated code
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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts"
	 */
	tableInsertTypeFileName: string;

	/**
	 * What should table be called in the generated code
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
	 *
	 * @default "{{ SCHEMA_NAME | camel-case }}{{ TABLE_NAME | pascal-case }}"
	 */
	tableName: string;

	/**
	 * Where should table be located in the generated code
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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts"
	 */
	tableFileName: string;

	/**
	 * What should schema be called in the generated code
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
	 *
	 * @default "{{ SCHEMA_NAME | camel-case }}"
	 */
	schemaName: string;

	/**
	 * Where should all schema definitions be located in the generated code
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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}/schemas.ts"
	 */
	schemasFileName: string;

	/**
	 * Where should all column reexports of a schema be located in the generated code
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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}.ts"
	 */
	schemaFileName: string;

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
	 *
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "databases/{{ DATABASE_NAME | camel-case }}.ts"
	 */
	databaseFileName: string;

	/**
	 * Override generated definer typings for some types. The name can be either:
	 *
	 * - key of OID
	 * - value of OID
	 * - "table_name.column_name"
	 * - "schema_name.table_name.column_name"
	 *
	 * @default {}
	 *
	 * OID:
	 * @link https://github.com/PostgreSQL-Typed/PostgreSQL-Typed/blob/main/packages/oids/src/OIDs.ts
	 *
	 * @example Defining a type for a JSONB column
	 * ```ts
	 * {
	 * 	  "table_name.column_name": [
	 * 			"PgTJSONBType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, MyCustomInterface>",
	 * 			[
	 *				{
	 *					module: "@postgresql-typed/core/definers",
	 *					name: "PgTJSONBType",
	 *					type: "named",
	 *					isType: true,
	 *				},
	 *				{
	 *					module: "MyCustomModule",
	 *					name: "MyCustomInterface",
	 *					type: "named",
	 *					isType: true,
	 *				},
	 *			],
	 * 		],
	 * }
	 * ```
	 */
	definerTypeOverrides: { [x: string]: [string, ImportStatement[]] | undefined };

	/**
	 * Override generated definer instantiations for some types. The name can be either:
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
	definerOverrides: { [x: string]: [string, ImportStatement[]] | undefined };

	/**
	 * Override generated column names for some columns. The key can be either:
	 *
	 * - "table_name.column_name"
	 * - "schema_name.table_name.column_name"
	 *
	 * @default {}
	 *
	 * @example Renaming "user_id" to "id" in tables with the name "users"
	 * ```ts
	 * {
	 * 	  "users.user_id": "id",
	 * }
	 * ```
	 */
	columnNameOverrides: { [x: string]: string | undefined };

	/**
	 * Skip generating types for some columns. The key can be either:
	 *
	 * - "table_name.column_name"
	 * - "schema_name.table_name.column_name"
	 *
	 * @default []
	 *
	 * @example Skipping "user_id" in tables with the name "users"
	 * ```ts
	 * ["users.user_id"]
	 * ```
	 */
	skipColumns: string[];
}

const schema: SchemaDefinition = defineUntypedSchema({
	columnName: {
		$default: "{{ COLUMN_NAME | camel-case }}",
		$resolve: value => (typeof value === "string" ? value : "{{ COLUMN_NAME | camel-case }}"),
	},
	columnNameOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
	databaseFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}.ts"),
	},
	debug: {
		$default: false,
		$resolve: Boolean,
	},
	debugFileName: {
		$default: "debug_{{ TIMESTAMP }}.json",
		$resolve: value => (typeof value === "string" ? value : "debug_{{ TIMESTAMP }}.json"),
	},
	definerModes: definerSchema,
	definerOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
	definerTypeOverrides: {
		$default: {},
		$resolve: value => {
			if (typeof value === "object") return value;
			return {};
		},
	},
	directory: {
		$default: "__generated__",
		$resolve: value => (typeof value === "string" ? value : "__generated__"),
	},
	domainFileName: {
		$default: "_custom_types.ts",
		$resolve: value => (typeof value === "string" ? value : "_custom_types.ts"),
	},
	domainName: {
		$default: "{{ TYPE_NAME | camel-case }}",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | camel-case }}"),
	},
	enumFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}/enums/{{ TYPE_NAME | pascal-case }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}/enums/{{ TYPE_NAME | pascal-case }}.ts"),
	},
	enumName: {
		$default: "{{ TYPE_NAME | pascal-case }}",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | pascal-case }}"),
	},
	preCompile: {
		$default: false,
		$resolve: Boolean,
	},
	schemaFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}.ts"),
	},
	schemaName: {
		$default: "{{ SCHEMA_NAME | camel-case }}",
		$resolve: value => (typeof value === "string" ? value : "{{ SCHEMA_NAME | camel-case }}"),
	},
	schemasFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}/schemas.ts",
		$resolve: value => (typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}/schemas.ts"),
	},
	skipColumns: {
		$default: [],
		$resolve: value => {
			if (typeof value === "object") return value;
			return [];
		},
	},
	tableFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts",
		$resolve: value =>
			typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts",
	},
	tableInsertTypeFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts",
		$resolve: value =>
			typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts",
	},
	tableInsertTypeName: {
		$default: "New{{ SCHEMA_NAME | pascal-case }}{{ TABLE_NAME | pascal-case }}",
		$resolve: value => (typeof value === "string" ? value : "New{{ SCHEMA_NAME | pascal-case }}{{ TABLE_NAME | pascal-case }}"),
	},
	tableName: {
		$default: "{{ SCHEMA_NAME | camel-case }}{{ TABLE_NAME | pascal-case }}",
		$resolve: value => (typeof value === "string" ? value : "{{ SCHEMA_NAME | camel-case }}{{ TABLE_NAME | pascal-case }}"),
	},
	tableTypeFileName: {
		$default: "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts",
		$resolve: value =>
			typeof value === "string" ? value : "databases/{{ DATABASE_NAME | camel-case }}/{{ SCHEMA_NAME | camel-case }}/{{ TABLE_NAME | camel-case }}.ts",
	},
	tableTypeName: {
		$default: "{{ SCHEMA_NAME | pascal-case }}{{ TABLE_NAME | pascal-case }}",
		$resolve: value => (typeof value === "string" ? value : "{{ SCHEMA_NAME | pascal-case }}{{ TABLE_NAME | pascal-case }}"),
	},
});
export default schema;
