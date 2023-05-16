import { resolve } from "pathe";

import { PgTExtension } from "../../../../types/PgTExtension.js";

export interface PostgreSQLTypedCoreConfig {
	/**
	 * Define the root directory of your application.
	 *
	 * It is normally not needed to configure this option.
	 *
	 * @default process.cwd()
	 */
	rootDir: string;

	/**
	 * Define the source directory of your PostgreSQL-Typed application.
	 *
	 * If a relative path is specified, it will be relative to the `rootDir`.
	 *
	 * @default 'src/'
	 */
	srcDir: string;

	/**
	 * Used to fetch modules from node_modules. (For usage in extensions)
	 *
	 * The configuration path is relative to `options.rootDir` (default is current working directory).
	 *
	 * Setting this field may be necessary if your project is organized as a yarn workspace-styled mono-repository.
	 *
	 * @example
	 * ```js
	 * export default {
	 *   modulesDir: ['../../node_modules']
	 * }
	 * ```
	 */
	modulesDir: string[];

	/**
	 * Extensions which can extend its core functionality and add endless integrations.
	 *
	 * Each extension is either a string (which can refer to a package, or be a path to a file), a tuple with the extension as first string and the options as a second object, or an inline extension function.
	 * PostgreSQL-Typed tries to resolve each item in the extensions array using node require path (in `node_modules`) and then will be resolved from project `srcDir` if `~` alias is used.
	 *
	 * @note Extensions are executed sequentially so the order is important.
	 *
	 * @example
	 * ```js
	 * extensions: [
	 *   // Using package name
	 *   '@postgresql-typed/cache',
	 *   // Relative to your project srcDir
	 *   '~/extensions/awesome.js',
	 *   // Providing options
	 *   ['@postgresql-typed/cache', { uri: 'redis://user:pass@localhost:6379' }],
	 *   // Inline definition
	 *   function () {}
	 * ]
	 * ```
	 */
	extensions: (PgTExtension | string | [PgTExtension | string, Record<string, any>] | undefined | null | false)[];

	/**
	 * Alias for paths or packages.
	 *
	 * @example
	 * ```js
	 * export default {
	 *   alias: {
	 *     'extensions': fileURLToPath(new URL('./extensions', import.meta.url)),
	 *   }
	 * }
	 * ```
	 */
	alias: Record<string, string>;
}

export function setDefaultCoreConfig(config: Record<string, any>): PostgreSQLTypedCoreConfig {
	if (config.rootDir && typeof config.rootDir !== "string") delete config.host;
	if (config.srcDir && typeof config.srcDir !== "string") delete config.port;
	if (config.modulesDir && !Array.isArray(config.modulesDir)) delete config.modulesDir;
	if (config.extensions && !Array.isArray(config.extensions)) delete config.extensions;
	if (config.alias && (typeof config.alias !== "object" || Array.isArray(config.alias))) delete config.alias;

	const rootDirectory = config.rootDir ? resolve(config.rootDir) : process.cwd(),
		sourceDirectory = config.srcDir ? resolve(rootDirectory, config.srcDir) : resolve(rootDirectory, "src/"),
		modulesDirectory = config.modulesDir
			? [...config.modulesDir.map((directory: string) => resolve(rootDirectory, directory)), resolve(process.cwd(), "node_modules")]
			: [resolve(process.cwd(), "node_modules")],
		extensions = [...(config.extensions ?? [])].flat().filter(Boolean),
		alias = {
			"~": sourceDirectory,
			"@": sourceDirectory,
			...config.alias,
		};

	return {
		rootDir: rootDirectory,
		srcDir: sourceDirectory,
		modulesDir: modulesDirectory,
		extensions,
		alias,
	};
}
