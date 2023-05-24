import type { PostgresData } from "@postgresql-typed/util";

import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";

export type SchemaLocations<InnerPostgresData extends PostgresData> = Join<
	NestedPaths<{
		[database_name in keyof InnerPostgresData]: {
			[schema_name in keyof InnerPostgresData[database_name]["schemas"]]: string;
		};
	}>,
	"."
>;
