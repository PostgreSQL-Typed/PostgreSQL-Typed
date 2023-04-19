import type { Database } from "../../classes/Database.js";
import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { PostgresData } from "../interfaces/PostgresData.js";

export type NestedSelectQuery<InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData, Ready extends boolean> = {
	readonly query: string;
	readonly variables: (string | number | boolean)[];
	readonly variablesIndex: number;
	readonly usedTableLocations: string[];
	readonly database: Database<InnerPostgresData, InnerDatabaseData, Ready>;
};
