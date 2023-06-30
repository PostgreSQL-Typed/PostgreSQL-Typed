import { defineUntypedSchema, SchemaDefinition } from "untyped";

import { type Connection } from "./Connection.js";
import filesSchema, { type FilesConfig } from "./FilesConfig.js";

export interface PostgreSQLTypedCLIConfig {
	/**
	 * The connection string to the postgres database
	 * or a connection object with the following properties:
	 * - host: The hostname of the postgres database
	 * - port: The port of the postgres database
	 * - user: The username of the postgres database
	 * - password: The password of the postgres database
	 * - database: The name of the postgres database
	 *
	 * To set the connection string using environment variables, you need to set the `connectionStringEnvironmentVariable` to the name of the environment variable.
	 * If you want to connect to multiple databases, you can use an array of connection strings or connection objects.
	 * @default "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"
	 */
	connections: string | string[] | Connection | Connection[];

	/**
	 * The schemas to generate the typescript types for
	 *
	 * You can input the following values:
	 * - "*" to generate types for all schemas.
	 * - A string with the name of a the schema to generate types for.
	 * - An array of schema names to generate types for.
	 * - A number with the oid of a the schema to generate types for.
	 * - An array of oids to generate types for.
	 *
	 * Note that if you input a string, then you need to prefix the schema name with the database name, you can use the following syntax:
	 * - `database.schema`
	 *
	 * @default "*"
	 */
	schemas: string | string[] | number | number[];

	/**
	 * The tables to generate the typescript types for
	 *
	 * You can input the following values:
	 * - "*" to generate types for all tables.
	 * - A string with the name of a the table to generate types for.
	 * - An array of table names to generate types for.
	 * - A number with the oid of a the table to generate types for.
	 * - An array of oids to generate types for.
	 *
	 * Note that if you input a string, then you need to prefix the table with the name of the schema and name of the database, you can use the following syntax:
	 * - `database.schema.table`
	 *
	 * @default "*"
	 */
	tables: string | string[] | number | number[];

	/**
	 * Config for the generator
	 *
	 * @default {}
	 */
	files: FilesConfig;

	/**
	 * The TypeScript module type you use in your project (if you are using esm it adds the .js import extension)
	 *
	 * @default "cjs"
	 */
	type: "esm" | "cjs";
}

const schema: SchemaDefinition = defineUntypedSchema({
	connections: {
		$default: "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable",
	},
	schemas: {
		$default: "*",
		$resolve: value => (typeof value === "string" ? value : "*"),
	},
	tables: {
		$default: "*",
		$resolve: value => (typeof value === "string" ? value : "*"),
	},
	files: filesSchema,
	type: {
		$default: "cjs",
		$resolve: value => (value === "esm" ? "esm" : "cjs"),
	},
});
export default schema;
