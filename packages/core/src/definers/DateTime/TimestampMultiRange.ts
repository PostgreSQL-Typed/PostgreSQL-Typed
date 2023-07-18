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
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";

// MultiRange types were introduced in PostgreSQL 14, because we test against older versions, we need to skip coverage for this file
/* c8 ignore start */

export interface PgTTimestampMultiRangeConfig<TMode extends "TimestampMultiRange" | "string" = "TimestampMultiRange" | "string"> {
	mode?: TMode;
}

export type PgTTimestampMultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampMultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampMultiRange" ? TimestampMultiRange : string,
	TDriverParameter = TimestampMultiRange
> = PgTTimestampMultiRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimestampMultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampMultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampMultiRangeHKT;
}
export interface PgTTimestampMultiRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampMultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampMultiRange
export type PgTTimestampMultiRangeBuilderInitial<TName extends string> = PgTTimestampMultiRangeBuilder<{
	name: TName;
	data: TimestampMultiRange;
	driverParam: TimestampMultiRange;
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

export class PgTTimestampMultiRange<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRange";

	getSQLType(): string {
		return "tsmultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampMultiRange.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampMultiRange as string
export type PgTTimestampMultiRangeStringBuilderInitial<TName extends string> = PgTTimestampMultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: TimestampMultiRange;
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

export class PgTTimestampMultiRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampMultiRangeString";

	getSQLType(): string {
		return "tsmultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimestampMultiRange.from(value as string);
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
