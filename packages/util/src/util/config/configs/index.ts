import type { PostgreSQLTypedCLIConfig } from "./cli/index.js";
import type { PostgreSQLTypedCoreConfig } from "./core/index.js";

export interface PgTConfigSchema {
	cli: PostgreSQLTypedCLIConfig;
	core: PostgreSQLTypedCoreConfig;
}

export type PgTConfig = DeepPartial<PgTConfigSchema>;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type { Connection } from "./cli/Connection.js";
export type { FilesConfig } from "./cli/FilesConfig.js";
export type { ImportStatement } from "./cli/ImportStatement.js";
export type { PostgreSQLTypedCLIConfig } from "./cli/index.js";
