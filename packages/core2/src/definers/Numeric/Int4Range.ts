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
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

export interface PgTInt4RangeConfig<TMode extends "Int4Range" | "string" = "Int4Range" | "string"> {
	mode?: TMode;
}
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
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4RangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4RangeBuilder";

	build<TTableInt4Range extends string>(table: AnyPgTable<{ name: TTableInt4Range }>): PgTInt4Range<MakeColumnConfig<T, TTableInt4Range>> {
		return new PgTInt4Range<MakeColumnConfig<T, TTableInt4Range>>(table, this.config);
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
		return Int4Range.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4Range as string
export type PgTInt4RangeStringBuilderInitial<TInt4Range extends string> = PgTInt4RangeStringBuilder<{
	name: TInt4Range;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4RangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4RangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4RangeStringBuilder";

	build<TTableInt4Range extends string>(table: AnyPgTable<{ name: TTableInt4Range }>): PgTInt4RangeString<MakeColumnConfig<T, TTableInt4Range>> {
		return new PgTInt4RangeString<MakeColumnConfig<T, TTableInt4Range>>(table, this.config);
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
		return Int4Range.from(value as string).postgres;
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
