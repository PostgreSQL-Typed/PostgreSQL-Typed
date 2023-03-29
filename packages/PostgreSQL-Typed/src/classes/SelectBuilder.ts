import type { PendingQuery } from "postgres";

import { getRawJoinQuery } from "../functions/getRawJoinQuery.js";
import { getRawSelectQuery } from "../functions/getRawSelectQuery.js";
import { getRawWhereQuery } from "../functions/getRawWhereQuery.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import type { GroupBy } from "../types/types/GroupBy.js";
import type { JoinQuery } from "../types/types/JoinQuery.js";
import type { OrderBy } from "../types/types/OrderBy.js";
import type { SelectQuery } from "../types/types/SelectQuery.js";
import type { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards.js";
import type { WhereQuery } from "../types/types/WhereQuery.js";
import type { Client } from "./Client.js";
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
		variables: unknown[];
	}[] = [];
	private _where = {
		query: "",
		variables: [] as unknown[],
	};
	private _groupBy = "";
	private _limit = "";
	private _fetch = "";

	constructor(
		private readonly client: Client<InnerPostgresData, Ready>,
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

		this.tables.push(table);
		this._joins.push(getRawJoinQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, JoinedTable>(filter, table));
		return this as any;
	}

	where(where: WhereQuery<JoinedTables, TableColumnsFromSchemaOnwards<JoinedTables>>) {
		//TODO make sure input is valid

		const rawQuery = getRawWhereQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, TableColumnsFromSchemaOnwards<JoinedTables>>(where);
		this._where = {
			query: `WHERE ${rawQuery.query}`,
			variables: rawQuery.variables,
		};

		return this;
	}

	groupBy(groupBy: GroupBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>) {
		//TODO make sure input is valid

		this._groupBy = `GROUP BY ${Array.isArray(groupBy) ? [...new Set(groupBy)].join(",") : groupBy}`;

		return this;
	}

	//TODO
	//having() { }

	orderBy(orderBy: OrderBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>) {
		//TODO make sure input is valid

		const { columns, nulls } = orderBy,
			orderByColumns = columns ? Object.entries(columns).map(([column, direction]) => `${column} ${direction}`) : undefined;

		this._groupBy = `ORDER BY${orderByColumns ? ` ${orderByColumns.join(",")}` : ""}${nulls ? ` ${nulls}` : ""}`;

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

	execute(): PendingQuery<any[]>;
	execute(select: SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>): PendingQuery<any[]>;
	execute(select: SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>, rawQuery: true): string;
	execute(select: SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>, rawQuery: false): PendingQuery<any[]>;
	execute<
		Select extends SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables> = SelectQuery<
			InnerPostgresData,
			InnerDatabaseData,
			Ready,
			JoinedTables
		>
	>(select: SelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables> = "*", rawQuery = false) {
		const query = `SELECT ${getRawSelectQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, Select>(select as Select)}\nFROM ${this.table.location
			.split(".")
			.slice(1)
			.join(".")}${this._joins.length > 0 ? `\n${this._joins.map(join => join.query).join("\n")}` : ""}\n${this._where.query}${
			this._groupBy ? `\n${this._groupBy}` : ""
		}${this._limit ? `\n${this._limit}` : ""}${this._fetch ? `\n${this._fetch}` : ""}`;

		return rawQuery ? query : this.client.client.unsafe(query, [...this._where.variables, ...this._joins.flatMap(join => join.variables)] as any[]);
	}
}
