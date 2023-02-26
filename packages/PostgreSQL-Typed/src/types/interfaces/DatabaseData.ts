import type { SchemaData } from "../interfaces/SchemaData.js";

export type DatabaseData = {
	name: string;
	schemas: {
		[schema_name: string]: SchemaData;
	};
};
