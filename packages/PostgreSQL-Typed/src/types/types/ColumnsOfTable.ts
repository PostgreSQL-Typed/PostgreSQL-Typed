import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { TableLocationsByDatabase } from "./TableLocationsByDatabase.js";

export type ColumnsOfTable<
	InnerDatabaseData extends DatabaseData,
	Location extends TableLocationsByDatabase<InnerDatabaseData>
> = Location extends `${infer SchemaName}.${infer TableName}` ? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"] : never;
