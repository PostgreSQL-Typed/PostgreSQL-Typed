import { Int4MultiRange } from "@postgresql-typed/parsers";
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

export interface PgTInt4MultiRangeConfig<TMode extends "Int4MultiRange" | "string" = "Int4MultiRange" | "string"> {
	mode?: TMode;
}
export interface PgTInt4MultiRangeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTInt4MultiRangeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTInt4MultiRangeHKT;
}
export interface PgTInt4MultiRangeHKT extends ColumnHKTBase {
	_type: PgTInt4MultiRange<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Int4MultiRange
export type PgTInt4MultiRangeBuilderInitial<TInt4MultiRange extends string> = PgTInt4MultiRangeBuilder<{
	name: TInt4MultiRange;
	data: Int4MultiRange;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4MultiRangeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4MultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeBuilder";

	build<TTableInt4MultiRange extends string>(table: AnyPgTable<{ name: TTableInt4MultiRange }>): PgTInt4MultiRange<MakeColumnConfig<T, TTableInt4MultiRange>> {
		return new PgTInt4MultiRange<MakeColumnConfig<T, TTableInt4MultiRange>>(table, this.config);
	}
}

export class PgTInt4MultiRange<T extends ColumnBaseConfig> extends PgColumn<PgTInt4MultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt4MultiRange";

	getSQLType(): string {
		return "int4multirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4MultiRange.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4MultiRange.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Int4MultiRange as string
export type PgTInt4MultiRangeStringBuilderInitial<TInt4MultiRange extends string> = PgTInt4MultiRangeStringBuilder<{
	name: TInt4MultiRange;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTInt4MultiRangeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTInt4MultiRangeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeStringBuilder";

	build<TTableInt4MultiRange extends string>(
		table: AnyPgTable<{ name: TTableInt4MultiRange }>
	): PgTInt4MultiRangeString<MakeColumnConfig<T, TTableInt4MultiRange>> {
		return new PgTInt4MultiRangeString<MakeColumnConfig<T, TTableInt4MultiRange>>(table, this.config);
	}
}

export class PgTInt4MultiRangeString<T extends ColumnBaseConfig> extends PgColumn<PgTInt4MultiRangeHKT, T> {
	static readonly [entityKind]: string = "PgTInt4MultiRangeString";

	getSQLType(): string {
		return "int4multirange";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Int4MultiRange.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Int4MultiRange.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineInt4MultiRange<TInt4MultiRange extends string, TMode extends PgTInt4MultiRangeConfig["mode"] & {}>(
	name: TInt4MultiRange,
	config?: PgTInt4MultiRangeConfig<TMode>
): Equal<TMode, "Int4MultiRange"> extends true ? PgTInt4MultiRangeBuilderInitial<TInt4MultiRange> : PgTInt4MultiRangeStringBuilderInitial<TInt4MultiRange>;
export function defineInt4MultiRange(name: string, config: PgTInt4MultiRangeConfig = {}) {
	if (config.mode === "Int4MultiRange") return new PgTInt4MultiRangeBuilder(name);
	return new PgTInt4MultiRangeStringBuilder(name);
}
