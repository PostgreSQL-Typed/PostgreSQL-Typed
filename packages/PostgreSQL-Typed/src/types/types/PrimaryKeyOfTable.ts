import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocationsFromDatabase } from "./TableLocationsFromDatabase.js";

export type PrimaryKeyOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocationsFromDatabase<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["primary_key"] : never;
