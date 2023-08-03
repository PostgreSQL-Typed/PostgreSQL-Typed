import { Int8Range } from "@postgresql-typed/parsers";
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

export interface PgTInt8RangeConfig<TMode extends "Int8Range" | "string" = "Int8Range" | "string"> {
	mode?: TMode;
}

export type PgTInt8RangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "Int8Range" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int8Range" ? Int8Range : TMode extends "string" ? string : number,
	TDriverParameter = Int8Range,
> = PgTInt8Range<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTInt8RangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt8RangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt8RangeHKT;
}
export interface PgTInt8RangeHKT extends ColumnHKTBase {
	_type: PgTInt8Range<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int8Range
export type PgTInt8RangeBuilderInitial<TInt8Range extends string> = PgTInt8RangeBuilder<{
	name: TInt8Range;
	data: Int8Range;
	driverParam: Int8Range;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8RangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8RangeBuilder";

	build<TTableInt8Range extends string>(table: AnyPgTable<{ name: TTableInt8Range }>): PgTInt8Range<MakeColumnConfig<T, TTableInt8Range>> {
		return new PgTInt8Range<MakeColumnConfig<T, TTableInt8Range>>(table, this.config);
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

export class PgTInt8Range<T extends ColumnBaseConfig> extends PgColumn<PgTInt8RangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt8Range";

	getSQLType(): string {
		return "int8range";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8Range.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8Range.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8Range as string
export type PgTInt8RangeStringBuilderInitial<TInt8Range extends string> = PgTInt8RangeStringBuilder<{
	name: TInt8Range;
	data: string;
	driverParam: Int8Range;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8RangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8RangeStringBuilder";

	build<TTableInt8Range extends string>(table: AnyPgTable<{ name: TTableInt8Range }>): PgTInt8RangeString<MakeColumnConfig<T, TTableInt8Range>> {
		return new PgTInt8RangeString<MakeColumnConfig<T, TTableInt8Range>>(table, this.config);
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

export class PgTInt8RangeString<T extends ColumnBaseConfig> extends PgColumn<PgTInt8RangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt8RangeString";

	getSQLType(): string {
		return "int8range";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int8Range.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int8Range.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt8Range<TInt8Range extends string, TMode extends PgTInt8RangeConfig["mode"] & {}>(
	name: TInt8Range,
	config?: PgTInt8RangeConfig<TMode>
): Equal<TMode, "Int8Range"> extends true ? PgTInt8RangeBuilderInitial<TInt8Range> : PgTInt8RangeStringBuilderInitial<TInt8Range>;
export function defineInt8Range(name: string, config: PgTInt8RangeConfig = {}) {
	if (config.mode === "Int8Range") return new PgTInt8RangeBuilder(name);
	return new PgTInt8RangeStringBuilder(name);
}
