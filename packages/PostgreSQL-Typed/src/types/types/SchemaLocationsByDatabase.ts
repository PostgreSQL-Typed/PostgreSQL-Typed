import { DatabaseData } from "../interfaces/DatabaseData.js";
import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";

export type SchemaLocationsByDatabase<InnerDatabaseData extends DatabaseData> = Join<
	NestedPaths<{
		[schema_name in keyof InnerDatabaseData["schemas"]]: string;
	}>,
	"."
>;
