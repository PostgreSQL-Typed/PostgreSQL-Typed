import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { SelectQuery } from "../types/types/SelectQuery.js";

export function getRawSelectQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	Select extends SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables> = SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>
>(select: Select): string {
	if (typeof select === "string") return select;
	if (Array.isArray(select)) return select.join(",\n");

	const rows: string[] = [];
	for (const [key, value] of Object.entries(select) as [
		string,
		(
			| {
					alias?: string;
					distinct?: boolean | "ON";
			  }
			| true
			| undefined
		)
	][]) {
		if (value === true) rows.push(key);
		else if (value?.distinct) {
			if (value.distinct === "ON") rows.push(`DISTINCT ON (${key}) ${value.alias ?? key}`);
			else if (value.alias) rows.push(`DISTINCT ${key} AS ${value.alias}`);
			else rows.push(`DISTINCT ${key}`);
		} else if (value?.alias) rows.push(`${key} AS ${value.alias}`);
		else rows.push(key);
	}

	return rows.join(",\n");
}
