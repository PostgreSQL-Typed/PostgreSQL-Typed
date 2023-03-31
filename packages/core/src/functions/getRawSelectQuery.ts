import type { SelectQuery } from "../types/types/SelectQuery.js";

export function getRawSelectQuery<TableColumns extends string, Select extends SelectQuery<TableColumns> = SelectQuery<TableColumns>>(select: Select): string {
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
