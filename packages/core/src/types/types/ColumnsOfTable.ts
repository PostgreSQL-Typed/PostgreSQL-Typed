import type { PostgresData } from "../interfaces/PostgresData.js";
import type { TableLocations } from "./TableLocations.js";

export type ColumnsOfTable<
	InnerPostgresData extends PostgresData,
	Location extends TableLocations<InnerPostgresData>
> = Location extends `${infer DatabaseName}.${infer SchemaName}.${infer TableName}`
	? keyof InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"][TableName]["columns"]
	: never;
