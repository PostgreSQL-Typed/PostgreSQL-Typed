import type { BaseClient } from "../classes/BaseClient.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";

export function isReady<InnerPostgresData extends PostgresData>(client: BaseClient<InnerPostgresData, boolean>): client is BaseClient<InnerPostgresData, true> {
	return client.ready;
}
