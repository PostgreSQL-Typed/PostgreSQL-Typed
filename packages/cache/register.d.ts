import type { PgTCacheContext,PgTCacheOptions } from "./lib/index.js";

declare module "@postgresql-typed/util" {
	interface PgTConfigSchema {
		cache?: PgTCacheOptions;
	}

	interface PgTExtensionContext {
		cache?: PgTCacheContext
	}
}