import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";

export type TableLocationsByDatabase<InnerDatabaseData extends DatabaseData> = Join<
	NestedPaths<{
		[schema_name in keyof InnerDatabaseData["schemas"]]: {
			[table_name in keyof InnerDatabaseData["schemas"][schema_name]["tables"]]: string;
		};
	}>,
	"."
>;
