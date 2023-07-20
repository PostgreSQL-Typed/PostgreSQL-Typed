import { Int4Range } from "@postgresql-typed/parsers";
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

export interface PgTInt4RangeConfig<TMode extends "Int4Range" | "string" = "Int4Range" | "string"> {
	mode?: TMode;
}

export type PgTInt4RangeType<
	TTableName extends string,
	TName extends string,
	TMode extends "Int4Range" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int4Range" ? Int4Range : string,
	TDriverParameter = string
> = PgTInt4Range<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTInt4RangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt4RangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt4RangeHKT;
}
export interface PgTInt4RangeHKT extends ColumnHKTBase {
	_type: PgTInt4Range<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int4Range
export type PgTInt4RangeBuilderInitial<TInt4Range extends string> = PgTInt4RangeBuilder<{
	name: TInt4Range;
	data: Int4Range;
	driverParam: Int4Range;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4RangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4RangeBuilder";

	build<TTableInt4Range extends string>(table: AnyPgTable<{ name: TTableInt4Range }>): PgTInt4Range<MakeColumnConfig<T, TTableInt4Range>> {
		return new PgTInt4Range<MakeColumnConfig<T, TTableInt4Range>>(table, this.config);
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

export class PgTInt4Range<T extends ColumnBaseConfig> extends PgColumn<PgTInt4RangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt4Range";

	getSQLType(): string {
		return "int4range";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4Range.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int4Range.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4Range as string
export type PgTInt4RangeStringBuilderInitial<TInt4Range extends string> = PgTInt4RangeStringBuilder<{
	name: TInt4Range;
	data: string;
	driverParam: Int4Range;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4RangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4RangeStringBuilder";

	build<TTableInt4Range extends string>(table: AnyPgTable<{ name: TTableInt4Range }>): PgTInt4RangeString<MakeColumnConfig<T, TTableInt4Range>> {
		return new PgTInt4RangeString<MakeColumnConfig<T, TTableInt4Range>>(table, this.config);
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

export class PgTInt4RangeString<T extends ColumnBaseConfig> extends PgColumn<PgTInt4RangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt4RangeString";

	getSQLType(): string {
		return "int4range";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4Range.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Int4Range.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt4Range<TInt4Range extends string, TMode extends PgTInt4RangeConfig["mode"] & {}>(
	name: TInt4Range,
	config?: PgTInt4RangeConfig<TMode>
): Equal<TMode, "Int4Range"> extends true ? PgTInt4RangeBuilderInitial<TInt4Range> : PgTInt4RangeStringBuilderInitial<TInt4Range>;
export function defineInt4Range(name: string, config: PgTInt4RangeConfig = {}) {
	if (config.mode === "Int4Range") return new PgTInt4RangeBuilder(name);
	return new PgTInt4RangeStringBuilder(name);
}
