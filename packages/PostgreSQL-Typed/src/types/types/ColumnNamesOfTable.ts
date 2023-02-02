import type { DatabaseData } from "../interfaces/DatabaseData";
import type { TableLocations } from "../types/TableLocations";

export type ColumnNamesOfTable<DbData extends DatabaseData, Location extends TableLocations<DbData>> = Location extends `${infer SchemaName}.${infer TableName}`
	? (keyof DbData["schemas"][SchemaName]["tables"][TableName]["columns"])[]
	: [];
