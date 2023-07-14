import type { QueryArrayConfig, QueryArrayResult, QueryConfig, QueryResult } from "pg";

import type { Awaitable } from "./Awaitable.js";
import type { PgTExtensionContext } from "./PgTExtensionContext.js";

export type PreQueryHookData =
	| { input: { query: QueryConfig<any[]>; values: unknown[] }; output: QueryResult<any> | undefined; context: PgTExtensionContext }
	| { input: { query: QueryArrayConfig<any[]>; values: unknown[] }; output: QueryArrayResult<any[]> | undefined; context: PgTExtensionContext };

export type PostQueryHookData =
	| { input: { query: QueryConfig<any[]>; values: unknown[] }; output: QueryResult<any>; context: PgTExtensionContext }
	| { input: { query: QueryArrayConfig<any[]>; values: unknown[] }; output: QueryArrayResult<any[]>; context: PgTExtensionContext };

export interface ClientHooks {
	"pgt:pre-query": (data: PreQueryHookData) => Awaitable<void>;
	"pgt:post-query": (data: PostQueryHookData) => Awaitable<void>;
	"pgt:pre-query-override": (data: PostQueryHookData) => Awaitable<void>;
}
