import pg from "pg";

export const { Client, Pool, Query } = pg;
export * from "./driver.js";
export * from "./PgTError.js";
export * from "./query-builders/index.js";
export * from "./session.js";
export { Issue, IssueCode, PgTPError } from "@postgresql-typed/parsers";
export { ClientHooks, ParsedType, PgTExtensionContext, PostQueryHookData, PreQueryHookData } from "@postgresql-typed/util";
export { InferColumnsDataTypes, InferModel, InferModelFromColumns, SQL, sql } from "drizzle-orm";
export * from "drizzle-orm/node-postgres";
export { pgEnum as enum, pgSchema as schema, pgTable as table, pgView as view } from "drizzle-orm/pg-core";
export * from "drizzle-orm/pg-core";
export type {
	ClientConfig,
	Client as ClientType,
	PoolClient,
	PoolConfig,
	Pool as PoolType,
	QueryArrayConfig,
	QueryArrayResult,
	QueryConfig,
	QueryResult,
	Query as QueryType,
} from "pg";
