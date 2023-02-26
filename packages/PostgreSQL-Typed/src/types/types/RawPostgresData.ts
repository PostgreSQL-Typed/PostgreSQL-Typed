import { PostgresData } from "../interfaces/PostgresData.js";
import { RawDatabaseData } from "../interfaces/RawDatabaseData.js";

export type RawPostgresData<InnerPostgresData extends PostgresData> = {
	[database_name in keyof InnerPostgresData]: RawDatabaseData<InnerPostgresData[database_name]>;
};
