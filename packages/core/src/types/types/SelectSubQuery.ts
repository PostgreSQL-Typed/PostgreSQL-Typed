import type { Database } from "../../classes/Database.js";
import type { DatabaseData } from "./DatabaseData.js";
import type { PostgresData } from "./PostgresData.js";

export type SelectSubQuery<InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData, Ready extends boolean> = {
	readonly query: string;
	readonly variables: (string | number | boolean)[];
	readonly variablesIndex: number;
	readonly usedTableLocations: string[];
	readonly database: Database<InnerPostgresData, InnerDatabaseData, Ready>;
};
