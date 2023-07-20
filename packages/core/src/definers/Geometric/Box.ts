import { Box } from "@postgresql-typed/parsers";
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

export interface PgTBoxConfig<TMode extends "Box" | "string" = "Box" | "string"> {
	mode?: TMode;
}

export type PgTBoxType<
	TTableName extends string,
	TName extends string,
	TMode extends "Box" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Box" ? Box : string,
	TDriverParameter = Box
> = PgTBox<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTBoxBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTBoxBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTBoxHKT;
}
export interface PgTBoxHKT extends ColumnHKTBase {
	_type: PgTBox<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Box
export type PgTBoxBuilderInitial<TName extends string> = PgTBoxBuilder<{
	name: TName;
	data: Box;
	driverParam: Box;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBoxBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBoxBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBoxBuilder";

	build<TTableBox extends string>(table: AnyPgTable<{ name: TTableBox }>): PgTBox<MakeColumnConfig<T, TTableBox>> {
		return new PgTBox<MakeColumnConfig<T, TTableBox>>(table, this.config);
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

export class PgTBox<T extends ColumnBaseConfig> extends PgColumn<PgTBoxHKT, T> {
	static readonly [entityKind]: string = "PgTBox";

	getSQLType(): string {
		return "box";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Box.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Box.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Box as string
export type PgTBoxStringBuilderInitial<TName extends string> = PgTBoxStringBuilder<{
	name: TName;
	data: string;
	driverParam: Box;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBoxStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBoxBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBoxStringBuilder";

	build<TTableBox extends string>(table: AnyPgTable<{ name: TTableBox }>): PgTBoxString<MakeColumnConfig<T, TTableBox>> {
		return new PgTBoxString<MakeColumnConfig<T, TTableBox>>(table, this.config);
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

export class PgTBoxString<T extends ColumnBaseConfig> extends PgColumn<PgTBoxHKT, T> {
	static readonly [entityKind]: string = "PgTBoxString";

	getSQLType(): string {
		return "box";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Box.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Box.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineBox<TBox extends string, TMode extends PgTBoxConfig["mode"] & {}>(
	name: TBox,
	config?: PgTBoxConfig<TMode>
): Equal<TMode, "Box"> extends true ? PgTBoxBuilderInitial<TBox> : PgTBoxStringBuilderInitial<TBox>;
export function defineBox(name: string, config: PgTBoxConfig = {}) {
	if (config.mode === "Box") return new PgTBoxBuilder(name);
	return new PgTBoxStringBuilder(name);
}
