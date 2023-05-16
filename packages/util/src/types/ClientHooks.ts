import type { Awaitable } from "./Awaitable.js";
import type { Context } from "./Context.js";
import type { Query } from "./Query.js";

export interface ClientHooks {
	"client:pre-query": (data: { query: string; values: string[] }, context: Context) => Awaitable<void>;
	"client:post-query": (data: Query<unknown>, context: Context) => Awaitable<void>;
	"client:pre-connect": () => Awaitable<void>;
	"client:post-connect": () => Awaitable<void>;
}
