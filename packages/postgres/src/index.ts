import { BaseClient, Context, getErrorMap, PgTError, PostgresData, Query, RawPostgresData, setIssueForContext } from "@postgresql-typed/core";
import { getParsedType, INVALID, isOneOf, loadPgTConfig, OK, ParsedType, ParseReturnType, type PgTConfigSchema } from "@postgresql-typed/util";
import postgres from "postgres";

import { types } from "./types.js";

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends BaseClient<InnerPostgresData, Ready> {
	private _client: postgres.Sql<Record<string, any>>;
	private _ready = false;
	private _connectionError?: PgTError;
	private _extensionsInstalled = false;
	private _config = {} as PgTConfigSchema;

	constructor(postgresData: RawPostgresData<InnerPostgresData>, url: string, options?: postgres.Options<Record<string, postgres.PostgresType>>);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, options?: postgres.Options<Record<string, postgres.PostgresType>>);
	constructor(
		postgresData: RawPostgresData<InnerPostgresData>,
		urlOrOptions?: string | postgres.Options<Record<string, postgres.PostgresType>>,
		options?: postgres.Options<Record<string, postgres.PostgresType>>
	) {
		super(postgresData);

		this._client = typeof urlOrOptions === "string" ? postgres(urlOrOptions, { ...options, types }) : postgres({ ...urlOrOptions, types });

		loadPgTConfig().then(config => {
			this._config = config.config;
		});
	}

	async testConnection(
		url: string,
		options?: postgres.Options<Record<string, postgres.PostgresType>>
	): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(
		options?: postgres.Options<Record<string, postgres.PostgresType>>
	): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(
		urlOrOptions?: string | postgres.Options<Record<string, postgres.PostgresType>>,
		options?: postgres.Options<Record<string, postgres.PostgresType>>
	): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>> {
		this._ready = false;

		if (urlOrOptions !== undefined) {
			await this._client.end();
			this._client = typeof urlOrOptions === "string" ? postgres(urlOrOptions, { ...options, types }) : postgres({ ...urlOrOptions, types });
		}

		if (!this._extensionsInstalled) {
			await this.initExtensions();
			this._extensionsInstalled = true;
		}

		try {
			await this.callHook("client:pre-connect");
		} catch {
			// eslint-disable-next-line no-console
			console.error("Error in client:pre-connect hook, continuing...");
		}

		try {
			await this._client.unsafe("SELECT 1");
			this._ready = true;

			try {
				await this.callHook("client:post-connect");
			} catch {
				// eslint-disable-next-line no-console
				console.error("Error in client:post-connect hook, continuing...");
			}

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

		try {
			await this.callHook("client:pre-query", data, context);
		} catch {
			// eslint-disable-next-line no-console
			console.error("Error in client:pre-query hook, continuing...");
		}

		if (data.output) {
			try {
				await this.callHook("client:pre-query-override", data, context);
			} catch {
				// eslint-disable-next-line no-console
				console.error("Error in client:pre-query-override hook, continuing...");
			}
			return OK(data.output as Query<Data>);
		}

		let result: Awaited<ReturnType<typeof this._client.unsafe>>;
		try {
			result = await this._client.unsafe(data.input.query, data.input.values);
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
				rows: [...result.values()],
				rowCount: result.count,
				command: result.command,
				input: data.input,
			},
		};

		try {
			await this.callHook("client:post-query", finalResult, context);
		} catch {
			// eslint-disable-next-line no-console
			console.error("Error in client:post-query hook, continuing...");
		}

		return OK(finalResult.output);
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	get connectionError(): PgTError | undefined {
		return this._connectionError;
	}

	get client(): postgres.Sql<Record<string, any>> {
		return this._client;
	}

	get PgTConfig(): PgTConfigSchema {
		return this._config;
	}
}

export { isReady } from "@postgresql-typed/core";
