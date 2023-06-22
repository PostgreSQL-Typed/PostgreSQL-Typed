/* eslint-disable unicorn/filename-case */
import { TimestampTZRange } from "@postgresql-typed/parsers";
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

export interface PgTTimestampTZRangeConfig<TMode extends "TimestampTZRange" | "string" = "TimestampTZRange" | "string"> {
	mode?: TMode;
}
export interface PgTTimestampTZRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampTZRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampTZRangeHKT;
}
export interface PgTTimestampTZRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampTZRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampTZRange
export type PgTTimestampTZRangeBuilderInitial<TTimestampTZRange extends string> = PgTTimestampTZRangeBuilder<{
	name: TTimestampTZRange;
	data: TimestampTZRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeBuilder";

	build<TTableTimestampTZRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampTZRange }>
	): PgTTimestampTZRange<MakeColumnConfig<T, TTableTimestampTZRange>> {
		return new PgTTimestampTZRange<MakeColumnConfig<T, TTableTimestampTZRange>>(table, this.config);
	}
}

export class PgTTimestampTZRange<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZRange";

	getSQLType(): string {
		return "tstzrange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampTZRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampTZRange as string
export type PgTTimestampTZRangeStringBuilderInitial<TTimestampTZRange extends string> = PgTTimestampTZRangeStringBuilder<{
	name: TTimestampTZRange;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeStringBuilder";

	build<TTableTimestampTZRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampTZRange }>
	): PgTTimestampTZRangeString<MakeColumnConfig<T, TTableTimestampTZRange>> {
		return new PgTTimestampTZRangeString<MakeColumnConfig<T, TTableTimestampTZRange>>(table, this.config);
	}
}

export class PgTTimestampTZRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeString";

	getSQLType(): string {
		return "tstzrange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampTZRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampTZRange<TTimestampTZRange extends string, TMode extends PgTTimestampTZRangeConfig["mode"] & {}>(
	name: TTimestampTZRange,
	config?: PgTTimestampTZRangeConfig<TMode>
): Equal<TMode, "TimestampTZRange"> extends true
	? PgTTimestampTZRangeBuilderInitial<TTimestampTZRange>
	: PgTTimestampTZRangeStringBuilderInitial<TTimestampTZRange>;
export function defineTimestampTZRange(name: string, config: PgTTimestampTZRangeConfig = {}) {
	if (config.mode === "TimestampTZRange") return new PgTTimestampTZRangeBuilder(name);
	return new PgTTimestampTZRangeStringBuilder(name);
}
