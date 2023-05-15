import { loadConfig, type LoadConfigOptions } from "c12";

import type { PgTConfig, PgTConfigSchema } from "./index.js";
import { setDefaultConfig } from "./setDefaultConfig.js";

export type LoadPgTConfigOptions = LoadConfigOptions<PgTConfig>;

export async function loadPGTConfig(options: LoadPgTConfigOptions): Promise<{ config: PgTConfigSchema; configFile?: string; cwd?: string }> {
	const result = await loadConfig<PgTConfig>({
		name: "pgt",
		configFile: "pgt.config",
		rcFile: ".pgtrc",
		dotenv: true,
		globalRc: true,
		...options,
	});

	return {
		config: setDefaultConfig(result.config ?? {}),
		configFile: result.configFile,
		cwd: result.cwd,
	};
}
