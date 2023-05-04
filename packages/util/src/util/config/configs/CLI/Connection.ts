export interface Connection {
	/**
	 * The hostname of the postgres database
	 * @default "postgres"
	 */
	host: string;

	/**
	 * The port of the postgres database
	 * @default 5432
	 */
	port: number;

	/**
	 * The username of the postgres database
	 * @default "postgres"
	 */
	user: string;

	/**
	 * The password of the postgres database
	 * @default undefined
	 */
	password?: string;

	/**
	 * The name of the postgres database
	 * @default "postgres"
	 */
	database: string;
}

export function setDefaultConnection(config: Record<string, any>): Connection {
	if (config.host && typeof config.host !== "string") delete config.host;
	if (config.port && typeof config.port !== "number") delete config.port;
	if (config.user && typeof config.user !== "string") delete config.user;
	if (config.password && typeof config.password !== "string") delete config.password;
	if (config.database && typeof config.database !== "string") delete config.database;

	return {
		host: config.host ?? "postgres",
		port: config.port ?? 5432,
		user: config.user ?? "postgres",
		password: config.password,
		database: config.database ?? "postgres",
	};
}
