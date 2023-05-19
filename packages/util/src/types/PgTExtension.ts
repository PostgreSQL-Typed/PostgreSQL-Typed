import type { SchemaDefinition } from "untyped";

import type { Awaitable } from "./Awaitable.js";
import type { PgTBaseClient } from "./PgTBaseClient.js";

export type PgTExtensionOptions = Record<string, any>;

export interface PgTExtension<T extends PgTExtensionOptions = PgTExtensionOptions> {
	(this: void, inlineOptions: T, pgt: PgTBaseClient<any, boolean>): Awaitable<void>;
	getOptions?: (pgt: PgTBaseClient<any, boolean>, inlineOptions?: T) => Promise<T>;
	getMeta?: () => Promise<PgTExtensionModuleMeta>;
}

export interface PgTExtensionModuleMeta {
	/** Module name. */
	name?: string;

	/** Module version. */
	version?: string;

	/**
	 * The configuration key used within `pgt.config` for this module's options.
	 * For example, `@postgresql-typed/cache` uses `cache`.
	 */
	configKey?: string;

	[key: string]: any;
}

export interface PgTExtensionModuleDefinition<T extends PgTExtensionOptions = PgTExtensionOptions> {
	meta?: PgTExtensionModuleMeta;
	defaults?: T | ((pgt: PgTBaseClient<any, boolean>) => T);
	schema?: T | SchemaDefinition;
	setup?: (this: void, resolvedOptions: T, pgt: PgTBaseClient<any, boolean>) => Awaitable<void>;
}
