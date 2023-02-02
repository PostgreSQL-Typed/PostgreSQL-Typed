import type { DatabaseData } from "../interfaces/DatabaseData";
import type { Join } from "../types/Join";
import type { NestedPaths } from "../types/NestedPaths";

export type TableLocations<DbData extends DatabaseData> = Join<
	NestedPaths<{
		[schema_name in keyof DbData["schemas"]]: {
			[table_name in keyof DbData["schemas"][schema_name]["tables"]]: string;
		};
	}>,
	"."
>;
