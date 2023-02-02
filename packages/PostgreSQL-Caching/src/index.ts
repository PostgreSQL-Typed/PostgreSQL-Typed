import "source-map-support/register";

import Keyv from "keyv";
import type { Client, Pool, QueryResult } from "pg";

import type { Filter, FilterOperators, Include, OrderBy, RootFilterOperators, SelectOptions } from "./types";
import { isFilterOperator, isRootFilterOperator } from "./types";

export * from "./types";

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
			const cacheDoc = await this.keyv.get(cacheKey);

			if (cacheDoc) return cacheDoc;

			const res = await this.getSelectQuery(columns, options);

			await this.keyv.set(cacheKey, res);

			return res;
		});
	}

	private async getSelectQuery(columns: (keyof TSchema)[] | "*", options?: SelectOptions<TSchema>): Promise<QueryResult<TSchema>> {
		const mainColumns = columns,
			{ $WHERE: where, $ORDER_BY: orderBy, $LIMIT: limit, $FETCH: fetch } = options ?? {};

		if (Array.isArray(columns)) columns = [...new Set<keyof TSchema>([...columns, this.pk])];

		const res = await this.sql.query<TSchema>(`
				SELECT ${columns}
				FROM ${this.schema}.${this.table}
				${this.whereToSQL(where)}
				${this.orderByToSQL(orderBy)}
				${this.limitToSQL(limit)}
				${this.fetchToSQL(fetch)}`);

		res.rows = res.rows.map((row: Record<string, any>): TSchema => {
			for (const [key, value] of Object.entries(row)) if (value instanceof Date) row[key] = value.toJSON();
			return row as TSchema;
		});

		if (Array.isArray(mainColumns) && !mainColumns.includes(this.pk)) {
			res.rows = res.rows.map(row => {
				delete row[this.pk];
				return row;
			});
		}

		return res;
	}

	private whereToSQL(where?: Filter<TSchema>, nested = false): string {
		if (typeof where === "undefined" || !Object.keys(where).length) return "";

		const keys = Object.entries(where).filter(([key]) => isRootFilterOperator<TSchema>(key));
		if (keys.length) {
			const [[operator, filter]] = keys as [keyof RootFilterOperators<TSchema>, Filter<TSchema>[]][],
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

	private encodeValue(value: any, operator?: keyof FilterOperators<any> | keyof RootFilterOperators<TSchema>): any {
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

	private escape(value: string) {
		const rxSingleQuote: [RegExp, string] = [/'/g, "'"],
			rxDoubleQuote: [RegExp, string] = [/"/g, '\\"'],
			rxBackslash: [RegExp, string] = [/\\/g, "\\\\"];

		return value.replaceAll(rxSingleQuote[0], rxSingleQuote[1]).replaceAll(rxDoubleQuote[0], rxDoubleQuote[1]).replaceAll(rxBackslash[0], rxBackslash[1]);
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

	getCacheKey(...args: any[]) {
		const elements = args.filter(arg => typeof arg === "object");

		return JSON.stringify(elements.length === 1 ? elements[0] : elements);
	}
}
