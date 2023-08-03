/* eslint-disable unicorn/filename-case */
import { TimestampTZMultiRange } from "@postgresql-typed/parsers";
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

// MultiRange types were introduced in PostgreSQL 14, because we test against older versions, we need to skip coverage for this file
/* c8 ignore start */

export interface PgTTimestampTZMultiRangeConfig<TMode extends "TimestampTZMultiRange" | "string" = "TimestampTZMultiRange" | "string"> {
	mode?: TMode;
}

export type PgTTimestampTZMultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampTZMultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampTZMultiRange" ? TimestampTZMultiRange : string,
	TDriverParameter = TimestampTZMultiRange,
> = PgTTimestampTZMultiRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimestampTZMultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampTZMultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampTZMultiRangeHKT;
}
export interface PgTTimestampTZMultiRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampTZMultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampTZMultiRange
export type PgTTimestampTZMultiRangeBuilderInitial<TName extends string> = PgTTimestampTZMultiRangeBuilder<{
	name: TName;
	data: TimestampTZMultiRange;
	driverParam: TimestampTZMultiRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZMultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZMultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeBuilder";

	build<TTableTimestampTZMultiRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampTZMultiRange }>
	): PgTTimestampTZMultiRange<MakeColumnConfig<T, TTableTimestampTZMultiRange>> {
		return new PgTTimestampTZMultiRange<MakeColumnConfig<T, TTableTimestampTZMultiRange>>(table, this.config);
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

export class PgTTimestampTZMultiRange<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRange";

	getSQLType(): string {
		return "tstzmultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZMultiRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampTZMultiRange as string
export type PgTTimestampTZMultiRangeStringBuilderInitial<TName extends string> = PgTTimestampTZMultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: TimestampTZMultiRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZMultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeStringBuilder";

	build<TTableTimestampTZMultiRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampTZMultiRange }>
	): PgTTimestampTZMultiRangeString<MakeColumnConfig<T, TTableTimestampTZMultiRange>> {
		return new PgTTimestampTZMultiRangeString<MakeColumnConfig<T, TTableTimestampTZMultiRange>>(table, this.config);
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

export class PgTTimestampTZMultiRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZMultiRangeString";

	getSQLType(): string {
		return "tstzmultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZMultiRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampTZMultiRange<TTimestampTZMultiRange extends string, TMode extends PgTTimestampTZMultiRangeConfig["mode"] & {}>(
	name: TTimestampTZMultiRange,
	config?: PgTTimestampTZMultiRangeConfig<TMode>
): Equal<TMode, "TimestampTZMultiRange"> extends true
	? PgTTimestampTZMultiRangeBuilderInitial<TTimestampTZMultiRange>
	: PgTTimestampTZMultiRangeStringBuilderInitial<TTimestampTZMultiRange>;
export function defineTimestampTZMultiRange(name: string, config: PgTTimestampTZMultiRangeConfig = {}) {
	if (config.mode === "TimestampTZMultiRange") return new PgTTimestampTZMultiRangeBuilder(name);
	return new PgTTimestampTZMultiRangeStringBuilder(name);
}
