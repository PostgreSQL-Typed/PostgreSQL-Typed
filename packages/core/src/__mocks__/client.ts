import { OID } from "@postgresql-typed/oids";
import { CharacterVarying, parser, UUID } from "@postgresql-typed/parsers";
import { type Context, INVALID, OK, ParseReturnType, type PostgresData, type Query } from "@postgresql-typed/util";
import { Client as PGClient, type ClientConfig, type QueryResult, types } from "pg";

import { BaseClient } from "../classes/BaseClient.js";
import { setIssueForContext } from "../functions/setIssueForContext.js";
import type { RawPostgresData } from "../types/types/RawPostgresData.js";

types.setTypeParser(OID.varchar as any, parser<CharacterVarying<number>>(CharacterVarying));
types.setTypeParser(OID.uuid as any, parser<UUID>(UUID));

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends BaseClient<InnerPostgresData, Ready> {
	private _client: PGClient;
	private _ready = false;

	constructor(postgresData: RawPostgresData<InnerPostgresData>, connectionString: string);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, config: ClientConfig);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, pgConfig?: string | ClientConfig);
	constructor(postgresData: RawPostgresData<InnerPostgresData>, pgConfig?: string | ClientConfig) {
		super(postgresData);

		this._client = new PGClient(pgConfig);
	}

	async testConnection(connectionString: string): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(config: ClientConfig): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(pgConfig?: string | ClientConfig): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>>;
	async testConnection(pgConfig?: string | ClientConfig): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>> {
		this._ready = false;
		if (pgConfig) this._client = new PGClient(pgConfig);
		try {
			await this._client.connect();
			await this._client.query("SELECT 1");
			this._ready = true;
			return this as Client<InnerPostgresData, true>;
		} catch {
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

		const [query, values] = context.data;

		return this._runQuery<Data>(context, query as string, values as string[]);
	}

	//* Run the actual query
	private async _runQuery<Data>(context: Context, query: string, values: string[]): Promise<ParseReturnType<Query<Data>>> {
		let result: QueryResult;
		try {
			result = await this._client.query(query, values);
		} catch {
			//* Don't set an issue here to test the error handling
			return INVALID;
		}

		return OK({
			rows: result.rows,
			rowCount: result.rowCount,
			command: result.command,
			input: {
				query,
				values,
			},
		});
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	get connectionError(): undefined {
		return undefined;
	}

	get client(): PGClient {
		return this._client;
	}
}
