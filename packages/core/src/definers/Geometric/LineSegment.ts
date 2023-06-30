import { LineSegment } from "@postgresql-typed/parsers";
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

export interface PgTLineSegmentConfig<TMode extends "LineSegment" | "string" = "LineSegment" | "string"> {
	mode?: TMode;
}
export interface PgTLineSegmentBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTLineSegmentBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTLineSegmentHKT;
}
export interface PgTLineSegmentHKT extends ColumnHKTBase {
	_type: PgTLineSegment<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers LineSegment
export type PgTLineSegmentBuilderInitial<TLineSegment extends string> = PgTLineSegmentBuilder<{
	name: TLineSegment;
	data: LineSegment;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineSegmentBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTLineSegmentBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTLineSegmentBuilder";

	build<TTableLineSegment extends string>(table: AnyPgTable<{ name: TTableLineSegment }>): PgTLineSegment<MakeColumnConfig<T, TTableLineSegment>> {
		return new PgTLineSegment<MakeColumnConfig<T, TTableLineSegment>>(table, this.config);
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

export class PgTLineSegment<T extends ColumnBaseConfig> extends PgColumn<PgTLineSegmentHKT, T> {
	static readonly [entityKind]: string = "PgTLineSegment";

	getSQLType(): string {
		return "lseg";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return LineSegment.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return LineSegment.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers LineSegment as string
export type PgTLineSegmentStringBuilderInitial<TLineSegment extends string> = PgTLineSegmentStringBuilder<{
	name: TLineSegment;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTLineSegmentStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTLineSegmentBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTLineSegmentStringBuilder";

	build<TTableLineSegment extends string>(table: AnyPgTable<{ name: TTableLineSegment }>): PgTLineSegmentString<MakeColumnConfig<T, TTableLineSegment>> {
		return new PgTLineSegmentString<MakeColumnConfig<T, TTableLineSegment>>(table, this.config);
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

export class PgTLineSegmentString<T extends ColumnBaseConfig> extends PgColumn<PgTLineSegmentHKT, T> {
	static readonly [entityKind]: string = "PgTLineSegmentString";

	getSQLType(): string {
		return "lseg";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return LineSegment.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return LineSegment.from(value as string);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineLineSegment<TLineSegment extends string, TMode extends PgTLineSegmentConfig["mode"] & {}>(
	name: TLineSegment,
	config?: PgTLineSegmentConfig<TMode>
): Equal<TMode, "LineSegment"> extends true ? PgTLineSegmentBuilderInitial<TLineSegment> : PgTLineSegmentStringBuilderInitial<TLineSegment>;
export function defineLineSegment(name: string, config: PgTLineSegmentConfig = {}) {
	if (config.mode === "LineSegment") return new PgTLineSegmentBuilder(name);
	return new PgTLineSegmentStringBuilder(name);
}
