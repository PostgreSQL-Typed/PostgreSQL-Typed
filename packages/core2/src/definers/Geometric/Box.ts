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
import { type AnyPgTable, PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";

export interface PgTBoxConfig<TMode extends "Box" | "string" = "Box" | "string"> {
	mode?: TMode;
}
export interface PgTBoxBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTBoxBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTBoxHKT;
}
export interface PgTBoxHKT extends ColumnHKTBase {
	_type: PgTBox<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Box
export type PgTBoxBuilderInitial<TBox extends string> = PgTBoxBuilder<{
	name: TBox;
	data: Box;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBoxBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBoxBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBoxBuilder";

	build<TTableBox extends string>(table: AnyPgTable<{ name: TTableBox }>): PgTBox<MakeColumnConfig<T, TTableBox>> {
		return new PgTBox<MakeColumnConfig<T, TTableBox>>(table, this.config);
	}

	array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this as PgColumnBuilder<any, any>, size) as any;
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
		return Box.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Box as string
export type PgTBoxStringBuilderInitial<TBox extends string> = PgTBoxStringBuilder<{
	name: TBox;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTBoxStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTBoxBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTBoxStringBuilder";

	build<TTableBox extends string>(table: AnyPgTable<{ name: TTableBox }>): PgTBoxString<MakeColumnConfig<T, TTableBox>> {
		return new PgTBoxString<MakeColumnConfig<T, TTableBox>>(table, this.config);
	}

	array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this as PgColumnBuilder<any, any>, size) as any;
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
		return Box.from(value as string).postgres;
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
