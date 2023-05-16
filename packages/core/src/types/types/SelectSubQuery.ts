import type { DatabaseData, PostgresData } from "@postgresql-typed/util";

import type { Database } from "../../classes/Database.js";

export type SelectSubQuery<InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData, Ready extends boolean> = {
	readonly query: string;
	readonly variables: string[];
	readonly variablesIndex: number;
	readonly usedTableLocations: string[];
	readonly database: Database<InnerPostgresData, InnerDatabaseData, Ready>;
};
