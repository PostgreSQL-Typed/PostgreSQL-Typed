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
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTDateRangeConfig<TMode extends "DateRange" | "string" = "DateRange" | "string"> {
	mode?: TMode;
}

export type PgTDateRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "DateRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "DateRange" ? DateRange : string,
	TDriverParameter = DateRange,
> = PgTDateRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTDateRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTDateRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTDateRangeHKT;
}
export interface PgTDateRangeHKT extends ColumnHKTBase {
	_type: PgTDateRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers DateRange
export type PgTDateRangeBuilderInitial<TName extends string> = PgTDateRangeBuilder<{
	name: TName;
	data: DateRange;
	driverParam: DateRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateRangeBuilder";

	build<TTableDateRange extends string>(table: AnyPgTable<{ name: TTableDateRange }>): PgTDateRange<MakeColumnConfig<T, TTableDateRange>> {
		return new PgTDateRange<MakeColumnConfig<T, TTableDateRange>>(table, this.config);
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

export class PgTDateRange<T extends ColumnBaseConfig> extends PgColumn<PgTDateRangeHKT, T> {
	static readonly [entityKind]: string = "PgTDateRange";

	getSQLType(): string {
		return "daterange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = DateRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers DateRange as string
export type PgTDateRangeStringBuilderInitial<TName extends string> = PgTDateRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: DateRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateRangeStringBuilder";

	build<TTableDateRange extends string>(table: AnyPgTable<{ name: TTableDateRange }>): PgTDateRangeString<MakeColumnConfig<T, TTableDateRange>> {
		return new PgTDateRangeString<MakeColumnConfig<T, TTableDateRange>>(table, this.config);
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

export class PgTDateRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTDateRangeHKT, T> {
	static readonly [entityKind]: string = "PgTDateRangeString";

	getSQLType(): string {
		return "daterange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = DateRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
