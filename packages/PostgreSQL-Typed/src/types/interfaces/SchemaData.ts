import type { TableData } from "../interfaces/TableData.js";

export interface SchemaData {
	name: string;
	tables: {
		[table_name: string]: TableData;
	};
}
