import { Polygon } from "@postgresql-typed/parsers";
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

export interface PgTPolygonConfig<TMode extends "Polygon" | "string" = "Polygon" | "string"> {
	mode?: TMode;
}

export type PgTPolygonType<
	TTableName extends string,
	TName extends string,
	TMode extends "Polygon" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Polygon" ? Polygon : string,
	TDriverParameter = string,
> = PgTPolygon<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTPolygonBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTPolygonBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTPolygonHKT;
}
export interface PgTPolygonHKT extends ColumnHKTBase {
	_type: PgTPolygon<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Polygon
export type PgTPolygonBuilderInitial<TName extends string> = PgTPolygonBuilder<{
	name: TName;
	data: Polygon;
	driverParam: Polygon;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPolygonBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPolygonBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPolygonBuilder";

	build<TTablePolygon extends string>(table: AnyPgTable<{ name: TTablePolygon }>): PgTPolygon<MakeColumnConfig<T, TTablePolygon>> {
		return new PgTPolygon<MakeColumnConfig<T, TTablePolygon>>(table, this.config);
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

export class PgTPolygon<T extends ColumnBaseConfig> extends PgColumn<PgTPolygonHKT, T> {
	static readonly [entityKind]: string = "PgTPolygon";

	getSQLType(): string {
		return "polygon";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Polygon.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Polygon.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Polygon as string
export type PgTPolygonStringBuilderInitial<TName extends string> = PgTPolygonStringBuilder<{
	name: TName;
	data: string;
	driverParam: Polygon;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPolygonStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPolygonBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPolygonStringBuilder";

	build<TTablePolygon extends string>(table: AnyPgTable<{ name: TTablePolygon }>): PgTPolygonString<MakeColumnConfig<T, TTablePolygon>> {
		return new PgTPolygonString<MakeColumnConfig<T, TTablePolygon>>(table, this.config);
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

export class PgTPolygonString<T extends ColumnBaseConfig> extends PgColumn<PgTPolygonHKT, T> {
	static readonly [entityKind]: string = "PgTPolygonString";

	getSQLType(): string {
		return "polygon";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Polygon.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Polygon.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function definePolygon<TPolygon extends string, TMode extends PgTPolygonConfig["mode"] & {}>(
	name: TPolygon,
	config?: PgTPolygonConfig<TMode>
): Equal<TMode, "Polygon"> extends true ? PgTPolygonBuilderInitial<TPolygon> : PgTPolygonStringBuilderInitial<TPolygon>;
export function definePolygon(name: string, config: PgTPolygonConfig = {}) {
	if (config.mode === "Polygon") return new PgTPolygonBuilder(name);
	return new PgTPolygonStringBuilder(name);
}
