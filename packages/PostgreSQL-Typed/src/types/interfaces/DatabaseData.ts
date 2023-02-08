import type { SchemaData } from "../interfaces/SchemaData.js";

export interface DatabaseData {
	name: string;
	schemas: {
		[schema_name: string]: SchemaData;
	};
}
