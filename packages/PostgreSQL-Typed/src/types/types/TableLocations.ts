import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { Join } from "../types/Join.js";
import type { NestedPaths } from "../types/NestedPaths.js";

export type TableLocations<InnerDatabaseData extends DatabaseData> = Join<
	NestedPaths<{
		[schema_name in keyof InnerDatabaseData["schemas"]]: {
			[table_name in keyof InnerDatabaseData["schemas"][schema_name]["tables"]]: string;
		};
	}>,
	"."
>;
