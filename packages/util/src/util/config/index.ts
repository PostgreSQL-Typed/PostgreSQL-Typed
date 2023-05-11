export const DEFAULT_CONFIG_FILES = [
	"postgresql-typed.config.js",
	"postgresql-typed.config.mjs",
	"postgresql-typed.config.ts",
	"postgresql-typed.config.cjs",
	"postgresql-typed.config.mts",
	"postgresql-typed.config.cts",
];

export const DEFAULT_CONFIG_FILE = "postgresql-typed.config.ts";
export const DEFAULT_CONFIG_FILE_RAW = `import { defineConfig } from "@postgresql-typed/cli/lib/config";

export default defineConfig({});`;

export * from "./configs/index.js";
export * from "./defineConfig.js";
export * from "./getConfig.js";
