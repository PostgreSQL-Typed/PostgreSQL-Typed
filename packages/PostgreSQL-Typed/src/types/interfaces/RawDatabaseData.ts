import type { Tables } from "../types/Tables.js";
import type { DatabaseData } from "./DatabaseData.js";

export type RawDatabaseData<InnerDatabaseData extends DatabaseData> = {
	name: InnerDatabaseData["name"];
	schemas: {
		name: keyof InnerDatabaseData["schemas"];
		tables: {
			name: Tables<InnerDatabaseData>;
			primary_key?: string;
		}[];
	}[];
};
