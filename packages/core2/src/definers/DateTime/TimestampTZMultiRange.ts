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

export interface PgTTimestampTZMultiRangeConfig<TMode extends "TimestampTZMultiRange" | "string" = "TimestampTZMultiRange" | "string"> {
	mode?: TMode;
}
export interface PgTTimestampTZMultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampTZMultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampTZMultiRangeHKT;
}
export interface PgTTimestampTZMultiRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampTZMultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampTZMultiRange
export type PgTTimestampTZMultiRangeBuilderInitial<TTimestampTZMultiRange extends string> = PgTTimestampTZMultiRangeBuilder<{
	name: TTimestampTZMultiRange;
	data: TimestampTZMultiRange;
	driverParam: string;
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
		return TimestampTZMultiRange.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampTZMultiRange as string
export type PgTTimestampTZMultiRangeStringBuilderInitial<TTimestampTZMultiRange extends string> = PgTTimestampTZMultiRangeStringBuilder<{
	name: TTimestampTZMultiRange;
	data: string;
	driverParam: string;
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
		return TimestampTZMultiRange.from(value as string);
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
