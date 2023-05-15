import type { Context } from "../types/Context.js";
import type { Query } from "../types/Query.js";

export interface ClientHooks {
	"client:pre-query": (data: { query: string; values: string[] }, context: Context) => Promise<ClientPreQueryResponse> | ClientPreQueryResponse;
	"client:post-query": (data: Query<unknown>, context: Context) => Promise<void> | void;
	"client:pre-connect": () => Promise<void> | void;
	"client:post-connect": () => Promise<void> | void;
}

export type ClientPreQueryResponse = void | Query<unknown>;
