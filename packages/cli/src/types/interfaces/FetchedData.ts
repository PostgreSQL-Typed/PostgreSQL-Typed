import type { ClassDetails } from "../interfaces/ClassDetails.js";
import type { Table } from "../interfaces/Table.js";
import type { DataType } from "../types/DataType.js";

export interface FetchedData {
	database: string;
	tables: Table[];
	types: DataType[];
	classes: ClassDetails[];
}
