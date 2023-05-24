import type { PgTPParser } from "@postgresql-typed/parsers";
import type { DatabaseData } from "@postgresql-typed/util";

import type { Tables } from "./Tables.js";

export type RawDatabaseData<InnerDatabaseData extends DatabaseData> = {
	name: InnerDatabaseData["name"];
	schemas: {
		name: keyof InnerDatabaseData["schemas"];
		tables: {
			name: Tables<InnerDatabaseData>;
			primary_key?: string;
			columns: {
				[ColumnName in keyof InnerDatabaseData["schemas"][keyof InnerDatabaseData["schemas"]]["tables"][Tables<InnerDatabaseData>]["columns"]]: ReturnType<
					typeof PgTPParser
				>;
			};
			insert_parameters: {
				[ColumnName in keyof InnerDatabaseData["schemas"][keyof InnerDatabaseData["schemas"]]["tables"][Tables<InnerDatabaseData>]["insert_parameters"]]: ReturnType<
					typeof PgTPParser
				>;
			};
		}[];
	}[];
};
