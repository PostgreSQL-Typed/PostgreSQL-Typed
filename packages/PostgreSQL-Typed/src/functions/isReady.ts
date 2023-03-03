import { Client } from "../index.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";

export function isReady<InnerPostgresData extends PostgresData>(client: Client<InnerPostgresData, boolean>): client is Client<InnerPostgresData, true> {
	return client.ready;
}
