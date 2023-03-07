import { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { FilterOperators } from "../types/interfaces/FilterOperators.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { JoinQuery } from "../types/types/JoinQuery.js";
import { OnQuery } from "../types/types/OnQuery.js";
import { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards.js";
import { TableLocationsFromSchemaOnwards } from "../types/types/TableLocationsFromSchemaOnwards.js";
import { Client } from "./Client.js";
import { Table } from "./Table.js";

export class QueryBuilder<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTablesPaths extends TableLocationsFromSchemaOnwards<JoinedTables> = TableLocationsFromSchemaOnwards<JoinedTables>,
	JoinedTablesColumns extends TableColumnsFromSchemaOnwards<JoinedTables> = TableColumnsFromSchemaOnwards<JoinedTables>
> {
	tables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[] = [];
	rawQuery = "";
	queryVariables: any[] = [];
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
	): QueryBuilder<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable> {
		//* Make sure the tables are in the same database
		if (table.database.name !== this.databaseData.name) {
			//TODO make this a custom error
			throw new Error("Cannot join tables from different databases");
		}

		//* Make sure the tables aren't already joined
		if (this.tables.includes(table)) {
			//TODO make this a custom error
			throw new Error("Cannot join the same table twice");
		}

		this.tables.push(table);

		//* Add the join to the raw query
		this.rawQuery = this.rawQuery === "" ? this.getRawJoinQuery(filter, table) : `${this.rawQuery}\n${this.getRawJoinQuery(filter, table)}`;
		return this as any;
	}

	private getRawJoinQuery<
		JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
		Filter extends JoinQuery<JoinedTables, JoinedTable> = JoinQuery<JoinedTables, JoinedTable>
	>(filter: Filter, table: JoinedTable): string {
		//* Table.location is in the format of "database.schema.table" but we only want "schema.table"
		const tableLocation = table.location.split(".").slice(1).join(".");

		switch (filter.$TYPE) {
			case "CROSS":
			case "NATURAL":
			case "NATURAL INNER":
			case "NATURAL LEFT":
			case "NATURAL RIGHT":
				return `${filter.$TYPE} JOIN ${tableLocation}`;

			default:
				return `${filter.$TYPE ?? "INNER"} JOIN ${tableLocation}\n  ON${this.getRawOnQuery<JoinedTable>(filter.$ON)}`;
		}
	}

	private getRawOnQuery<
		JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
		On extends OnQuery<JoinedTables, JoinedTable> = OnQuery<JoinedTables, JoinedTable>
	>(on: On, depth = 0): string {
		//* Make sure the depth is less than 10
		if (depth > 10) {
			//TODO make this a custom error
			throw new Error("On filter is too deep");
		}

		const keys = Object.keys(on) as (keyof On)[];
		//* Make sure there is only one key
		if (keys.length !== 1) {
			//TODO make this a custom error
			throw new Error("On filter must have only one key");
		}

		const key = keys[0],
			spaces = " ".repeat(depth * 2 + 4);

		switch (key) {
			case "$AND":
				return `\n${spaces}(\n${spaces} ${on.$AND
					?.map(andValue => this.getRawOnQuery(andValue as any, depth + 1).trim())
					.join(`\n${spaces} AND `)}\n${spaces})`;
			case "$OR":
				return `\n${spaces}(\n${spaces} ${on.$OR?.map(orValue => this.getRawOnQuery(orValue as any, depth + 1).trim()).join(`\n${spaces} OR `)}\n${spaces})`;
			default: {
				//TODO make sure the key is a valid column location
				if (typeof on[key] !== "object") return ` ${key.toString()} = ${on[key]}`;
				const [rawFilterOperator, ...variables] = this.getRawFilterOperator(on[key] as any);
				this.queryVariables.push(...variables);

				return `${key.toString()} ${rawFilterOperator}`;
			}
		}
	}

	private getRawFilterOperator(filter: FilterOperators<any>): [string, ...any[]] {
		let keys = Object.keys(filter) as (keyof FilterOperators<any>)[];
		//* Filter out the keys that have a value of undefined
		keys = keys.filter(key => filter[key] !== undefined);
		//* Make sure there is only one key
		if (keys.length !== 1) {
			//TODO make this a custom error
			throw new Error("Filter must have only one key");
		}

		const key = keys[0];
		switch (key) {
			case "$EQUAL":
				return ["= ?", filter.$EQUAL];
			case "$NOT_EQUAL":
				return ["!= ?", filter.$NOT_EQUAL];
			case "$GREATER_THAN":
				return ["> ?", filter.$GREATER_THAN];
			case "$GREATER_THAN_OR_EQUAL":
				return [">= ?", filter.$GREATER_THAN_OR_EQUAL];
			case "$LESS_THAN":
				return ["< ?", filter.$LESS_THAN];
			case "$LESS_THAN_OR_EQUAL":
				return ["<= ?", filter.$LESS_THAN_OR_EQUAL];
			case "$LIKE":
				return ["LIKE ?", filter.$LIKE];
			case "$NOT_LIKE":
				return ["NOT LIKE ?", filter.$NOT_LIKE];
			case "$ILIKE":
				return ["ILIKE ?", filter.$ILIKE];
			case "$NOT_ILIKE":
				return ["NOT ILIKE ?", filter.$NOT_ILIKE];
			case "$IN":
				//* Make sure the value is an array
				if (!Array.isArray(filter.$IN)) {
					//TODO make this a custom error
					throw new TypeError("IN filter must be an array");
				}

				//* Make sure it has atleast 2 entries
				if (filter.$IN.length < 2) {
					//TODO make this a custom error
					throw new Error("IN filter must have atleast 2 entries");
				}

				return ["IN ?", filter.$IN];

			case "$NOT_IN":
				//* Make sure the value is an array
				if (!Array.isArray(filter.$NOT_IN)) {
					//TODO make this a custom error
					throw new TypeError("NOT IN filter must be an array");
				}

				//* Make sure it has atleast 2 entries
				if (filter.$NOT_IN.length < 2) {
					//TODO make this a custom error
					throw new Error("NOT IN filter must have atleast 2 entries");
				}

				return ["NOT IN ?", filter.$NOT_IN];
			case "$BETWEEN":
				//* Make sure the value is an array
				if (!Array.isArray(filter.$BETWEEN)) {
					//TODO make this a custom error
					throw new TypeError("BETWEEN filter must be an array");
				}

				//* Make sure it has exactly 2 entries
				if (filter.$BETWEEN.length !== 2) {
					//TODO make this a custom error
					throw new Error("BETWEEN filter must have exactly 2 entries");
				}

				return ["BETWEEN ? AND ?", filter.$BETWEEN[0], filter.$BETWEEN[1]];

			case "$NOT_BETWEEN":
				//* Make sure the value is an array
				if (!Array.isArray(filter.$NOT_BETWEEN)) {
					//TODO make this a custom error
					throw new TypeError("NOT BETWEEN filter must be an array");
				}

				//* Make sure it has exactly 2 entries
				if (filter.$NOT_BETWEEN.length !== 2) {
					//TODO make this a custom error
					throw new Error("NOT BETWEEN filter must have exactly 2 entries");
				}

				return ["NOT BETWEEN ? AND ?", filter.$NOT_BETWEEN[0], filter.$NOT_BETWEEN[1]];
			case "$IS_NULL":
				return ["IS NULL"];
			case "$IS_NOT_NULL":
				return ["IS NOT NULL"];
			default:
				//TODO make this a custom error
				throw new Error("Filter must have a valid operator");
		}
	}
}
