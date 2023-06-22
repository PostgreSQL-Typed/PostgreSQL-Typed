import { Interval } from "@postgresql-typed/parsers";
import {
	type Assume,
	type ColumnBaseConfig,
	type ColumnBuilderBaseConfig,
	type ColumnBuilderHKTBase,
	type ColumnHKTBase,
	entityKind,
	type Equal,
	type MakeColumnConfig,
} from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

export interface PgTIntervalConfig<TMode extends "Interval" | "string" = "Interval" | "string"> {
	mode?: TMode;
}
export interface PgTIntervalBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTIntervalBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTIntervalHKT;
}
export interface PgTIntervalHKT extends ColumnHKTBase {
	_type: PgTInterval<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Interval
export type PgTIntervalBuilderInitial<TInterval extends string> = PgTIntervalBuilder<{
	name: TInterval;
	data: Interval;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTIntervalBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTIntervalBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTIntervalBuilder";

	build<TTableInterval extends string>(table: AnyPgTable<{ name: TTableInterval }>): PgTInterval<MakeColumnConfig<T, TTableInterval>> {
		return new PgTInterval<MakeColumnConfig<T, TTableInterval>>(table, this.config);
	}
}

export class PgTInterval<T extends ColumnBaseConfig> extends PgColumn<PgTIntervalHKT, T> {
	static readonly [entityKind]: string = "PgTInterval";

	getSQLType(): string {
		return "interval";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Interval.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Interval.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Interval as string
export type PgTIntervalStringBuilderInitial<TInterval extends string> = PgTIntervalStringBuilder<{
	name: TInterval;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTIntervalStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTIntervalBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTIntervalStringBuilder";

	build<TTableInterval extends string>(table: AnyPgTable<{ name: TTableInterval }>): PgTIntervalString<MakeColumnConfig<T, TTableInterval>> {
		return new PgTIntervalString<MakeColumnConfig<T, TTableInterval>>(table, this.config);
	}
}

export class PgTIntervalString<T extends ColumnBaseConfig> extends PgColumn<PgTIntervalHKT, T> {
	static readonly [entityKind]: string = "PgTIntervalString";

	getSQLType(): string {
		return "interval";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Interval.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Interval.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInterval<TInterval extends string, TMode extends PgTIntervalConfig["mode"] & {}>(
	name: TInterval,
	config?: PgTIntervalConfig<TMode>
): Equal<TMode, "Interval"> extends true ? PgTIntervalBuilderInitial<TInterval> : PgTIntervalStringBuilderInitial<TInterval>;
export function defineInterval(name: string, config: PgTIntervalConfig = {}) {
	if (config.mode === "Interval") return new PgTIntervalBuilder(name);
	return new PgTIntervalStringBuilder(name);
}
