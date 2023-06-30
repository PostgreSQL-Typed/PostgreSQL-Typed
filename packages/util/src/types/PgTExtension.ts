import type { SchemaDefinition } from "untyped";

import type { Awaitable } from "./Awaitable.js";
import type { PgTExtensionsManagerType } from "./PgTExtensionsManagerType.js";

export type PgTExtensionOptions = Record<string, any>;

export interface PgTExtension<T extends PgTExtensionOptions = PgTExtensionOptions> {
	(this: void, inlineOptions: T, manager: PgTExtensionsManagerType): Awaitable<void>;
	getOptions?: (manager: PgTExtensionsManagerType, inlineOptions?: T) => Promise<T>;
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
	defaults?: T | ((manager: PgTExtensionsManagerType) => T);
	schema?: T | SchemaDefinition;
	setup?: (this: void, resolvedOptions: T, manager: PgTExtensionsManagerType) => Awaitable<void>;
}
