import type { Parsers } from "@postgresql-typed/parsers";

import { getRawJoinQuery } from "../functions/getRawJoinQuery.js";
import { getRawSelectQuery } from "../functions/getRawSelectQuery.js";
import { getRawWhereQuery } from "../functions/getRawWhereQuery.js";
import { getTableIdentifier } from "../functions/getTableIdentifier.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import type { GroupBy } from "../types/types/GroupBy.js";
import type { JoinQuery } from "../types/types/JoinQuery.js";
import type { OrderBy } from "../types/types/OrderBy.js";
import type { Query } from "../types/types/Query.js";
import type { SafeQuery } from "../types/types/SafeQuery.js";
import type { SelectQuery } from "../types/types/SelectQuery.js";
import { SelectQueryOptions } from "../types/types/SelectQueryOptions.js";
import { SelectQueryResponse } from "../types/types/SelectQueryResponse.js";
import type { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards.js";
import type { WhereQuery } from "../types/types/WhereQuery.js";
import type { BaseClient } from "./BaseClient.js";
import type { Table } from "./Table.js";

export class SelectBuilder<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>
> {
	tables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[] = [];

	private _joins: {
		query: string;
		variables: (Parsers | string)[];
		tableLocation: string;
	}[] = [];
	private _where: {
		query: string;
		variables: (Parsers | string)[];
	} = {
		query: "",
		variables: [],
	};
	private _groupBy = "";
	private _limit = "";
	private _fetch = "";

	constructor(
		private readonly client: BaseClient<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		readonly table: JoinedTables
	) {
		this.tables.push(table);
	}

	join<
		JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
		Filter extends JoinQuery<JoinedTables, JoinedTable> = JoinQuery<JoinedTables, JoinedTable>
	>(
		table: JoinedTable,
		filter: Filter
		//TODO add a way to get the raw query from the on object and add it to the Query type
	): SelectBuilder<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable> {
		//TODO make sure input is valid

		//* Make sure the tables are in the same database
		if (table.database.name !== this.databaseData.name) {
			//TODO make this a custom error
			throw new Error("Cannot join tables from different databases");
		}

		//* Make sure the tables aren't already joined
		if (this.tables.some(t => t.location === table.location)) {
			//TODO make this a custom error
			throw new Error("Cannot join the same table twice");
		}

		this._joins.push(getRawJoinQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, JoinedTable>(filter, table, this.tables));
		this.tables.push(table);
		return this as any;
	}

	where(where: WhereQuery<JoinedTables, TableColumnsFromSchemaOnwards<JoinedTables>>) {
		//TODO make sure input is valid

		const rawQuery = getRawWhereQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, TableColumnsFromSchemaOnwards<JoinedTables>>(
			where,
			this.tables
		);
		this._where = {
			query: `WHERE ${rawQuery.query}`,
			variables: rawQuery.variables,
		};

		return this;
	}

	groupBy(groupBy: GroupBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>) {
		//TODO make sure input is valid

		this._groupBy = `GROUP BY ${Array.isArray(groupBy) ? [...new Set(groupBy)].join(", ") : groupBy}`;

		return this;
	}

	//TODO
	//having() { }

	orderBy(orderBy: OrderBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>) {
		//TODO make sure input is valid

		const { columns, nulls } = orderBy,
			orderByColumns = columns ? Object.entries(columns).map(([column, direction]) => `${column} ${direction}`) : undefined;

		this._groupBy = `ORDER BY${orderByColumns ? ` ${orderByColumns.join(", ")}` : ""}${nulls ? ` ${nulls}` : ""}`;

		return this;
	}

	limit(limit: number, offset?: number) {
		//TODO make sure input is valid

		this._limit = offset ? `LIMIT ${limit}\nOFFSET ${offset}` : `LIMIT ${limit}`;

		return this;
	}

	fetch(fetch: { fetch: number; type?: "FIRST" | "NEXT"; offset?: number }) {
		//TODO make sure input is valid
		fetch.type ??= "FIRST";

		const { fetch: fetchAmount, type, offset } = fetch,
			fetchString = `FETCH ${type} ${fetchAmount} ${fetchAmount > 1 ? "ROWS" : "ROW"} ONLY`;

		this._fetch = offset ? `OFFSET ${offset} ${offset > 1 ? "ROWS" : "ROW"}\n${fetchString}` : fetchString;

		return this;
	}

	execute<Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>>(
		select?: Select
	): Promise<SafeQuery<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, false>>>>;
	execute<
		Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>,
		Options extends SelectQueryOptions = SelectQueryOptions
	>(select: Select, options?: Options & { raw: true }): string;
	execute<
		Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>,
		Options extends SelectQueryOptions = SelectQueryOptions
	>(
		select: Select,
		options?: Options & { raw?: false; valuesOnly: true }
	): Promise<SafeQuery<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, true>>>>;
	execute<
		Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>,
		Options extends SelectQueryOptions = SelectQueryOptions
	>(
		select: Select,
		options?: Options & { raw?: false; valuesOnly?: false }
	): Promise<SafeQuery<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, false>>>>;
	execute<
		Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>,
		Options extends SelectQueryOptions = SelectQueryOptions
	>(
		//@ts-expect-error It can be initialized as "*"
		select: Select = "*",
		options?: Options
	) {
		const tableLocation = this.table.location.split(".").slice(1).join("."),
			usedTableLocations: string[] = [];

		let query = `SELECT ${getRawSelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>, Select>(select as Select)}\nFROM ${tableLocation} %${tableLocation}%${
			this._joins.length > 0 ? `\n${this._joins.map(join => join.query).join("\n")}` : ""
		}${this._where.query ? `\n${this._where.query}` : ""}${this._groupBy ? `\n${this._groupBy}` : ""}${this._limit ? `\n${this._limit}` : ""}${
			this._fetch ? `\n${this._fetch}` : ""
		}`;

		//* Replace the table locations with the short names
		const mainTableShort = getTableIdentifier(tableLocation, usedTableLocations);
		query = query.replaceAll(`%${tableLocation}%`, mainTableShort).replaceAll(`${tableLocation}.`, `${mainTableShort}.`);
		usedTableLocations.push(mainTableShort);

		for (const join of this._joins) {
			const joinTableShort = getTableIdentifier(join.tableLocation, usedTableLocations);
			query = query.replaceAll(`%${join.tableLocation}%`, joinTableShort).replaceAll(`${join.tableLocation}.`, `${joinTableShort}.`);
			usedTableLocations.push(joinTableShort);
		}

		//* Replace all ? with $1, $2, etc
		const count = query.match(/%\?%/g)?.length ?? 0;
		for (let index = 1; index <= count; index++) query = query.replace("%?%", `$${index}`);

		return options?.raw
			? query
			: this.client.safeQuery(query, [
					...this._where.variables.map(variable => {
						if (typeof variable !== "string") return variable.value;
						return variable;
					}),
					...this._joins.flatMap(join =>
						join.variables.map(variable => {
							if (typeof variable !== "string") return variable.value;
							return variable;
						})
					),
			  ]);
	}
}
