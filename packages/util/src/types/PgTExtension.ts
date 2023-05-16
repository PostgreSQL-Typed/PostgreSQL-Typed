import type { Awaitable } from "./Awaitable.js";
import type { PgTBaseClient } from "./PgTBaseClient.js";

export type PgTExtensionOptions = Record<string, any>;

export interface PgTExtension<T extends PgTExtensionOptions = PgTExtensionOptions> {
	(this: void, inlineOptions: T, pgt: PgTBaseClient<any, boolean>): Awaitable<void | false>;
}
