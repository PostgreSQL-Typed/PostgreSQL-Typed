import "source-map-support/register";

import Keyv from "keyv";
import type { Client, Pool, QueryResult } from "pg";

import type { Filter, FilterOperators, Include, OrderBy, RootFilterOperators, SelectOptions } from "./types.js";
import { isFilterOperator, isRootFilterOperator } from "./types.js";

export * from "./types.js";

export default class PostgreSQLCaching<TSchema extends object = any, TContext = any> {
	keyv: Keyv;
	context?: TContext;

	constructor(
		/**
		 * PostgreSQL connection
		 */
		public sql: Pool | Client,
		/**
		 * PostgreSQL schema
		 */
		public schema: string,
		/**
		 * PostgreSQL table
		 */
		public table: string,
		/**
		 * PostgreSQL table primary key
		 */
		public pk: keyof TSchema,
		keyvOptions?: Keyv.Options<any> & Record<string, unknown>
	) {
		this.keyv = new Keyv(keyvOptions);
	}

	/**
	 * Sets the context for the Cache
	 * @param context Context to set
	 */
	setContext(context: TContext) {
		this.context = context;
	}

	/**
	 * @param columns Columns to be returned
	 */
	async select<A extends (keyof TSchema)[] | "*">(
		columns: A,
		options?: SelectOptions<TSchema>
	): Promise<
		A extends "*"
			? QueryResult<TSchema>
			: QueryResult<{
					[K2 in Include<keyof TSchema, A[number]>]: TSchema[K2];
			  }>
	> {
		const cacheKey = `select-${this.getCacheKey(columns, options)}`;

		return this.throttleFunction(cacheKey, async () => {
			const cacheDocument = await this.keyv.get(cacheKey);

			if (cacheDocument) return cacheDocument;

			const result = await this.getSelectQuery(columns, options);

			await this.keyv.set(cacheKey, result);

			return result;
		});
	}

	private async getSelectQuery(columns: (keyof TSchema)[] | "*", options?: SelectOptions<TSchema>): Promise<QueryResult<TSchema>> {
		const mainColumns = columns,
			{ $WHERE: where, $ORDER_BY: orderBy, $LIMIT: limit, $FETCH: fetch } = options ?? {};

		if (Array.isArray(columns)) columns = [...new Set<keyof TSchema>([...columns, this.pk])];

		const response = await this.sql.query<TSchema>(`
				SELECT ${columns}
				FROM ${this.schema}.${this.table}
				${this.whereToSQL(where)}
				${this.orderByToSQL(orderBy)}
				${this.limitToSQL(limit)}
				${this.fetchToSQL(fetch)}`);

		response.rows = response.rows.map((row: Record<string, any>): TSchema => {
			for (const [key, value] of Object.entries(row)) if (value instanceof Date) row[key] = value.toJSON();
			return row as TSchema;
		});

		if (Array.isArray(mainColumns) && !mainColumns.includes(this.pk)) {
			response.rows = response.rows.map(row => {
				delete row[this.pk];
				return row;
			});
		}

		return response;
	}

	private whereToSQL(where?: Filter<TSchema>, nested = false): string {
		if (where === undefined || Object.keys(where).length === 0) return "";

		const keys = Object.entries(where).filter(([key]) => isRootFilterOperator<TSchema>(key));
		if (keys.length > 0) {
			const [[operator, filter]] = keys as [keyof RootFilterOperators<TSchema>, Filter<TSchema>[]][],
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

	private encodeValue(value: any, operator?: keyof FilterOperators<any> | keyof RootFilterOperators<TSchema>): string {
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

	private escape(value: string) {
		const rxSingleQuote: [RegExp, string] = [/'/g, "'"],
			rxDoubleQuote: [RegExp, string] = [/"/g, '\\"'],
			rxBackslash: [RegExp, string] = [/\\/g, "\\\\"];

		return value.replaceAll(rxSingleQuote[0], rxSingleQuote[1]).replaceAll(rxDoubleQuote[0], rxDoubleQuote[1]).replaceAll(rxBackslash[0], rxBackslash[1]);
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

	private encodeOperator(operator: keyof FilterOperators<any> | keyof RootFilterOperators<TSchema>): string {
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

	private orderByToSQL(orderBy1?: [keyof TSchema, OrderBy?]) {
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

	async clear() {
		return this.keyv.clear();
	}

	async clearValuesWithPk(pk: any) {
		for await (const [key, v] of this.keyv.iterator()) {
			const value: QueryResult<TSchema> = v;
			if (value.rows.map(r => r[this.pk]).includes(pk)) await this.keyv.delete(key);
		}
	}

	/**
	 * Throttles a function to only be called once per given key until the function is done
	 */
	activeThrottles = new Map<string, Promise<any>>();
	private throttleFunction(name: string, callback: () => Promise<any>) {
		if (this.activeThrottles.has(name)) return this.activeThrottles.get(name);

		const promise = callback();

		this.activeThrottles.set(name, promise);

		promise.finally(() => {
			this.activeThrottles.delete(name);
		});

		return promise;
	}

	getCacheKey(...input: any[]) {
		const elements = input.filter(element => typeof element === "object");

		return JSON.stringify(elements.length === 1 ? elements[0] : elements);
	}
}
