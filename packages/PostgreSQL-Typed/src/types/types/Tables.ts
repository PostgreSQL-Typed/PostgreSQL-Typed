import type { DatabaseData } from "../interfaces/DatabaseData";
import type { LastPath } from "../types/LastPath";
import type { NestedPaths } from "../types/NestedPaths";

export type Tables<DbData extends DatabaseData> = LastPath<
	NestedPaths<{
		[schema_name in keyof DbData["schemas"]]: {
			[table_name in keyof DbData["schemas"][schema_name]["tables"]]: string;
		};
	}>
>;
