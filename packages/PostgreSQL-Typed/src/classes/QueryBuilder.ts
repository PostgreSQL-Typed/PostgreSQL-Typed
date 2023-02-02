import { Table } from "../classes/Table";
import { isFilterOperator } from "../functions/isFilterOperator";
import { isRootFilterOperator } from "../functions/isRootFilterOperator";
import type { DatabaseData } from "../types/interfaces/DatabaseData";
import type { FilterOperators } from "../types/interfaces/FilterOperators";
import type { RootFilterOperators } from "../types/interfaces/RootFilterOperators";
import type { SelectOptions } from "../types/interfaces/SelectOptions";
import type { ColumnNamesOfTable } from "../types/types/ColumnNamesOfTable";
import type { ColumnsOfTable } from "../types/types/ColumnsOfTable";
import type { Filter } from "../types/types/Filter";
import type { OrderBy } from "../types/types/OrderBy";
import type { TableLocations } from "../types/types/TableLocations";

export class QueryBuilder<
	DbData extends DatabaseData,
	Ready extends boolean,
	ClientType extends "client" | "pool",
	TableLocation extends TableLocations<DbData>
> {
	constructor(private table: Table<DbData, Ready, ClientType, TableLocation>) {}

	public getSelectQuery<
		ColumNames extends ColumnNamesOfTable<DbData, TableLocation>,
		Columns extends ColumnsOfTable<DbData, TableLocation>,
		IncludePrimaryKey extends boolean = false
	>(columns: ColumNames | "*", options?: SelectOptions<Columns>, includePrimaryKey?: IncludePrimaryKey): string {
		const { table_name: tableName, schema_name: schemaName, primary_key: primaryKey } = this.table,
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
		if (typeof where === "undefined" || !Object.keys(where).length) return "";

		const keys = Object.entries(where).filter(([key]) => isRootFilterOperator<Table>(key));
		if (keys.length) {
			const [[operator, filter]] = keys as [keyof RootFilterOperators<Table>, Filter<Table>[]][],
				queries = filter.map(v => this.whereToSQL(v, true)).filter(Boolean);
			if (nested) return `(${queries.join(` ${this.encodeOperator(operator)} `)})`;
			else return `WHERE ${queries.join(` ${this.encodeOperator(operator)} `)}`;
		}

		const res: string[] = [];
		for (const [key, value] of Object.entries(where)) {
			if (key.includes(".")) res.push(this.encodeJsonQuery(key, value));
			else if (typeof value !== "object" || value === null) res.push(`${key} = ${this.encodeValue(value)}`);
			else res.push(this.encodeOperation(key, value));
		}

		if (res.length === 1) return `${!nested ? "WHERE " : ""}${res[0]}`;
		else return `${!nested ? "WHERE " : ""}(${res.join(" AND ")})`;
	}

	private escape(value: string) {
		const rxSingleQuote: [RegExp, string] = [/'/g, "'"],
			rxDoubleQuote: [RegExp, string] = [/"/g, '\\"'],
			rxBackslash: [RegExp, string] = [/\\/g, "\\\\"];

		return value.replaceAll(rxSingleQuote[0], rxSingleQuote[1]).replaceAll(rxDoubleQuote[0], rxDoubleQuote[1]).replaceAll(rxBackslash[0], rxBackslash[1]);
	}

	private encodeValue<TSchema>(value: any, operator?: keyof FilterOperators<any> | keyof RootFilterOperators<TSchema>): any {
		switch (typeof value) {
			case "boolean": {
				switch (operator) {
					case "$IS_NULL":
						return "";
					case "$IS_NOT_NULL":
						return "";
					default:
						return value;
				}
			}
			case "string": {
				return `'${this.escape(value)}'`;
			}
			case "number":
			case "bigint": {
				return value;
			}
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
						case "$NOT_IN": {
							return `(${value.map(v => this.encodeValue(v)).join(", ")})`;
						}
						default: {
							return `'${JSON.stringify(value)}'`;
						}
					}
				} else if (isBuffer) return `'${value.toString()}'`;

				return `'${JSON.stringify(value)}'`;
			}
			default: {
				break;
			}
		}
		return null;
	}

	private encodeOperation(key: string, operation: FilterOperators<any>): string {
		const res: string[] = [];
		for (const [operator, value] of Object.entries(operation)) {
			if (isFilterOperator(operator) || isRootFilterOperator(operator))
				res.push(`${key} ${this.encodeOperator(operator)} ${this.encodeValue(value, operator)}`);
			else return `${key} = ${this.encodeValue(operation)}`;
		}

		if (res.length === 1) return res[0];
		else return `(${res.join(" AND ")})`;
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
		let pathStr = path.map(p => `'${p}'`).join("->");
		if (pathStr) pathStr = `->${pathStr}`;
		return this.encodeJsonQueryCast(`${field}${pathStr}->>'${lastPath}'`, value);
	}

	private encodeJsonQueryCast(key: string, value: any) {
		switch (typeof value) {
			case "boolean": {
				return `CAST(${key} as boolean) = ${value}`;
			}
			case "string": {
				return `${key} = '${this.escape(value)}'`;
			}
			case "number": {
				return `CAST(${key} as integer) = ${value}`;
			}
			case "bigint": {
				return `CAST(${key} as bigint) = ${value}`;
			}
			case "object": {
				return `CAST(${key} as jsonb) = '${JSON.stringify(value)}'`;
			}
			default: {
				return `${key} = ${this.encodeValue(value)}`;
			}
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
