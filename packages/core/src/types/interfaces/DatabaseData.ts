import type { SchemaData } from "./SchemaData.js";

export type DatabaseData = {
	name: string;
	schemas: {
		[schema_name: string]: SchemaData;
	};
};
