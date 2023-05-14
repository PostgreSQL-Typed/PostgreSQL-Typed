import { type Connection, setDefaultConnection } from "./Connection.js";
import { setDefaultTypesConfig, type TypesConfig } from "./TypesConfig.js";

export interface PostgreSQLTypedCLIConfig {
	/**
	 * The environment variable containing the
	 * connection string to the postgres database
	 *
	 * Note that if the enviroment variable is set, the `connections` option is ignored.
	 *
	 * If you want to connect to multiple databases, you can use the same environment variable with a "_1" suffix for the second database, "_2" for the third database, etc.
	 *
	 * @default "DATABASE_URL"
	 */
	connectionStringEnvironmentVariable: string;

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
	 * Config for the types generator
	 *
	 * @default {}
	 */
	types: TypesConfig;
}

export function setDefaultCLIConfig(config: Record<string, any>): PostgreSQLTypedCLIConfig {
	if (config.connectionStringEnvironmentVariable && typeof config.connectionStringEnvironmentVariable !== "string")
		delete config.connectionStringEnvironmentVariable;

	if (config.connections) {
		if (Array.isArray(config.connections)) {
			if (config.connections.length === 0) delete config.connections;
			else if (config.connections.length === 1) config.connections = config.connections[0];
			else {
				for (let index = 0; index < config.connections.length; index++) {
					const connection = config.connections[index];
					if (typeof connection !== "string" && typeof connection !== "object") {
						delete config.connections;
						break;
					}

					if (typeof connection === "object") config.connections[index] = setDefaultConnection(connection);
				}
			}
		}
		if (config.connections && typeof config.connections !== "string" && typeof config.connections !== "object") delete config.connections;
		else if (config.connections && typeof config.connections === "object" && !Array.isArray(config.connections))
			config.connections = setDefaultConnection(config.connections);
	}

	if (config.schemas) {
		if (Array.isArray(config.schemas)) {
			if (config.schemas.length === 0) delete config.schemas;
			else if (config.schemas.length === 1) config.schemas = config.schemas[0];
			else for (const schema of config.schemas) if (typeof schema !== "string" && typeof schema !== "number") delete config.schemas;
		}
		if (config.schemas && !Array.isArray(config.schemas) && typeof config.schemas !== "string" && typeof config.schemas !== "number") delete config.schemas;
	}

	if (config.tables) {
		if (Array.isArray(config.tables)) {
			if (config.tables.length === 0) delete config.tables;
			else if (config.tables.length === 1) config.tables = config.tables[0];
			else for (const table of config.tables) if (typeof table !== "string" && typeof table !== "number") delete config.tables;
		}
		if (config.tables && !Array.isArray(config.tables) && typeof config.tables !== "string" && typeof config.tables !== "number") delete config.tables;
	}

	return {
		connectionStringEnvironmentVariable: config.connectionStringEnvironmentVariable ?? "DATABASE_URL",
		connections: config.connections ?? "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable",
		schemas: config.schemas ?? "*",
		tables: config.tables ?? "*",
		types: setDefaultTypesConfig(config.types ?? {}),
	};
}
