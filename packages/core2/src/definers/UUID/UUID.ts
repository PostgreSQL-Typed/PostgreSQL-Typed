/* eslint-disable unicorn/filename-case */
import { UUID } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgUUID, PgUUIDBuilder } from "drizzle-orm/pg-core";

export interface PgTUUIDConfig<TMode extends "UUID" | "string" = "UUID" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers UUID
export type PgTUUIDBuilderInitial<TName extends string> = PgTUUIDBuilder<{
	name: TName;
	data: UUID;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTUUIDBuilder<T extends ColumnBuilderBaseConfig> extends PgUUIDBuilder<T> {
	static readonly [entityKind]: string = "PgTUUIDBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTUUID<MakeColumnConfig<T, TTableName>> {
		return new PgTUUID<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTUUID<T extends ColumnBaseConfig> extends PgUUID<T> {
	static readonly [entityKind]: string = "PgTUUID";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return UUID.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return UUID.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers UUID as string
export type PgTUUIDStringBuilderInitial<TName extends string> = PgTUUIDStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTUUIDStringBuilder<T extends ColumnBuilderBaseConfig> extends PgUUIDBuilder<T> {
	static readonly [entityKind]: string = "PgTUUIDStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTUUIDString<MakeColumnConfig<T, TTableName>> {
		return new PgTUUIDString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTUUIDString<T extends ColumnBaseConfig> extends PgUUID<T> {
	static readonly [entityKind]: string = "PgTUUIDString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return UUID.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return UUID.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineUUID<TName extends string, TMode extends PgTUUIDConfig["mode"] & {}>(
	name: TName,
	config?: PgTUUIDConfig<TMode>
): Equal<TMode, "UUID"> extends true ? PgTUUIDBuilderInitial<TName> : PgTUUIDStringBuilderInitial<TName>;
export function defineUUID(name: string, config: PgTUUIDConfig = {}) {
	if (config.mode === "UUID") return new PgTUUIDBuilder(name);
	return new PgTUUIDStringBuilder(name);
}
