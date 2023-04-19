import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";
import type { PostgresData } from "./PostgresData.js";
import type { TableLocations } from "./TableLocations.js";

type TableLocationByPathInner<
	InnerPostgresData extends PostgresData,
	DatabaseName extends keyof InnerPostgresData,
	SchemaName extends keyof InnerPostgresData[DatabaseName]["schemas"],
	TableName extends keyof InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"] = keyof InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"]
> = Join<
	NestedPaths<{
		[databaseName in DatabaseName]: {
			[schemaName in SchemaName]: {
				[tableName in TableName]: string;
			};
		};
	}>,
	"."
>;

export type TableLocationByPath<
	InnerPostgresData extends PostgresData,
	DatabaseName extends keyof InnerPostgresData,
	SchemaName extends keyof InnerPostgresData[DatabaseName]["schemas"],
	TableName extends keyof InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"] = keyof InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"],
	TableLocation = TableLocationByPathInner<InnerPostgresData, DatabaseName, SchemaName, TableName>
> = TableLocation extends TableLocations<InnerPostgresData> ? TableLocation : never;
