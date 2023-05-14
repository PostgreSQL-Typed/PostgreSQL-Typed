import { setDefaultCLIConfig } from "./configs/clii/index.js";
import { PostgreSQLTypedConfig, PostgreSQLTypedConfigFinal } from "./configs/index.js";
import { resolveConfig } from "./resolveConfig.js";

export async function getConfig(
	configFile?: string,
	configRoot: string = process.cwd()
): Promise<{ config: PostgreSQLTypedConfig; filePath?: string; isESM: boolean }> {
	const config = await resolveConfig(configFile, configRoot);
	return {
		config: setDefaultConfig(config.config ?? {}),
		filePath: config.filePath,
		isESM: config.isESM,
	};
}

export const DEFAULT_CONFIG: PostgreSQLTypedConfigFinal = setDefaultConfig({});

function setDefaultConfig(config?: Record<string, any>): PostgreSQLTypedConfigFinal {
	return {
		cli: setDefaultCLIConfig(config?.cli ?? {}),
	};
}
