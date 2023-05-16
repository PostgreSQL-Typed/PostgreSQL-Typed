import type { PostgresData } from "@postgresql-typed/util";

import type { BaseClient } from "../classes/BaseClient.js";

export function isReady<InnerPostgresData extends PostgresData>(client: BaseClient<InnerPostgresData, boolean>): client is BaseClient<InnerPostgresData, true> {
	return client.ready;
}
