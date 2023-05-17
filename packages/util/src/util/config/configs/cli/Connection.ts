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
