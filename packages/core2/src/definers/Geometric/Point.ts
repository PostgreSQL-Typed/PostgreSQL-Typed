import { Point } from "@postgresql-typed/parsers";
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

export interface PgTPointConfig<TMode extends "Point" | "string" = "Point" | "string"> {
	mode?: TMode;
}
export interface PgTPointBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTPointBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTPointHKT;
}
export interface PgTPointHKT extends ColumnHKTBase {
	_type: PgTPoint<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Point
export type PgTPointBuilderInitial<TPoint extends string> = PgTPointBuilder<{
	name: TPoint;
	data: Point;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPointBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPointBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPointBuilder";

	build<TTablePoint extends string>(table: AnyPgTable<{ name: TTablePoint }>): PgTPoint<MakeColumnConfig<T, TTablePoint>> {
		return new PgTPoint<MakeColumnConfig<T, TTablePoint>>(table, this.config);
	}
}

export class PgTPoint<T extends ColumnBaseConfig> extends PgColumn<PgTPointHKT, T> {
	static readonly [entityKind]: string = "PgTPoint";

	getSQLType(): string {
		return "point";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Point.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Point.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Point as string
export type PgTPointStringBuilderInitial<TPoint extends string> = PgTPointStringBuilder<{
	name: TPoint;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPointStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPointBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPointStringBuilder";

	build<TTablePoint extends string>(table: AnyPgTable<{ name: TTablePoint }>): PgTPointString<MakeColumnConfig<T, TTablePoint>> {
		return new PgTPointString<MakeColumnConfig<T, TTablePoint>>(table, this.config);
	}
}

export class PgTPointString<T extends ColumnBaseConfig> extends PgColumn<PgTPointHKT, T> {
	static readonly [entityKind]: string = "PgTPointString";

	getSQLType(): string {
		return "point";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Point.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Point.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function definePoint<TPoint extends string, TMode extends PgTPointConfig["mode"] & {}>(
	name: TPoint,
	config?: PgTPointConfig<TMode>
): Equal<TMode, "Point"> extends true ? PgTPointBuilderInitial<TPoint> : PgTPointStringBuilderInitial<TPoint>;
export function definePoint(name: string, config: PgTPointConfig = {}) {
	if (config.mode === "Point") return new PgTPointBuilder(name);
	return new PgTPointStringBuilder(name);
}
