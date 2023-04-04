import { BaseClient, PostgresData } from "@postgresql-typed/core";

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends BaseClient<InnerPostgresData, Ready> {}
