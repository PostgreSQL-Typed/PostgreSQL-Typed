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
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";

export interface PgTIntervalConfig<TMode extends "Interval" | "string" = "Interval" | "string"> {
	mode?: TMode;
}

export type PgTIntervalType<
	TTableName extends string,
	TName extends string,
	TMode extends "Interval" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Interval" ? Interval : string,
	TDriverParameter = Interval
> = PgTInterval<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTIntervalBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTIntervalBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTIntervalHKT;
}
export interface PgTIntervalHKT extends ColumnHKTBase {
	_type: PgTInterval<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Interval
export type PgTIntervalBuilderInitial<TName extends string> = PgTIntervalBuilder<{
	name: TName;
	data: Interval;
	driverParam: Interval;
	notNull: false;
	hasDefault: false;
}>;

export class PgTIntervalBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTIntervalBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTIntervalBuilder";

	build<TTableInterval extends string>(table: AnyPgTable<{ name: TTableInterval }>): PgTInterval<MakeColumnConfig<T, TTableInterval>> {
		return new PgTInterval<MakeColumnConfig<T, TTableInterval>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
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
		return Interval.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Interval as string
export type PgTIntervalStringBuilderInitial<TName extends string> = PgTIntervalStringBuilder<{
	name: TName;
	data: string;
	driverParam: Interval;
	notNull: false;
	hasDefault: false;
}>;

export class PgTIntervalStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTIntervalBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTIntervalStringBuilder";

	build<TTableInterval extends string>(table: AnyPgTable<{ name: TTableInterval }>): PgTIntervalString<MakeColumnConfig<T, TTableInterval>> {
		return new PgTIntervalString<MakeColumnConfig<T, TTableInterval>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
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
		return Interval.from(value as string);
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
