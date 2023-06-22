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
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

export interface PgTInt8RangeConfig<TMode extends "Int8Range" | "string" = "Int8Range" | "string"> {
	mode?: TMode;
}
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
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8RangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8RangeBuilder";

	build<TTableInt8Range extends string>(table: AnyPgTable<{ name: TTableInt8Range }>): PgTInt8Range<MakeColumnConfig<T, TTableInt8Range>> {
		return new PgTInt8Range<MakeColumnConfig<T, TTableInt8Range>>(table, this.config);
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
		return Int8Range.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int8Range as string
export type PgTInt8RangeStringBuilderInitial<TInt8Range extends string> = PgTInt8RangeStringBuilder<{
	name: TInt8Range;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt8RangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt8RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt8RangeStringBuilder";

	build<TTableInt8Range extends string>(table: AnyPgTable<{ name: TTableInt8Range }>): PgTInt8RangeString<MakeColumnConfig<T, TTableInt8Range>> {
		return new PgTInt8RangeString<MakeColumnConfig<T, TTableInt8Range>>(table, this.config);
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
		return Int8Range.from(value as string).postgres;
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
