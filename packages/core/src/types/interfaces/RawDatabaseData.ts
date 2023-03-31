import type { PGTPParser } from "@postgresql-typed/parsers";

import type { Tables } from "../types/Tables.js";
import type { DatabaseData } from "./DatabaseData.js";

export type RawDatabaseData<InnerDatabaseData extends DatabaseData> = {
	name: InnerDatabaseData["name"];
	schemas: {
		name: keyof InnerDatabaseData["schemas"];
		tables: {
			name: Tables<InnerDatabaseData>;
			primary_key?: string;
			columns: {
				[ColumnName in keyof InnerDatabaseData["schemas"][keyof InnerDatabaseData["schemas"]]["tables"][Tables<InnerDatabaseData>]["columns"]]: ReturnType<
					typeof PGTPParser
				>;
			};
			insert_parameters: {
				[ColumnName in keyof InnerDatabaseData["schemas"][keyof InnerDatabaseData["schemas"]]["tables"][Tables<InnerDatabaseData>]["insert_parameters"]]: ReturnType<
					typeof PGTPParser
				>;
			};
		}[];
	}[];
};
