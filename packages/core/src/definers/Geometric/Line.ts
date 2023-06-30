import { Line } from "@postgresql-typed/parsers";
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

export interface PgTLineConfig<TMode extends "Line" | "string" = "Line" | "string"> {
	mode?: TMode;
}
export interface PgTLineBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTLineBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTLineHKT;
}
export interface PgTLineHKT extends ColumnHKTBase {
	_type: PgTLine<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Line
export type PgTLineBuilderInitial<TLine extends string> = PgTLineBuilder<{
	name: TLine;
	data: Line;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTLineBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTLineBuilder";

	build<TTableLine extends string>(table: AnyPgTable<{ name: TTableLine }>): PgTLine<MakeColumnConfig<T, TTableLine>> {
		return new PgTLine<MakeColumnConfig<T, TTableLine>>(table, this.config);
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

export class PgTLine<T extends ColumnBaseConfig> extends PgColumn<PgTLineHKT, T> {
	static readonly [entityKind]: string = "PgTLine";

	getSQLType(): string {
		return "line";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Line.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Line.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Line as string
export type PgTLineStringBuilderInitial<TLine extends string> = PgTLineStringBuilder<{
	name: TLine;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTLineBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTLineStringBuilder";

	build<TTableLine extends string>(table: AnyPgTable<{ name: TTableLine }>): PgTLineString<MakeColumnConfig<T, TTableLine>> {
		return new PgTLineString<MakeColumnConfig<T, TTableLine>>(table, this.config);
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

export class PgTLineString<T extends ColumnBaseConfig> extends PgColumn<PgTLineHKT, T> {
	static readonly [entityKind]: string = "PgTLineString";

	getSQLType(): string {
		return "line";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Line.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Line.from(value as string);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineLine<TLine extends string, TMode extends PgTLineConfig["mode"] & {}>(
	name: TLine,
	config?: PgTLineConfig<TMode>
): Equal<TMode, "Line"> extends true ? PgTLineBuilderInitial<TLine> : PgTLineStringBuilderInitial<TLine>;
export function defineLine(name: string, config: PgTLineConfig = {}) {
	if (config.mode === "Line") return new PgTLineBuilder(name);
	return new PgTLineStringBuilder(name);
}
