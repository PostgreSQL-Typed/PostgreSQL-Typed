import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocationsByDatabase } from "./TableLocationsByDatabase.js";

export type ColumnNamesOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocationsByDatabase<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? (keyof InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"])[] : [];
