import { z } from "zod";

import type { Connection } from "../interfaces/Connection";
import { zConnection } from "../interfaces/Connection";
import type { TypesConfig } from "../interfaces/TypesConfig";
import { zTypesConfig } from "../interfaces/TypesConfig";

export interface Config {
	/**
	 * The environment variable containing the
	 * connection string to the postgres database
	 *
	 * Note that if the enviroment variable is set, the `connections` option is ignored.
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
	 * @default "postgres://postgres:postgres@localhost:5432/postgres"
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

export const zConfig = z.object({
	connectionStringEnvironmentVariable: z.string().default("DATABASE_URL"),
	connections: z.string().or(z.array(z.string())).or(zConnection).or(z.array(zConnection)).default("postgres://postgres:postgres@localhost:5432/postgres"),
	schemas: z.string().or(z.array(z.string())).or(z.number()).or(z.array(z.number())).default("*"),
	tables: z.string().or(z.array(z.string())).or(z.number()).or(z.array(z.number())).default("*"),
	types: zTypesConfig.default({}),
});

const cfg = (zConfig.safeParse({}) as unknown as { data: Config }).data;
cfg.types = {} as TypesConfig;

export const DEFAULT_CONFIG: Config = cfg;
