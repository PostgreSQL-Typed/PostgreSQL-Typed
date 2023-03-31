import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { LastPath } from "./LastPath.js";
import type { NestedPaths } from "./NestedPaths.js";

export type Tables<InnerDatabaseData extends DatabaseData> = LastPath<
	NestedPaths<{
		[schema_name in keyof InnerDatabaseData["schemas"]]: {
			[table_name in keyof InnerDatabaseData["schemas"][schema_name]["tables"]]: string;
		};
	}>
>;
