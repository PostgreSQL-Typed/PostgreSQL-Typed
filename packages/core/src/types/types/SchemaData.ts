import type { TableData } from "./TableData.js";

export type SchemaData = {
	name: string;
	tables: {
		[table_name: string]: TableData;
	};
};
