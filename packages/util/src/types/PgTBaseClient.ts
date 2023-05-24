import type { Hookable } from "hookable";

import type { PgTConfigSchema } from "../util/config/configs/index.js";
import type { PgTError } from "../util/PgTError.js";
import type { ClientHooks } from "./ClientHooks.js";
import type { PostgresData } from "./PostgresData.js";
import type { Query } from "./Query.js";
import type { Safe } from "./Safe.js";

export interface PgTBaseClient<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends Hookable<ClientHooks> {
	testConnection(): Promise<PgTBaseClient<InnerPostgresData, true> | PgTBaseClient<InnerPostgresData, false>>;
	get PgTConfig(): PgTConfigSchema;
	get ready(): Ready;
	get connectionError(): PgTError | undefined;
	query<Data>(query: string, variables: string[]): Promise<Query<Data>>;
	query<Data>(...data: unknown[]): Promise<Query<Data>>;
	safeQuery<Data>(query: string, variables: string[]): Promise<Safe<Query<Data>>>;
	safeQuery<Data>(...data: unknown[]): Promise<Safe<Query<Data>>>;
}
