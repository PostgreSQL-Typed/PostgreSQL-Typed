import type { PgTCacheOptions } from "./lib/index.js";

declare module "@postgresql-typed/util" {
	interface PgTConfigSchema {
		cache?: PgTCacheOptions;
	}
}