import type { ClassDetails } from "../interfaces/ClassDetails";
import type { Table } from "../interfaces/Table";
import type { DataType } from "../types/DataType";

export interface FetchedData {
	tables: Table[];
	types: DataType[];
	classes: ClassDetails[];
}
