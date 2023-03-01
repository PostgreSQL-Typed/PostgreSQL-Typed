import { DatabaseData } from "../interfaces/DatabaseData.js";
import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";

export type SchemaLocationsByDatabaseWithDatabase<InnerDatabaseData extends DatabaseData> = Join<
	NestedPaths<{
		[database_name in InnerDatabaseData["name"]]: {
			[schema_name in keyof InnerDatabaseData["schemas"]]: string;
		};
	}>,
	"."
>;
