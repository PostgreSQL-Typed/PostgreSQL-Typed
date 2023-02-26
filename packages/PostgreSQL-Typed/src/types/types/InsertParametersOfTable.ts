import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocationsFromDatabase } from "./TableLocationsFromDatabase.js";

export type InsertParametersOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocationsFromDatabase<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["insert_parameters"] : never;
