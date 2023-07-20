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
import { PgTError } from "../../PgTError.js";

// MultiRange types were introduced in PostgreSQL 14, because we test against older versions, we need to skip coverage for this file
/* c8 ignore start */

export interface PgTDateMultiRangeConfig<TMode extends "DateMultiRange" | "string" = "DateMultiRange" | "string"> {
	mode?: TMode;
}

export type PgTDateMultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "DateMultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "DateMultiRange" ? DateMultiRange : string,
	TDriverParameter = DateMultiRange
> = PgTDateMultiRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTDateMultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTDateMultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTDateMultiRangeHKT;
}
export interface PgTDateMultiRangeHKT extends ColumnHKTBase {
	_type: PgTDateMultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers DateMultiRange
export type PgTDateMultiRangeBuilderInitial<TName extends string> = PgTDateMultiRangeBuilder<{
	name: TName;
	data: DateMultiRange;
	driverParam: DateMultiRange;
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
		const result = DateMultiRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers DateMultiRange as string
export type PgTDateMultiRangeStringBuilderInitial<TName extends string> = PgTDateMultiRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: DateMultiRange;
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
		const result = DateMultiRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
