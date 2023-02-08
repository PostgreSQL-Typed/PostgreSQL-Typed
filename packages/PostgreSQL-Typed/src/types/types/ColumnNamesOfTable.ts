import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocations } from "../types/TableLocations.js";

export type ColumnNamesOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocations<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? (keyof InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"])[] : [];
