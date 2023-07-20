import { Circle } from "@postgresql-typed/parsers";
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

export interface PgTCircleConfig<TMode extends "Circle" | "string" = "Circle" | "string"> {
	mode?: TMode;
}

export type PgTCircleType<
	TTableName extends string,
	TName extends string,
	TMode extends "Circle" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Circle" ? Circle : TMode extends "string" ? string : number,
	TDriverParameter = Circle
> = PgTCircle<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTCircleBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTCircleBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTCircleHKT;
}
export interface PgTCircleHKT extends ColumnHKTBase {
	_type: PgTCircle<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Circle
export type PgTCircleBuilderInitial<TName extends string> = PgTCircleBuilder<{
	name: TName;
	data: Circle;
	driverParam: Circle;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCircleBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTCircleBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTCircleBuilder";

	build<TTableCircle extends string>(table: AnyPgTable<{ name: TTableCircle }>): PgTCircle<MakeColumnConfig<T, TTableCircle>> {
		return new PgTCircle<MakeColumnConfig<T, TTableCircle>>(table, this.config);
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

export class PgTCircle<T extends ColumnBaseConfig> extends PgColumn<PgTCircleHKT, T> {
	static readonly [entityKind]: string = "PgTCircle";

	getSQLType(): string {
		return "circle";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Circle.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Circle.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Circle as string
export type PgTCircleStringBuilderInitial<TName extends string> = PgTCircleStringBuilder<{
	name: TName;
	data: string;
	driverParam: Circle;
	notNull: false;
	hasDefault: false;
}>;

export class PgTCircleStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTCircleBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTCircleStringBuilder";

	build<TTableCircle extends string>(table: AnyPgTable<{ name: TTableCircle }>): PgTCircleString<MakeColumnConfig<T, TTableCircle>> {
		return new PgTCircleString<MakeColumnConfig<T, TTableCircle>>(table, this.config);
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

export class PgTCircleString<T extends ColumnBaseConfig> extends PgColumn<PgTCircleHKT, T> {
	static readonly [entityKind]: string = "PgTCircleString";

	getSQLType(): string {
		return "circle";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Circle.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Circle.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineCircle<TCircle extends string, TMode extends PgTCircleConfig["mode"] & {}>(
	name: TCircle,
	config?: PgTCircleConfig<TMode>
): Equal<TMode, "Circle"> extends true ? PgTCircleBuilderInitial<TCircle> : PgTCircleStringBuilderInitial<TCircle>;
export function defineCircle(name: string, config: PgTCircleConfig = {}) {
	if (config.mode === "Circle") return new PgTCircleBuilder(name);
	return new PgTCircleStringBuilder(name);
}
