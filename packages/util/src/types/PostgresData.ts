import type { DatabaseData } from "./DatabaseData.js";

export interface PostgresData {
	[databaseName: string]: DatabaseData;
}
