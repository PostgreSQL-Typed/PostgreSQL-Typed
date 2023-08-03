import { Int8MultiRange } from "@postgresql-typed/parsers";
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

export interface PgTInt8MultiRangeConfig<TMode extends "Int8MultiRange" | "string" = "Int8MultiRange" | "string"> {
	mode?: TMode;
}

export type PgTInt8MultiRangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "Int8MultiRange" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int8MultiRange" ? Int8MultiRange : string,
	TDriverParameter = Int8MultiRange,
> = PgTInt8MultiRange<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTInt8MultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt8MultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt8MultiRangeHKT;
}
export interface PgTInt8MultiRangeHKT extends ColumnHKTBase {
	_type: PgTInt8MultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int8MultiRange
export type PgTInt8MultiRangeBuilderInitial<TInt8MultiRange extends string> = PgTInt8MultiRangeBuilder<{
	name: TInt8MultiRange;
	data: Int8MultiRange;
	driverParam: Int8MultiRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8MultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8MultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeBuilder";

	build<TTableInt8MultiRange extends string>(table: AnyPgTable<{ name: TTableInt8MultiRange }>): PgTInt8MultiRange<MakeColumnConfig<T, TTableInt8MultiRange>> {
		return new PgTInt8MultiRange<MakeColumnConfig<T, TTableInt8MultiRange>>(table, this.config);
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

export class PgTInt8MultiRange<T extends ColumnBaseConfig> extends PgColumn<PgTInt8MultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt8MultiRange";

	getSQLType(): string {
		return "int8multirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8MultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8MultiRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8MultiRange as string
export type PgTInt8MultiRangeStringBuilderInitial<TInt8MultiRange extends string> = PgTInt8MultiRangeStringBuilder<{
	name: TInt8MultiRange;
	data: string;
	driverParam: Int8MultiRange;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8MultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8MultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeStringBuilder";

	build<TTableInt8MultiRange extends string>(
		table: AnyPgTable<{ name: TTableInt8MultiRange }>
	): PgTInt8MultiRangeString<MakeColumnConfig<T, TTableInt8MultiRange>> {
		return new PgTInt8MultiRangeString<MakeColumnConfig<T, TTableInt8MultiRange>>(table, this.config);
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

export class PgTInt8MultiRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTInt8MultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt8MultiRangeString";

	getSQLType(): string {
		return "int8multirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8MultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8MultiRange.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt8MultiRange<TInt8MultiRange extends string, TMode extends PgTInt8MultiRangeConfig["mode"] & {}>(
	name: TInt8MultiRange,
	config?: PgTInt8MultiRangeConfig<TMode>
): Equal<TMode, "Int8MultiRange"> extends true ? PgTInt8MultiRangeBuilderInitial<TInt8MultiRange> : PgTInt8MultiRangeStringBuilderInitial<TInt8MultiRange>;
export function defineInt8MultiRange(name: string, config: PgTInt8MultiRangeConfig = {}) {
	if (config.mode === "Int8MultiRange") return new PgTInt8MultiRangeBuilder(name);
	return new PgTInt8MultiRangeStringBuilder(name);
}
