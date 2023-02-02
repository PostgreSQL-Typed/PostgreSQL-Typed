import type { SchemaData } from "../interfaces/SchemaData";

export interface DatabaseData {
	name: string;
	schemas: {
		[schema_name: string]: SchemaData;
	};
}
