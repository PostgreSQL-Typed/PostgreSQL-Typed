import type { TableData } from "./TableData.js";

export interface SchemaData {
	name: string;
	tables: {
		[table_name: string]: TableData;
	};
}
