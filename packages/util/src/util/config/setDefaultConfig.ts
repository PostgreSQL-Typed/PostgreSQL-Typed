import { applyDefaults, SchemaDefinition } from "untyped";

import cliSchema from "./configs/cli/index.js";
import coreSchema from "./configs/core/index.js";
import type { PgTConfigSchema } from "./index.js";

export async function setDefaultConfig(config: Record<string, any>): Promise<PgTConfigSchema> {
	const schema: SchemaDefinition = {
		cli: cliSchema,
		core: coreSchema,
	};

	return (await applyDefaults(schema, config)) as PgTConfigSchema;
}
