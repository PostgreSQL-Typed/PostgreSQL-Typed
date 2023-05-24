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
							maximum: 2,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 2,
							exact: true,
					  }
			);
			return INVALID;
		}

		const [query, values] = context.data,
			allowedQueryTypes = [ParsedType.string],
			allowedValueTypes = [ParsedType.array],
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

		return this._runQuery<Data>(context, query as string, values as unknown[]);
	}

	//* Run the actual query
	private async _runQuery<Data>(context: Context, query: string, values: unknown[]): Promise<ParseReturnType<Query<Data>>> {
		const data:
			| {
					input: {
						query: string;
						values: unknown[];
					};
					output: Query<unknown>;
			  }
			| {
					input: {
						query: string;
						values: unknown[];
					};
					output: undefined;
			  } = {
			input: {
				query,
				values,
			},
			output: undefined as Query<unknown> | undefined,
		};

		await this.callHook("client:pre-query", data, context);

		if (data.output) {
			this.callHook("client:pre-query-override", data, context);
			return OK(data.output as Query<Data>);
		}

		let result: QueryResult;
		try {
			result = await this._client.query(data.input.query, data.input.values);
		} catch (error) {
			setIssueForContext(context, {
				code: "query_error",
				errorMessage: (error as Error).message,
			});

			return INVALID;
		}

		const finalResult = {
			input: data.input,
			output: {
				rows: result.rows,
				rowCount: result.rowCount,
				command: result.command,
				input: data.input,
			},
		};

		await this.callHook("client:post-query", finalResult, context);

		return OK(finalResult.output);
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
