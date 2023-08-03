import { loadConfig, type LoadConfigOptions } from "c12";

import type { PgTConfig, PgTConfigSchema } from "./index.js";
import { setDefaultConfig } from "./setDefaultConfig.js";

export type LoadPgTConfigOptions = LoadConfigOptions<PgTConfig>;

export async function loadPgTConfig(options?: LoadPgTConfigOptions): Promise<{ config: PgTConfigSchema; configFile?: string; cwd?: string }> {
	let result = await loadConfig<PgTConfig>({
		configFile: "pgt.config",
		dotenv: true,
		globalRc: true,
		name: "pgt",
		rcFile: ".pgtrc",
		...options,
	});

	if (!result.config || Object.keys(result.config).length === 0) {
		result = await loadConfig<PgTConfig>({
			configFile: "postgresql-typed.config",
			dotenv: true,
			globalRc: true,
			name: "postgresql-typed",
			rcFile: ".postgresql-typedrc",
			...options,
		});
	}

	return {
		config: await setDefaultConfig(result.config ?? {}),
		configFile: !result.config || Object.keys(result.config).length === 0 ? undefined : result.configFile,
		cwd: !result.config || Object.keys(result.config).length === 0 ? undefined : result.cwd,
	};
}
