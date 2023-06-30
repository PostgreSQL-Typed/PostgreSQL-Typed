import type { QueryArrayConfig, QueryArrayResult, QueryConfig, QueryResult } from "pg";

import type { Awaitable } from "./Awaitable.js";

export type PreQueryHookData =
	| { input: { query: QueryConfig<any[]>; values: unknown[] }; output: QueryResult<any> | undefined }
	| { input: { query: QueryArrayConfig<any[]>; values: unknown[] }; output: QueryArrayResult<any[]> | undefined };

export type PostQueryHookData =
	| { input: { query: QueryConfig<any[]>; values: unknown[] }; output: QueryResult<any> }
	| { input: { query: QueryArrayConfig<any[]>; values: unknown[] }; output: QueryArrayResult<any[]> };

export interface ClientHooks {
	"pgt:pre-query": (data: PreQueryHookData) => Awaitable<void>;
	"pgt:post-query": (data: PostQueryHookData) => Awaitable<void>;
	"pgt:pre-query-override": (data: PostQueryHookData) => Awaitable<void>;
}
