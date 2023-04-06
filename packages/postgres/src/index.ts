import { BaseClient, Context, getErrorMap, PGTError, PostgresData, Query, RawPostgresData, setIssueForContext } from "@postgresql-typed/core";
import { getParsedType, INVALID, isOneOf, OK, ParsedType, ParseReturnType } from "@postgresql-typed/util";
import postgres from "postgres";

import { types } from "./types.js";

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends BaseClient<InnerPostgresData, Ready> {
	private _client: postgres.Sql<Record<string, any>>;
	private _ready = false;
	private _connectionError?: PGTError;

	constructor(postgresData: RawPostgresData<InnerPostgresData>, url: string, options?: postgres.Options<Record<string, postgres.PostgresType>>);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, options?: postgres.Options<Record<string, postgres.PostgresType>>);
	constructor(
		postgresData: RawPostgresData<InnerPostgresData>,
		urlOrOptions?: string | postgres.Options<Record<string, postgres.PostgresType>>,
		options?: postgres.Options<Record<string, postgres.PostgresType>>
	) {
		super(postgresData);

		this._client = typeof urlOrOptions === "string" ? postgres(urlOrOptions, { ...options, types }) : postgres({ ...urlOrOptions, types });
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

		if (urlOrOptions !== undefined) this._client = typeof urlOrOptions === "string" ? postgres(urlOrOptions, options) : postgres(urlOrOptions);

		try {
			await this._client.unsafe("SELECT 1");
			this._ready = true;
			return this as Client<InnerPostgresData, true>;
		} catch (error) {
			this._connectionError = new PGTError({
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

		//* context should have [string, (string | number | boolean)[]]
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
			allowedInnerValueTypes = [ParsedType.number, ParsedType.string, ParsedType.boolean],
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

		return this._runQuery<Data>(context, query as string, values as (string | number | boolean)[]);
	}

	//* Run the actual query
	private async _runQuery<Data>(context: Context, query: string, values: (string | number | boolean)[]): Promise<ParseReturnType<Query<Data>>> {
		let result: Awaited<ReturnType<typeof this._client.unsafe>>;
		try {
			result = await this._client.unsafe(query, values);
		} catch (error) {
			setIssueForContext(context, {
				code: "query_error",
				errorMessage: (error as Error).message,
			});

			return INVALID;
		}

		return OK({
			rows: [...result.values()],
			rowCount: result.count,
			command: result.command,
		});
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	get connectionError(): PGTError | undefined {
		return this._connectionError;
	}
}

export { isReady } from "@postgresql-typed/core";
