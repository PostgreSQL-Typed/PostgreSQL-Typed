/* eslint-disable unicorn/filename-case */
import { Interval } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgInterval, PgIntervalBuilder } from "drizzle-orm/pg-core";

export interface PgTIntervalConfig<TMode extends "Interval" | "string" = "Interval" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Interval
export type PgTIntervalBuilderInitial<TName extends string> = PgTIntervalBuilder<{
	name: TName;
	data: Interval;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTIntervalBuilder<T extends ColumnBuilderBaseConfig> extends PgIntervalBuilder<T> {
	static readonly [entityKind]: string = "PgTIntervalBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTInterval<MakeColumnConfig<T, TTableName>> {
		return new PgTInterval<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTInterval<T extends ColumnBaseConfig> extends PgInterval<T> {
	static readonly [entityKind]: string = "PgTInterval";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Interval.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Interval.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Interval as string
export type PgTIntervalStringBuilderInitial<TName extends string> = PgTIntervalStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTIntervalStringBuilder<T extends ColumnBuilderBaseConfig> extends PgIntervalBuilder<T> {
	static readonly [entityKind]: string = "PgTIntervalStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTIntervalString<MakeColumnConfig<T, TTableName>> {
		return new PgTIntervalString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTIntervalString<T extends ColumnBaseConfig> extends PgInterval<T> {
	static readonly [entityKind]: string = "PgTIntervalString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Interval.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Interval.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInterval<TName extends string, TMode extends PgTIntervalConfig["mode"] & {}>(
	name: TName,
	config?: PgTIntervalConfig<TMode>
): Equal<TMode, "Interval"> extends true ? PgTIntervalBuilderInitial<TName> : PgTIntervalStringBuilderInitial<TName>;
export function defineInterval(name: string, config: PgTIntervalConfig = {}) {
	if (config.mode === "Interval") return new PgTIntervalBuilder(name, {});
	return new PgTIntervalStringBuilder(name, {});
}
