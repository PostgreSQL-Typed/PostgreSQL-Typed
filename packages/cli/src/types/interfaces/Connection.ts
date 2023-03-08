import { z } from "zod";

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

export const zConnection = z.object({
	host: z.string().default("postgres"),
	port: z.number().min(0).max(65_535).default(5432),
	user: z.string().default("postgres"),
	password: z.optional(z.string()),
	database: z.string().default("postgres"),
});
