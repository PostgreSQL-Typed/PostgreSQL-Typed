import { TimestampRange } from "@postgresql-typed/parsers";
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

export interface PgTTimestampRangeConfig<TMode extends "TimestampRange" | "string" = "TimestampRange" | "string"> {
	mode?: TMode;
}

export type PgTTimestampRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampRange" ? TimestampRange : string,
	TDriverParameter = TimestampRange
> = PgTTimestampRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimestampRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampRangeHKT;
}
export interface PgTTimestampRangeHKT extends ColumnHKTBase {
	_type: PgTTimestampRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers TimestampRange
export type PgTTimestampRangeBuilderInitial<TName extends string> = PgTTimestampRangeBuilder<{
	name: TName;
	data: TimestampRange;
	driverParam: TimestampRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampRangeBuilder";

	build<TTableTimestampRange extends string>(table: AnyPgTable<{ name: TTableTimestampRange }>): PgTTimestampRange<MakeColumnConfig<T, TTableTimestampRange>> {
		return new PgTTimestampRange<MakeColumnConfig<T, TTableTimestampRange>>(table, this.config);
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

export class PgTTimestampRange<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampRange";

	getSQLType(): string {
		return "tsrange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers TimestampRange as string
export type PgTTimestampRangeStringBuilderInitial<TName extends string> = PgTTimestampRangeStringBuilder<{
	name: TName;
	data: string;
	driverParam: TimestampRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampRangeStringBuilder";

	build<TTableTimestampRange extends string>(
		table: AnyPgTable<{ name: TTableTimestampRange }>
	): PgTTimestampRangeString<MakeColumnConfig<T, TTableTimestampRange>> {
		return new PgTTimestampRangeString<MakeColumnConfig<T, TTableTimestampRange>>(table, this.config);
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

export class PgTTimestampRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampRangeHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampRangeString";

	getSQLType(): string {
		return "tsrange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampRange<TTimestampRange extends string, TMode extends PgTTimestampRangeConfig["mode"] & {}>(
	name: TTimestampRange,
	config?: PgTTimestampRangeConfig<TMode>
): Equal<TMode, "TimestampRange"> extends true ? PgTTimestampRangeBuilderInitial<TTimestampRange> : PgTTimestampRangeStringBuilderInitial<TTimestampRange>;
export function defineTimestampRange(name: string, config: PgTTimestampRangeConfig = {}) {
	if (config.mode === "TimestampRange") return new PgTTimestampRangeBuilder(name);
	return new PgTTimestampRangeStringBuilder(name);
}
