import type { DatabaseData } from "./DatabaseData.js";

export type PostgresData = {
	[databaseName: string]: DatabaseData;
};
