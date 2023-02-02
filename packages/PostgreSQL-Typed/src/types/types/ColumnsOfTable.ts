import type { DatabaseData } from "../interfaces/DatabaseData";
import type { TableLocations } from "../types/TableLocations";

export type ColumnsOfTable<DbData extends DatabaseData, Location extends TableLocations<DbData>> = Location extends `${infer SchemaName}.${infer TableName}`
	? DbData["schemas"][SchemaName]["tables"][TableName]["columns"]
	: never;
