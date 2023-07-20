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
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTTimestampTZRangeConfig<TMode extends "TimestampTZRange" | "string" = "TimestampTZRange" | "string"> {
	mode?: TMode;
}

export type PgTTimestampTZRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampTZRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampTZRange" ? TimestampTZRange : string,
	TDriverParameter = TimestampTZRange
> = PgTTimestampTZRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimestampTZRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampTZRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampTZRangeHKT;
}
export interface PgTTimestampTZRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampTZRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampTZRange
export type PgTTimestampTZRangeBuilderInitial<TName extends string> = PgTTimestampTZRangeBuilder<{
	name: TName;
	data: TimestampTZRange;
	driverParam: TimestampTZRange;
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

export class PgTTimestampTZRange<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZRange";

	getSQLType(): string {
		return "tstzrange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampTZRange as string
export type PgTTimestampTZRangeStringBuilderInitial<TName extends string> = PgTTimestampTZRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: TimestampTZRange;
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

export class PgTTimestampTZRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZRangeString";

	getSQLType(): string {
		return "tstzrange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
