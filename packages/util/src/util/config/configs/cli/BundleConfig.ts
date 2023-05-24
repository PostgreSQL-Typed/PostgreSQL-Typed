import { defineUntypedSchema, SchemaDefinition } from "untyped";

export interface BundleConfig {
	/**
	 * Whether to bundle the generated code into a single file
	 *
	 * @default false
	 */
	enabled: boolean;

	/**
	 * What should the bundle file be called
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
	 * Note: .ts is automatically appended to the end of the path (unless you include it yourself)
	 *
	 * @default "index.ts"
	 */
	bundleFileName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ TYPE_NAME | default }}"
	 */
	enumTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}PrimaryKey"
	 */
	primaryKeyTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}"
	 */
	tableTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}Data"
	 */
	tableDataTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParameters"
	 */
	tableInsertParametersTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParametersData"
	 */
	tableInsertParametersDataTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}"
	 */
	schemaTypeName: string;

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
	 * @default "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}Data"
	 */
	schemaDataTypeName: string;

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
	 * What should the full export of the databases types be called in the generated code
	 *
	 * @default "Databases"
	 */
	fullExportTypeName: string;

	/**
	 * What should the full export of the databases data be called in the generated code
	 *
	 * @default "DatabasesData"
	 */
	fullExportDataTypeName: string;
}

const schema: SchemaDefinition = defineUntypedSchema({
	enabled: {
		$default: false,
		$resolve: Boolean,
	},
	bundleFileName: {
		$default: "index.ts",
		$resolve: value => (typeof value === "string" ? value : "index.ts"),
	},
	domainTypeName: {
		$default: "{{ TYPE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | default }}"),
	},
	domainDataTypeName: {
		$default: "{{ TYPE_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ TYPE_NAME | default }}Data"),
	},
	enumTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ TYPE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ TYPE_NAME | default }}"),
	},
	primaryKeyTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}PrimaryKey",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}PrimaryKey"),
	},
	tableTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}"),
	},
	tableDataTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}Data"),
	},
	tableInsertParametersTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParameters",
		$resolve: value =>
			typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParameters",
	},
	tableInsertParametersDataTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParametersData",
		$resolve: value =>
			typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}{{ TABLE_NAME | default }}InsertParametersData",
	},
	schemaTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}"),
	},
	schemaDataTypeName: {
		$default: "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}{{ SCHEMA_NAME | default }}Data"),
	},
	databaseTypeName: {
		$default: "{{ DATABASE_NAME | default }}",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}"),
	},
	databaseDataTypeName: {
		$default: "{{ DATABASE_NAME | default }}Data",
		$resolve: value => (typeof value === "string" ? value : "{{ DATABASE_NAME | default }}Data"),
	},
	fullExportTypeName: {
		$default: "Databases",
		$resolve: value => (typeof value === "string" ? value : "Databases"),
	},
	fullExportDataTypeName: {
		$default: "DatabasesData",
		$resolve: value => (typeof value === "string" ? value : "DatabasesData"),
	},
});
export default schema;
