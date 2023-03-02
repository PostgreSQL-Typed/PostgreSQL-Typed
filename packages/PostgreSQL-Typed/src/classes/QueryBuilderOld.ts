import { isFilterOperator } from "../functions/isFilterOperator.js";
import { isRootFilterOperator } from "../functions/isRootFilterOperator.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { FilterOperators } from "../types/interfaces/FilterOperators.js";
import type { RootFilterOperators } from "../types/interfaces/RootFilterOperators.js";
import type { SelectOptions } from "../types/interfaces/SelectOptions.js";
import type { ColumnNamesOfTable } from "../types/types/ColumnNamesOfTable.js";
import type { ColumnsOfTable } from "../types/types/ColumnsOfTable.js";
import type { Filter } from "../types/types/Filter.js";
import type { OrderBy } from "../types/types/OrderBy.js";
import type { TableLocationsFromDatabase } from "../types/types/TableLocationsFromDatabase.js";
import { Table } from "./Table.js";

export class QueryBuilderOLD<
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	ClientType extends "client" | "pool",
	TableLocation extends TableLocationsFromDatabase<InnerDatabaseData>
> {
	constructor(private table: Table<InnerDatabaseData, Ready, ClientType, TableLocation>) {}

	public getSelectQuery<
		ColumNames extends ColumnNamesOfTable<InnerDatabaseData, TableLocation>,
		Columns extends ColumnsOfTable<InnerDatabaseData, TableLocation>,
		IncludePrimaryKey extends boolean = false
	>(columns: ColumNames | "*", options?: SelectOptions<Columns>, includePrimaryKey?: IncludePrimaryKey): string {
		const { tableName: tableName, schemaName: schemaName, primary_key: primaryKey } = this.table,
			{ $LIMIT: limit, $FETCH: fetch, $ORDER_BY: orderBy, $WHERE: where } = options || {};
		let finalColumns: string[] | "*" = columns;

		if (Array.isArray(columns)) finalColumns = [...new Set<string>([...columns, ...(includePrimaryKey && !!primaryKey ? [primaryKey as string] : [])])];

		return `
      SELECT ${finalColumns}
      FROM ${schemaName}.${tableName}
      ${this.whereToSQL(where)}
      ${this.orderByToSQL(orderBy)}
      ${this.limitToSQL(limit)}
      ${this.fetchToSQL(fetch)}
      `;
	}

	private whereToSQL<Table>(where?: Filter<Table>, nested = false): string {
		if (where === undefined || Object.keys(where).length === 0) return "";

		const keys = Object.entries(where).filter(([key]) => isRootFilterOperator<Table>(key));
		if (keys.length > 0) {
			const [[operator, filter]] = keys as [keyof RootFilterOperators<Table>, Filter<Table>[]][],
				queries = filter.map(v => this.whereToSQL(v, true)).filter(Boolean);
			return nested ? `(${queries.join(` ${this.encodeOperator(operator)} `)})` : `WHERE ${queries.join(` ${this.encodeOperator(operator)} `)}`;
		}

		const result: string[] = [];
		for (const [key, value] of Object.entries(where)) {
			if (key.includes(".")) result.push(this.encodeJsonQuery(key, value));
			else if (typeof value !== "object" || value === null) result.push(`${key} = ${this.encodeValue(value)}`);
			else result.push(this.encodeOperation(key, value));
		}

		return result.length === 1 ? `${nested ? "" : "WHERE "}${result[0]}` : `${nested ? "" : "WHERE "}(${result.join(" AND ")})`;
	}

	private escape(value: string) {
		const rxSingleQuote: [RegExp, string] = [/'/g, "'"],
			rxDoubleQuote: [RegExp, string] = [/"/g, '\\"'],
			rxBackslash: [RegExp, string] = [/\\/g, "\\\\"];

		return value.replaceAll(rxSingleQuote[0], rxSingleQuote[1]).replaceAll(rxDoubleQuote[0], rxDoubleQuote[1]).replaceAll(rxBackslash[0], rxBackslash[1]);
	}

	private encodeValue<TSchema>(value: any, operator?: keyof FilterOperators<any> | keyof RootFilterOperators<TSchema>): string {
		switch (typeof value) {
			case "boolean":
				switch (operator) {
					case "$IS_NULL":
						return "";
					case "$IS_NOT_NULL":
						return "";
					default:
						return value.toString();
				}
			case "string":
				return `'${this.escape(value)}'`;
			case "number":
			case "bigint":
				return value.toString();
			case "object": {
				const isArray = Array.isArray(value),
					isBuffer = Buffer.isBuffer(value);

				if (isArray) {
					switch (operator) {
						case "$BETWEEN":
						case "$NOT_BETWEEN": {
							const [min, max] = value as [any, any];
							return `${this.encodeValue(min)} AND ${this.encodeValue(max)}`;
						}
						case "$IN":
						case "$NOT_IN":
							return `(${value.map(v => this.encodeValue(v)).join(", ")})`;
						default:
							return `'${JSON.stringify(value)}'`;
					}
				} else if (isBuffer) return `'${value.toString()}'`;

				return `'${JSON.stringify(value)}'`;
			}
			default:
				break;
		}
		return "NULL";
	}

	private encodeOperation(key: string, operation: FilterOperators<any>): string {
		const result: string[] = [];
		for (const [operator, value] of Object.entries(operation)) {
			if (isFilterOperator(operator) || isRootFilterOperator(operator))
				result.push(`${key} ${this.encodeOperator(operator)} ${this.encodeValue(value, operator)}`);
			else return `${key} = ${this.encodeValue(operation)}`;
		}

		return result.length === 1 ? result[0] : `(${result.join(" AND ")})`;
	}

	private encodeOperator<TSchema>(operator: keyof FilterOperators<any> | keyof RootFilterOperators<TSchema>): string {
		switch (operator) {
			case "$EQUAL":
				return "=";
			case "$NOT_EQUAL":
				return "!=";
			case "$LESS_THAN":
				return "<";
			case "$LESS_THAN_OR_EQUAL":
				return "<=";
			case "$GREATER_THAN":
				return ">";
			case "$GREATER_THAN_OR_EQUAL":
				return ">=";
			case "$LIKE":
				return "LIKE";
			case "$NOT_LIKE":
				return "NOT LIKE";
			case "$ILIKE":
				return "ILIKE";
			case "$NOT_ILIKE":
				return "NOT ILIKE";
			case "$IN":
				return "IN";
			case "$NOT_IN":
				return "NOT IN";
			case "$BETWEEN":
				return "BETWEEN";
			case "$NOT_BETWEEN":
				return "NOT BETWEEN";
			case "$IS_NULL":
				return "IS NULL";
			case "$IS_NOT_NULL":
				return "IS NOT NULL";
			case "$AND":
				return "AND";
			case "$OR":
				return "OR";
		}
	}

	private encodeJsonQuery(key: string, value: any) {
		const [field, ...path] = key.split("."),
			lastPath = path.pop();
		let pathString = path.map(p => `'${p}'`).join("->");
		if (pathString) pathString = `->${pathString}`;
		return this.encodeJsonQueryCast(`${field}${pathString}->>'${lastPath}'`, value);
	}

	private encodeJsonQueryCast(key: string, value: any) {
		switch (typeof value) {
			case "boolean":
				return `CAST(${key} as boolean) = ${value}`;
			case "string":
				return `${key} = '${this.escape(value)}'`;
			case "number":
				return `CAST(${key} as integer) = ${value}`;
			case "bigint":
				return `CAST(${key} as bigint) = ${value}`;
			case "object":
				return `CAST(${key} as jsonb) = '${JSON.stringify(value)}'`;
			default:
				return `${key} = ${this.encodeValue(value)}`;
		}
	}

	private orderByToSQL<TSchema>(orderBy1?: [keyof TSchema, OrderBy?]) {
		if (!orderBy1) return "";

		const [key, orderBy] = orderBy1 as [string, OrderBy?];
		if (!orderBy) return `ORDER BY ${key}`;

		const order = Array.isArray(orderBy) ? `${orderBy[0]} ${orderBy[1]}` : orderBy;

		return `ORDER BY ${key} ${order}`;
	}

	private limitToSQL(limit?: number | [number, number]) {
		if (!limit) return "";

		if (Array.isArray(limit)) return `LIMIT ${limit[0]} OFFSET ${limit[1]}`;

		return `LIMIT ${limit}`;
	}

	private fetchToSQL(fetch?: number | [number, number]) {
		if (!fetch) return "";

		if (Array.isArray(fetch)) {
			return `
				OFFSET ${fetch[1]} ROWS
				FETCH FIRST ${fetch[0]} ROWS ONLY
			`;
		}

		return `FETCH FIRST ${fetch} ROWS ONLY`;
	}
}
