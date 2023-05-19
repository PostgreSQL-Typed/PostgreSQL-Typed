import type { Awaitable } from "./Awaitable.js";
import type { Context } from "./Context.js";
import type { Query } from "./Query.js";

export interface ClientHooks {
	"client:pre-query": (data: { input: { query: string; values: string[] }; output: Query<unknown> | undefined }, context: Context) => Awaitable<void>;
	"client:post-query": (data: { input: { query: string; values: string[] }; output: Query<unknown> }, context: Context) => Awaitable<void>;
	"client:pre-query-override": (data: { input: { query: string; values: string[] }; output: Query<unknown> }, context: Context) => Awaitable<void>;
	"client:pre-connect": () => Awaitable<void>;
	"client:post-connect": () => Awaitable<void>;
}
