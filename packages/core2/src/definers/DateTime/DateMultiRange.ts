import { DateMultiRange } from "@postgresql-typed/parsers";
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

export interface PgTDateMultiRangeConfig<TMode extends "DateMultiRange" | "string" = "DateMultiRange" | "string"> {
	mode?: TMode;
}
export interface PgTDateMultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTDateMultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTDateMultiRangeHKT;
}
export interface PgTDateMultiRangeHKT extends ColumnHKTBase {
	_type: PgTDateMultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers DateMultiRange
export type PgTDateMultiRangeBuilderInitial<TDateMultiRange extends string> = PgTDateMultiRangeBuilder<{
	name: TDateMultiRange;
	data: DateMultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateMultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateMultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateMultiRangeBuilder";

	build<TTableDateMultiRange extends string>(table: AnyPgTable<{ name: TTableDateMultiRange }>): PgTDateMultiRange<MakeColumnConfig<T, TTableDateMultiRange>> {
		return new PgTDateMultiRange<MakeColumnConfig<T, TTableDateMultiRange>>(table, this.config);
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

export class PgTDateMultiRange<T extends ColumnBaseConfig> extends PgColumn<PgTDateMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTDateMultiRange";

	getSQLType(): string {
		return "datemultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateMultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateMultiRange.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers DateMultiRange as string
export type PgTDateMultiRangeStringBuilderInitial<TDateMultiRange extends string> = PgTDateMultiRangeStringBuilder<{
	name: TDateMultiRange;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateMultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateMultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateMultiRangeStringBuilder";

	build<TTableDateMultiRange extends string>(
		table: AnyPgTable<{ name: TTableDateMultiRange }>
	): PgTDateMultiRangeString<MakeColumnConfig<T, TTableDateMultiRange>> {
		return new PgTDateMultiRangeString<MakeColumnConfig<T, TTableDateMultiRange>>(table, this.config);
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

export class PgTDateMultiRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTDateMultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTDateMultiRangeString";

	getSQLType(): string {
		return "datemultirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return DateMultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return DateMultiRange.from(value as string);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineDateMultiRange<TDateMultiRange extends string, TMode extends PgTDateMultiRangeConfig["mode"] & {}>(
	name: TDateMultiRange,
	config?: PgTDateMultiRangeConfig<TMode>
): Equal<TMode, "DateMultiRange"> extends true ? PgTDateMultiRangeBuilderInitial<TDateMultiRange> : PgTDateMultiRangeStringBuilderInitial<TDateMultiRange>;
export function defineDateMultiRange(name: string, config: PgTDateMultiRangeConfig = {}) {
	if (config.mode === "DateMultiRange") return new PgTDateMultiRangeBuilder(name);
	return new PgTDateMultiRangeStringBuilder(name);
}
