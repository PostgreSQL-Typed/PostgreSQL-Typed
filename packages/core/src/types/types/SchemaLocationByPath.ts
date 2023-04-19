import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";
import type { PostgresData } from "./PostgresData.js";
import type { SchemaLocations } from "./SchemaLocations.js";

type SchemaLocationByPathInner<
	InnerPostgresData extends PostgresData,
	DatabaseName extends keyof InnerPostgresData,
	SchemaName extends keyof InnerPostgresData[DatabaseName]["schemas"] = keyof InnerPostgresData[DatabaseName]["schemas"]
> = Join<
	NestedPaths<{
		[databaseName in DatabaseName]: {
			[schemaName in SchemaName]: string;
		};
	}>,
	"."
>;

export type SchemaLocationByPath<
	InnerPostgresData extends PostgresData,
	DatabaseName extends keyof InnerPostgresData,
	SchemaName extends keyof InnerPostgresData[DatabaseName]["schemas"] = keyof InnerPostgresData[DatabaseName]["schemas"],
	SchemaLocation = SchemaLocationByPathInner<InnerPostgresData, DatabaseName, SchemaName>
> = SchemaLocation extends SchemaLocations<InnerPostgresData> ? SchemaLocation : never;
