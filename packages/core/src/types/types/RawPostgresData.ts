import type { PostgresData } from "./PostgresData.js";
import type { RawDatabaseData } from "./RawDatabaseData.js";

export type RawPostgresData<InnerPostgresData extends PostgresData> = {
	[database_name in keyof InnerPostgresData]: RawDatabaseData<InnerPostgresData[database_name]>;
};
