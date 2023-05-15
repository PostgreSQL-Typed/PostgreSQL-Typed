import type { PgTConfigSchema } from "./index.js";
import { setDefaultConfig } from "./setDefaultConfig.js";

export const DEFAULT_CONFIG_FILE = "postgresql-typed.config.ts";
export const DEFAULT_CONFIG_FILE_RAW = `import { defineConfig } from "@postgresql-typed/cli/lib/config";

export default defineConfig({});`;
export const DEFAULT_CONFIG: PgTConfigSchema = setDefaultConfig({});

export * from "./configs/index.js";
export * from "./loadPgTConfig.js";
