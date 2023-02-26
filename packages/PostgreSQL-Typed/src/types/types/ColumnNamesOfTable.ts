import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocationsFromDatabase } from "./TableLocationsFromDatabase.js";

export type ColumnNamesOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocationsFromDatabase<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? (keyof InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"])[] : [];
