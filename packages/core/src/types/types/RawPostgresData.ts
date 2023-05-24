import type { PostgresData } from "@postgresql-typed/util";

import type { RawDatabaseData } from "./RawDatabaseData.js";

export type RawPostgresData<InnerPostgresData extends PostgresData> = {
	[database_name in keyof InnerPostgresData]: RawDatabaseData<InnerPostgresData[database_name]>;
};
