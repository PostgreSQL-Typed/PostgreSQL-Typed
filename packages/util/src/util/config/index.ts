export const DEFAULT_CONFIG_FILE = "pgt.config.ts";
export const DEFAULT_CONFIG_FILE_RAW = `import { defineConfig } from "@postgresql-typed/cli/config";

export default defineConfig({
	cli: {
		connections: [
			process.env.DATABASE_URI
		],
	},
});`;

export * from "./configs/index.js";
export * from "./loadPgTConfig.js";
