import { z } from "zod";

export interface ZodConfig {
	/**
	 * Whether to add zod types to the generated code
	 *
	 * If true, the PostgreSQL-Typed package will validate any UPDATE's and INSERT's before sending them to the database.
	 * @default true
	 */
	enabled: boolean;

	/**
	 * What should custom zod types be called in the generated code
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
	 * @default "z{{ TYPE_NAME | pascal-case }}"
	 */
	domainZodTypeName: string;

	/**
	 * Where should custom zod types be located in the generated code
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
	 * @default "_z_custom_types.ts"
	 */
	domainZodFileName: string;

	/**
	 * What should enum zod types be called in the generated code
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
	 * @default "z{{ TYPE_NAME | pascal-case }}"
	 */
	enumZodTypeName: string;

	/**
	 * Where should enum zod types be located in the generated code
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
	 * @default "z_databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts"
	 */
	enumZodFileName: string;

	/**
	 * What should table insert parameter zod types be called in the generated code
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
	 * @default "z{{ TABLE_NAME | pascal-case }}_InsertParameters"
	 */
	tableInsertParametersZodTypeName: string;

	/**
	 * Where should table insert parameter zod types be located in the generated code
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
	 * @default "z_databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"
	 */
	tableInsertParametersZodFileName: string;

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
	 * @default "z{{ SCHEMA_NAME | pascal-case }}_Data"
	 */
	schemaDataZodTypeName: string;

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
	 * @default "z_databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"
	 */
	schemaDataZodFileName: string;

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
	 * @default "z{{ DATABASE_NAME | pascal-case }}_Data"
	 */
	databaseDataZodTypeName: string;

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
	 * @default "z_databases/{{ DATABASE_NAME }}.ts"
	 */
	databaseDataZodFileName: string;

	/**
	 * Override column types for some columns. The name can be either:
	 *
	 * - "table_name.column_name"
	 * - "schema_name.table_name.column_name"
	 *
	 * @default {}
	 */
	columnZodOverrides: { [x: string]: string | undefined };

	/**
	 * Override generated Zod types for some types. The name can be either:
	 *
	 * - key of DataTypeID
	 * - value of DataTypeID
	 * - "custom_type_name"
	 * - "schema_name.custom_type_name"
	 *
	 * @default {}
	 *
	 * DataTypeID:
	 * @link https://github.com/Bas950/PostgreSQL-Types-Generator/blob/main/src/types/enums/DataTypeID.ts
	 */
	zodOverrides: { [x: string]: string | undefined };
}

export const zZodConfig = z.object({
	enabled: z.boolean().default(true),
	domainZodTypeName: z.string().default("z{{ TYPE_NAME | pascal-case }}"),
	domainZodFileName: z.string().default("_z_custom_types.ts"),
	enumZodTypeName: z.string().default("z{{ TYPE_NAME | pascal-case }}"),
	enumZodFileName: z.string().default("z_databases/{{ DATABASE_NAME }}/enums/{{ TYPE_NAME }}.ts"),
	tableInsertParametersZodTypeName: z.string().default("z{{ TABLE_NAME | pascal-case }}_InsertParameters"),
	tableInsertParametersZodFileName: z.string().default("z_databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}/{{ TABLE_NAME }}.ts"),
	schemaDataZodTypeName: z.string().default("z{{ SCHEMA_NAME | pascal-case }}_Data"),
	schemaDataZodFileName: z.string().default("z_databases/{{ DATABASE_NAME }}/{{ SCHEMA_NAME }}.ts"),
	databaseDataZodTypeName: z.string().default("z{{ DATABASE_NAME | pascal-case }}_Data"),
	databaseDataZodFileName: z.string().default("z_databases/{{ DATABASE_NAME }}.ts"),
	columnZodOverrides: z.record(z.optional(z.string())).default({}),
	zodOverrides: z.record(z.optional(z.string())).default({}),
});
