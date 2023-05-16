import type { SchemaData } from "./SchemaData.js";

export interface DatabaseData {
	name: string;
	schemas: {
		[schema_name: string]: SchemaData;
	};
}
