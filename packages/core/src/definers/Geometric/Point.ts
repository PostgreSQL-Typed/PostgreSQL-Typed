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
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTPointConfig<TMode extends "Point" | "string" = "Point" | "string"> {
	mode?: TMode;
}

export type PgTPointType<
	TTableName extends string,
	TName extends string,
	TMode extends "Point" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Point" ? Point : string,
	TDriverParameter = Point
> = PgTPoint<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTPointBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTPointBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTPointHKT;
}
export interface PgTPointHKT extends ColumnHKTBase {
	_type: PgTPoint<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Point
export type PgTPointBuilderInitial<TName extends string> = PgTPointBuilder<{
	name: TName;
	data: Point;
	driverParam: Point;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPointBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPointBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPointBuilder";

	build<TTablePoint extends string>(table: AnyPgTable<{ name: TTablePoint }>): PgTPoint<MakeColumnConfig<T, TTablePoint>> {
		return new PgTPoint<MakeColumnConfig<T, TTablePoint>>(table, this.config);
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

export class PgTPoint<T extends ColumnBaseConfig> extends PgColumn<PgTPointHKT, T> {
	static readonly [entityKind]: string = "PgTPoint";

	getSQLType(): string {
		return "point";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Point.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Point.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Point as string
export type PgTPointStringBuilderInitial<TName extends string> = PgTPointStringBuilder<{
	name: TName;
	data: string;
	driverParam: Point;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPointStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPointBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPointStringBuilder";

	build<TTablePoint extends string>(table: AnyPgTable<{ name: TTablePoint }>): PgTPointString<MakeColumnConfig<T, TTablePoint>> {
		return new PgTPointString<MakeColumnConfig<T, TTablePoint>>(table, this.config);
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

export class PgTPointString<T extends ColumnBaseConfig> extends PgColumn<PgTPointHKT, T> {
	static readonly [entityKind]: string = "PgTPointString";

	getSQLType(): string {
		return "point";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Point.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Point.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
