import type { Parsers, PGTPError } from "@postgresql-typed/parsers";

import { getPGTError } from "../functions/getPGTError.js";
import { getRawFetch } from "../functions/getRawFetch.js";
import { getRawGroupBy } from "../functions/getRawGroupBy.js";
import { getRawJoinQuery } from "../functions/getRawJoinQuery.js";
import { getRawLimit } from "../functions/getRawLimit.js";
import { getRawOrderBy } from "../functions/getRawOrderBy.js";
import { getRawSelectQuery } from "../functions/getRawSelectQuery.js";
import { getRawWhereQuery } from "../functions/getRawWhereQuery.js";
import { getTableIdentifier } from "../functions/getTableIdentifier.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import type { Fetch } from "../types/types/Fetch.js";
import type { GroupBy } from "../types/types/GroupBy.js";
import type { JoinQuery } from "../types/types/JoinQuery.js";
import type { NestedSelectQuery } from "../types/types/NestedSelectQuery.js";
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
	private _orderBy: Safe<string> | undefined;
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
		this._orderBy = getRawOrderBy<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables>(orderBy, this.tables);
		return this;
	}

	limit(limit: number, offset?: number) {
		this._limit = getRawLimit(limit, offset);
		return this;
	}

	fetch(fetch: Fetch) {
		this._fetch = getRawFetch(fetch);
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
	>(select: Select, options?: Options & { raw: true }): Safe<string, PGTError | PGTPError>;
	execute<
		Select extends SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>> = SelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>>,
		Options extends SelectQueryOptions = SelectQueryOptions
	>(select: Select, options?: Options & { nested: true }): Safe<NestedSelectQuery<InnerPostgresData, InnerDatabaseData, Ready>, PGTError | PGTPError>;
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
		//TODO Validate incoming options;

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
		if (this._orderBy && !this._orderBy.success) return this._orderBy;
		if (this._limit && !this._limit.success) return this._limit;
		if (this._fetch && !this._fetch.success) return this._fetch;

		const selectQuery = getRawSelectQuery<TableColumnsFromSchemaOnwards<JoinedTables>, Select>(select as Select, this.tables);
		if (!selectQuery.success) return selectQuery;

		let query = `SELECT ${selectQuery.data.query}\nFROM ${tableLocation} %${tableLocation}%${
			joins.length > 0 ? `\n${joins.map(join => join.data.query).join("\n")}` : ""
		}${this._where ? `\n${this._where.data.query}` : ""}${this._groupBy?.success ? `\n${this._groupBy.data}` : ""}${
			this._orderBy ? `\n${this._orderBy.data}` : ""
		}${this._limit ? `\n${this._limit.data}` : ""}${this._fetch ? `\n${this._fetch.data}` : ""}`;

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
		let index = 1;
		for (; index <= count; index++) query = query.replace("%?%", `$${index}`);

		//* If the query is raw, return it
		if (options?.raw) {
			return {
				success: true,
				data: query,
			};
		}

		const variables = [
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
		];

		if (options?.nested) {
			return {
				success: true,
				data: Object.freeze({
					query,
					variables,
					variablesIndex: index,
					usedTableLocations,
					database: this.table.database,
				} satisfies NestedSelectQuery<InnerPostgresData, InnerDatabaseData, Ready>),
			};
		}

		const runningQuery = this.client.safeQuery<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>>(
			query,
			variables
		);

		return new Promise<Safe<Query<SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>>, PGTError | PGTPError>>(
			(resolve, reject) => {
				runningQuery
					.then(result => {
						if (!result.success) return resolve(result);
						//* Map all values to their parsers
						result.data.rows = result.data.rows.map(row => {
							return Object.fromEntries(
								Object.entries(row as Record<string, Parsers | null>).map(([key, value]) => {
									/* c8 ignore start */
									if (!selectQuery.data.mappings[key]?.parser) return [key, value];
									// eslint-disable-next-line unicorn/no-null
									const result = value === null ? null : selectQuery.data.mappings[key].parser.safeFrom(value.toString());

									if (result !== null && !result.success) {
										resolve(result);
										// eslint-disable-next-line unicorn/no-null
										return [key, null];
									}
									// eslint-disable-next-line unicorn/no-null
									return [key, result === null ? null : result.data];
								})
							);
						}) as SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>[];

						if (options?.valuesOnly) {
							result.data.rows = result.data.rows.map(row => {
								//* Map all the values of the object to the .value property of them.
								return Object.fromEntries(
									Object.entries(row as Record<string, Parsers | null>).map(([key, value]) => [
										key,
										// eslint-disable-next-line unicorn/no-null
										value === null ? null : "value" in value ? value.value : value,
									])
								);
							}) as SelectQueryResponse<InnerDatabaseData, TableColumnsFromSchemaOnwards<JoinedTables>, Select, boolean>[];
							/* c8 ignore stop */
						}
						resolve(result);
					})
					.catch(reject);
			}
		);
	}
}
