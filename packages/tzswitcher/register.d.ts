import type { PgTTzSwitcherOptions } from "./lib/index.js";

declare module "@postgresql-typed/util" {
	interface PgTConfigSchema {
		tzswitcher?: PgTTzSwitcherOptions;
	}
}
