import type { TableData } from "../interfaces/TableData";

export interface SchemaData {
	name: string;
	tables: {
		[table_name: string]: TableData;
	};
}
