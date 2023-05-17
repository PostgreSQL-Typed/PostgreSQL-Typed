import { resolve } from "pathe";
import { defineUntypedSchema, SchemaDefinition } from "untyped";

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

const schema: SchemaDefinition = defineUntypedSchema({
	rootDir: {
		$default: process.cwd(),
		$resolve: value => (typeof value === "string" ? resolve(value) : process.cwd()),
	},
	srcDir: {
		$default: "src/",
		$resolve: async (value, get) => resolve(await get("rootDir"), value || "."),
	},
	modulesDir: {
		$default: ["node_modules"],
		$resolve: async (values, get) => [
			...(await Promise.all(values.map(async (directory: string) => resolve(await get("rootDir"), directory)))),
			resolve(process.cwd(), "node_modules"),
		],
	},
	extensions: {
		$resolve: values => (Array.isArray(values) ? values.filter(Boolean) : []),
	},
	alias: {
		$default: {},
		$resolve: async (value, get) => ({
			"~": await get("srcDir"),
			"@": await get("srcDir"),
			...value,
		}),
	},
});
export default schema;
