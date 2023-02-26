import type { TableData } from "../interfaces/TableData.js";

export type SchemaData = {
	name: string;
	tables: {
		[table_name: string]: TableData;
	};
};
