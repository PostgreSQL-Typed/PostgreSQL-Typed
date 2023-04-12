import type { Parsers, PGTPError } from "@postgresql-typed/parsers";

import { getPGTError } from "../functions/getPGTError.js";
import { getRawGroupBy } from "../functions/getRawGroupBy.js";
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
import type { Safe } from "../types/types/Safe.js";
import type { SelectQuery } from "../types/types/SelectQuery.js";
import type { SelectQueryOptions } from "../types/types/SelectQueryOptions.js";
import type { SelectQueryResponse } from "../types/types/SelectQueryResponse.js";
import type { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards.js";
import type { WhereQuery } from "../types/types/WhereQuery.js";
import type { PGTError } from "../util/PGTError.js";
import type { BaseClient } from "./BaseClient.js";
import { Table } from "./Table.js";

export class SelectBuilder<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>
> {
	tables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[] = [];

	private _joins: Safe<
		{
			query: string;
			variables: (Parsers | string)[];
			tableLocation: string;
		},
		PGTError | PGTPError
	>[] = [];
	private _where:
		| Safe<
				{
					query: string;
					variables: (Parsers | string)[];
				},
				PGTError | PGTPError
		  >
		| undefined;
	private _groupBy: Safe<string> | undefined;
	private _limit: Safe<string> | undefined;
	private _fetch: Safe<string> | undefined;

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
		if (!(table instanceof Table)) {
			this._joins.push({
				success: false,
				error: getPGTError({
					code: "invalid_join",
					type: "class",
				}),
			});
			return this as SelectBuilder<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable>;
		}

		//* Make sure the tables are in the same database
		if (table.database.name !== this.databaseData.name) {
			this._joins.push({
				success: false,
				error: getPGTError({
					code: "invalid_join",
					type: "database",
				}),
			});
			return this as SelectBuilder<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable>;
		}

		//* Make sure the tables aren't already joined
		if (this.tables.some(t => t.location === table.location)) {
			this._joins.push({
				success: false,
				error: getPGTError({
					code: "invalid_join",
					type: "duplicate",
				}),
			});
			return this as SelectBuilder<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable>;
		}

		this._joins.push(getRawJoinQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, JoinedTable>(filter, table, this.tables));
		this.tables.push(table);
		return this as any;
	}

	where(where: WhereQuery<JoinedTables, TableColumnsFromSchemaOnwards<JoinedTables>>) {
		this._where = getRawWhereQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, TableColumnsFromSchemaOnwards<JoinedTables>>(where, this.tables);
		return this;
	}

	groupBy(groupBy: GroupBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>) {
		this._groupBy = getRawGroupBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>(groupBy, this.tables);
		return this;
	}

	//TODO
	//having() { }

	orderBy(orderBy: OrderBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>) {
		//TODO make sure input is valid

		const { columns, nulls } = orderBy,
			orderByColumns = columns ? Object.entries(columns).map(([column, direction]) => `${column} ${direction}`) : undefined;

		this._groupBy = { success: true, data: `ORDER BY${orderByColumns ? ` ${orderByColumns.join(", ")}` : ""}${nulls ? ` ${nulls}` : ""}` };

		return this;
	}

	limit(limit: number, offset?: number) {
		//TODO make sure input is valid

		this._limit = { success: true, data: offset ? `LIMIT ${limit}\nOFFSET ${offset}` : `LIMIT ${limit}` };

		return this;
	}

	fetch(fetch: { fetch: number; type?: "FIRST" | "NEXT"; offset?: number }) {
		//TODO make sure input is valid
		fetch.type ??= "FIRST";

		const { fetch: fetchAmount, type, offset } = fetch,
			fetchString = `FETCH ${type} ${fetchAmount} ${fetchAmount > 1 ? "ROWS" : "ROW"} ONLY`;

		this._fetch = { success: true, data: offset ? `OFFSET ${offset} ${offset > 1 ? "ROWS" : "ROW"}\n${fetchString}` : fetchString };

		return this;
	}

	execute<Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>>(
		select?: Select
	): // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore - Not sure where it is circular //TODO find out where it is circular
	Promise<Safe<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, false>>, PGTError | PGTPError>>;
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
	): Promise<Safe<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, true>>, PGTError | PGTPError>>;
	execute<
		Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>,
		Options extends SelectQueryOptions = SelectQueryOptions
	>(
		select: Select,
		options?: Options & { raw?: false; valuesOnly?: false }
	): Promise<Safe<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, false>>, PGTError | PGTPError>>;
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

		let joins = this._joins as
			| {
					success: false;
					error: PGTError;
			  }[]
			| {
					success: true;
					data: {
						query: string;
						variables: (Parsers | string)[];
						tableLocation: string;
					};
			  }[];

		//* If any previous step failed, return the error
		for (const join of joins) if (!join.success) return join;
		joins = joins as {
			success: true;
			data: {
				query: string;
				variables: (Parsers | string)[];
				tableLocation: string;
			};
		}[];
		if (this._where && !this._where.success) return this._where;
		if (this._groupBy && !this._groupBy.success) return this._groupBy;
		if (this._limit && !this._limit.success) return this._limit;
		if (this._fetch && !this._fetch.success) return this._fetch;

		let query = `SELECT ${getRawSelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>, Select>(select as Select)}\nFROM ${tableLocation} %${tableLocation}%${
			joins.length > 0 ? `\n${joins.map(join => join.data.query).join("\n")}` : ""
		}${this._where ? `\n${this._where.data.query}` : ""}${this._groupBy ? `\n${this._groupBy.data}` : ""}${this._limit ? `\n${this._limit.data}` : ""}${
			this._fetch ? `\n${this._fetch.data}` : ""
		}`;

		//* Replace the table locations with the short names
		const mainTableShort = getTableIdentifier(tableLocation, usedTableLocations);
		query = query.replaceAll(`%${tableLocation}%`, mainTableShort).replaceAll(`${tableLocation}.`, `${mainTableShort}.`);
		usedTableLocations.push(mainTableShort);

		for (const join of joins) {
			const joinTableShort = getTableIdentifier(join.data.tableLocation, usedTableLocations);
			query = query.replaceAll(`%${join.data.tableLocation}%`, joinTableShort).replaceAll(`${join.data.tableLocation}.`, `${joinTableShort}.`);
			usedTableLocations.push(joinTableShort);
		}

		//* Replace all ? with $1, $2, etc
		const count = query.match(/%\?%/g)?.length ?? 0;
		for (let index = 1; index <= count; index++) query = query.replace("%?%", `$${index}`);

		//* If the query is raw, return it
		if (options?.raw) return query;

		const runningQuery = this.client.safeQuery<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>>(query, [
			...(this._where?.data.variables.map(variable => {
				if (typeof variable !== "string") return variable.postgres;
				return variable;
			}) ?? []),
			...joins.flatMap(join =>
				join.data.variables.map(variable => {
					if (typeof variable !== "string") return variable.postgres;
					return variable;
				})
			),
		]);

		return new Promise<Safe<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>>, PGTError | PGTPError>>(
			(resolve, reject) => {
				runningQuery
					.then(result => {
						if (!result.success) return resolve(result);
						if (options?.valuesOnly) {
							result.data.rows = result.data.rows.map(row => {
								//* Map all the values of the object to the .value property of them.
								return Object.fromEntries(
									// eslint-disable-next-line unicorn/no-null
									Object.entries(row as Record<string, Parsers | null>).map(([key, value]) => [key, value === null ? null : value.value])
								);
							}) as SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>[];
						}
						resolve(result);
					})
					.catch(reject);
			}
		);
	}
}
