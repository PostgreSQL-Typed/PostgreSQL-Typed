import type { PostgreSQLTypedCLIConfig } from "./cli/index.js";

export interface PostgreSQLTypedConfig {
	cli: PostgreSQLTypedCLIConfig;
}

export type PostgreSQLTypedConfigPartial = DeepPartial<PostgreSQLTypedConfig>;
export type PostgreSQLTypedConfigFunction = () => PostgreSQLTypedConfigPartial | Promise<PostgreSQLTypedConfigPartial>;
export type PostgreSQLTypedConfigExport = PostgreSQLTypedConfigPartial | PostgreSQLTypedConfigFunction;
export type PostgreSQLTypedConfigFinal = PostgreSQLTypedConfig;

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type { Connection } from "./cli/Connection.js";
export type { ImportStatement } from "./cli/ImportStatement.js";
export type { PostgreSQLTypedCLIConfig } from "./cli/index.js";
export type { TypesConfig } from "./cli/TypesConfig.js";
