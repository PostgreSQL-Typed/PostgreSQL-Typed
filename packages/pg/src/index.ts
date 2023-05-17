import "./types.js";

import {
	BaseClient,
	type Context,
	getErrorMap,
	PgTError,
	type PostgresData,
	type Query,
	type RawPostgresData,
	setIssueForContext,
} from "@postgresql-typed/core";
import { getParsedType, INVALID, isOneOf, loadPgTConfig, OK, ParsedType, type ParseReturnType, type PgTConfigSchema } from "@postgresql-typed/util";
import { Client as PGClient, type ClientConfig, type QueryResult } from "pg";

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends BaseClient<InnerPostgresData, Ready> {
	private _client: PGClient;
	private _ready = false;
	private _connectionError?: PgTError;
	private _extensionsInstalled = false;
	private _config = {} as PgTConfigSchema;

	constructor(postgresData: RawPostgresData<InnerPostgresData>, connectionString: string);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, config: ClientConfig);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, pgConfig?: string | ClientConfig);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, pgConfig?: string | ClientConfig) {
		super(postgresData);

		this._client = new PGClient(pgConfig);

		loadPgTConfig().then(config => {
			this._config = config.config;
		});
	}

	async testConnection(connectionString: string): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(config: ClientConfig): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(pgConfig?: string | ClientConfig): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(pgConfig?: string | ClientConfig): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>> {
		this._ready = false;

		if (pgConfig) {
			await this._client.end();
			this._client = new PGClient(pgConfig);
		}

		if (!this._extensionsInstalled) {
			await this.initExtensions();
			this._extensionsInstalled = true;
		}

		try {
			await this.callHook("client:pre-connect");

			await this._client.connect();

			await this._client.query("SELECT 1");

			await this.callHook("client:post-connect");
			this._ready = true;

			return this as Client<InnerPostgresData, true>;
		} catch (error) {
			this._connectionError = new PgTError({
				code: "query_error",
				errorMessage: (error as Error).message,
				message: getErrorMap()({
					code: "query_error",
					errorMessage: (error as Error).message,
				}).message,
			});
			return this as Client<InnerPostgresData, false>;
		}
	}

	//* Validate the query and values
	async _query<Data>(context: Context): Promise<ParseReturnType<Query<Data>>> {
		if (!this._ready) {
			setIssueForContext(context, {
				code: "not_ready",
			});
			return INVALID;
		}

		//* context should have [string, string[]]
		if (context.data.length !== 2) {
			setIssueForContext(
				context,
				context.data.length > 2
					? {
							code: "too_big",
							type: "arguments",
							maximum: 1,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 1,
							exact: true,
					  }
			);
			return INVALID;
		}

		const [query, values] = context.data,
			allowedQueryTypes = [ParsedType.string],
			allowedValueTypes = [ParsedType.array],
			allowedInnerValueTypes = [ParsedType.string],
			parsedQueryType = getParsedType(query),
			parsedValueType = getParsedType(values);

		if (!isOneOf(allowedQueryTypes, parsedQueryType)) {
			setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedQueryTypes,
				received: parsedQueryType,
			});
			return INVALID;
		}

		if (!isOneOf(allowedValueTypes, parsedValueType)) {
			setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedValueTypes,
				received: parsedValueType,
			});
			return INVALID;
		}

		const parsedInnerValueTypes = (values as unknown[]).map(value => getParsedType(value));

		for (const parsedInnerValueType of parsedInnerValueTypes) {
			if (!isOneOf(allowedInnerValueTypes, parsedInnerValueType)) {
				setIssueForContext(context, {
					code: "invalid_type",
					expected: allowedInnerValueTypes,
					received: parsedInnerValueType,
				});
				return INVALID;
			}
		}

		return this._runQuery<Data>(context, query as string, values as string[]);
	}

	//* Run the actual query
	private async _runQuery<Data>(context: Context, query: string, values: string[]): Promise<ParseReturnType<Query<Data>>> {
		const preQueryResult = await this.callHook("client:pre-query", { query, values }, context);

		if (preQueryResult !== undefined) return OK(preQueryResult as Query<Data>);

		let result: QueryResult;
		try {
			result = await this._client.query(query, values);
		} catch (error) {
			setIssueForContext(context, {
				code: "query_error",
				errorMessage: (error as Error).message,
			});

			return INVALID;
		}
		const finalResult = {
			rows: result.rows,
			rowCount: result.rowCount,
			command: result.command,
			input: {
				query,
				values,
			},
		};

		await this.callHook("client:post-query", finalResult, context);

		return OK(finalResult);
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	get connectionError(): PgTError | undefined {
		return this._connectionError;
	}

	get client(): PGClient {
		return this._client;
	}

	get PgTConfig(): PgTConfigSchema {
		return this._config;
	}
}

export { isReady } from "@postgresql-typed/core";
