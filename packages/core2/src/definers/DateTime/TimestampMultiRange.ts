import { TimestampMultiRange } from "@postgresql-typed/parsers";
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

export interface PgTTimestampMultiRangeConfig<TMode extends "TimestampMultiRange" | "string" = "TimestampMultiRange" | "string"> {
	mode?: TMode;
}
export interface PgTTimestampMultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampMultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampMultiRangeHKT;
}
export interface PgTTimestampMultiRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampMultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampMultiRange
export type PgTTimestampMultiRangeBuilderInitial<TTimestampMultiRange extends string> = PgTTimestampMultiRangeBuilder<{
	name: TTimestampMultiRange;
	data: TimestampMultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampMultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampMultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeBuilder";

	build<TTableTimestampMultiRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampMultiRange }>
	): PgTTimestampMultiRange<MakeColumnConfig<T, TTableTimestampMultiRange>> {
		return new PgTTimestampMultiRange<MakeColumnConfig<T, TTableTimestampMultiRange>>(table, this.config);
	}
}

export class PgTTimestampMultiRange<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRange";

	getSQLType(): string {
		return "tsmultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampMultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampMultiRange as string
export type PgTTimestampMultiRangeStringBuilderInitial<TTimestampMultiRange extends string> = PgTTimestampMultiRangeStringBuilder<{
	name: TTimestampMultiRange;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampMultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeStringBuilder";

	build<TTableTimestampMultiRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampMultiRange }>
	): PgTTimestampMultiRangeString<MakeColumnConfig<T, TTableTimestampMultiRange>> {
		return new PgTTimestampMultiRangeString<MakeColumnConfig<T, TTableTimestampMultiRange>>(table, this.config);
	}
}

export class PgTTimestampMultiRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeString";

	getSQLType(): string {
		return "tsmultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampMultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampMultiRange<TTimestampMultiRange extends string, TMode extends PgTTimestampMultiRangeConfig["mode"] & {}>(
	name: TTimestampMultiRange,
	config?: PgTTimestampMultiRangeConfig<TMode>
): Equal<TMode, "TimestampMultiRange"> extends true
	? PgTTimestampMultiRangeBuilderInitial<TTimestampMultiRange>
	: PgTTimestampMultiRangeStringBuilderInitial<TTimestampMultiRange>;
export function defineTimestampMultiRange(name: string, config: PgTTimestampMultiRangeConfig = {}) {
	if (config.mode === "TimestampMultiRange") return new PgTTimestampMultiRangeBuilder(name);
	return new PgTTimestampMultiRangeStringBuilder(name);
}
