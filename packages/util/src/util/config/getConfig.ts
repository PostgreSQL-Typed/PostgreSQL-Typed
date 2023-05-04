import { setDefaultCLIConfig } from "./configs/CLI/index.js";
import { PostgreSQLTypedConfig, PostgreSQLTypedConfigFinal } from "./configs/index.js";
import { resolveConfig } from "./resolveConfig.js";

export async function getConfig(configFile?: string, configRoot: string = process.cwd()): Promise<{ config: PostgreSQLTypedConfig; filePath?: string }> {
	const config = await resolveConfig(configFile, configRoot);
	return { config: setDefaultConfig(config?.config ?? {}), filePath: config?.filePath };
}

export const DEFAULT_CONFIG: PostgreSQLTypedConfigFinal = setDefaultConfig({});

function setDefaultConfig(config?: Record<string, any>): PostgreSQLTypedConfigFinal {
	return {
		cli: setDefaultCLIConfig(config?.cli ?? {}),
	};
}
