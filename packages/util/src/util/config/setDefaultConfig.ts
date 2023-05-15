import { setDefaultCLIConfig } from "./configs/cli/index.js";
import { setDefaultCoreConfig } from "./configs/core/index.js";
import type { PgTConfigSchema } from "./index.js";

export function setDefaultConfig(config: Record<string, any>): PgTConfigSchema {
	if (typeof config !== "object" || Array.isArray(config)) config = {};
	if (typeof config.cli !== "object" || Array.isArray(config.cli)) config.cli = {};
	if (typeof config.core !== "object" || Array.isArray(config.core)) config.core = {};

	return {
		cli: setDefaultCLIConfig(config.cli),
		core: setDefaultCoreConfig(config.core),
	};
}
