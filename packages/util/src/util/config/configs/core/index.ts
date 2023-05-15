export interface PostgreSQLTypedCoreConfig {
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
}

export function setDefaultCoreConfig(config: Record<string, any>): PostgreSQLTypedCoreConfig {
	return {
		extensions: config.extensions ?? [],
	};
}
