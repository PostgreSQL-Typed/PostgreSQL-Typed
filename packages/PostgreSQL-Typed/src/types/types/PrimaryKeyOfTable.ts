import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocations } from "../types/TableLocations.js";

export type PrimaryKeyOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocations<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["primary_key"] : never;
