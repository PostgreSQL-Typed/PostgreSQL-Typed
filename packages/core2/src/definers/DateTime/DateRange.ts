import { DateRange } from "@postgresql-typed/parsers";
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

export interface PgTDateRangeConfig<TMode extends "DateRange" | "string" = "DateRange" | "string"> {
	mode?: TMode;
}
export interface PgTDateRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTDateRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTDateRangeHKT;
}
export interface PgTDateRangeHKT extends ColumnHKTBase {
	_type: PgTDateRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers DateRange
export type PgTDateRangeBuilderInitial<TDateRange extends string> = PgTDateRangeBuilder<{
	name: TDateRange;
	data: DateRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateRangeBuilder";

	build<TTableDateRange extends string>(table: AnyPgTable<{ name: TTableDateRange }>): PgTDateRange<MakeColumnConfig<T, TTableDateRange>> {
		return new PgTDateRange<MakeColumnConfig<T, TTableDateRange>>(table, this.config);
	}
}

export class PgTDateRange<T extends ColumnBaseConfig> extends PgColumn<PgTDateRangeHKT, T> {
	static readonly [entityKind]: string = "PgTDateRange";

	getSQLType(): string {
		return "daterange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers DateRange as string
export type PgTDateRangeStringBuilderInitial<TDateRange extends string> = PgTDateRangeStringBuilder<{
	name: TDateRange;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateRangeStringBuilder";

	build<TTableDateRange extends string>(table: AnyPgTable<{ name: TTableDateRange }>): PgTDateRangeString<MakeColumnConfig<T, TTableDateRange>> {
		return new PgTDateRangeString<MakeColumnConfig<T, TTableDateRange>>(table, this.config);
	}
}

export class PgTDateRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTDateRangeHKT, T> {
	static readonly [entityKind]: string = "PgTDateRangeString";

	getSQLType(): string {
		return "daterange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineDateRange<TDateRange extends string, TMode extends PgTDateRangeConfig["mode"] & {}>(
	name: TDateRange,
	config?: PgTDateRangeConfig<TMode>
): Equal<TMode, "DateRange"> extends true ? PgTDateRangeBuilderInitial<TDateRange> : PgTDateRangeStringBuilderInitial<TDateRange>;
export function defineDateRange(name: string, config: PgTDateRangeConfig = {}) {
	if (config.mode === "DateRange") return new PgTDateRangeBuilder(name);
	return new PgTDateRangeStringBuilder(name);
}
