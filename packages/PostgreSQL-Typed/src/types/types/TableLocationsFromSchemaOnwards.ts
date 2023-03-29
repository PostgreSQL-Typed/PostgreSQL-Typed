import type { Table } from "../../classes/Table.js";
import type { TableLocations } from "./TableLocations.js";

export type TableLocationsFromSchemaOnwards<
	Tables extends Table<any, any, any, any, any>,
	TableLocation extends TableLocations<any> = Tables extends Table<any, any, any, any, infer TableLocation> ? TableLocation : never,
	SchemaName extends string = TableLocation extends `${string}.${infer Schema}.${string}` ? Schema : never,
	TableName extends string = TableLocation extends `${string}.${string}.${infer Table}` ? Table : never
> = TableLocation extends `${string}.${string}.${string}` ? `${SchemaName}.${TableName}` : never;
