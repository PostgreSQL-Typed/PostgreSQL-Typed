import { Path } from "@postgresql-typed/parsers";
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

export interface PgTPathConfig<TMode extends "Path" | "string" = "Path" | "string"> {
	mode?: TMode;
}
export interface PgTPathBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTPathBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTPathHKT;
}
export interface PgTPathHKT extends ColumnHKTBase {
	_type: PgTPath<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Path
export type PgTPathBuilderInitial<TPath extends string> = PgTPathBuilder<{
	name: TPath;
	data: Path;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPathBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPathBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPathBuilder";

	build<TTablePath extends string>(table: AnyPgTable<{ name: TTablePath }>): PgTPath<MakeColumnConfig<T, TTablePath>> {
		return new PgTPath<MakeColumnConfig<T, TTablePath>>(table, this.config);
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

export class PgTPath<T extends ColumnBaseConfig> extends PgColumn<PgTPathHKT, T> {
	static readonly [entityKind]: string = "PgTPath";

	getSQLType(): string {
		return "path";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Path.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Path.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Path as string
export type PgTPathStringBuilderInitial<TPath extends string> = PgTPathStringBuilder<{
	name: TPath;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPathStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTPathBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTPathStringBuilder";

	build<TTablePath extends string>(table: AnyPgTable<{ name: TTablePath }>): PgTPathString<MakeColumnConfig<T, TTablePath>> {
		return new PgTPathString<MakeColumnConfig<T, TTablePath>>(table, this.config);
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

export class PgTPathString<T extends ColumnBaseConfig> extends PgColumn<PgTPathHKT, T> {
	static readonly [entityKind]: string = "PgTPathString";

	getSQLType(): string {
		return "path";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Path.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Path.from(value as string);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function definePath<TPath extends string, TMode extends PgTPathConfig["mode"] & {}>(
	name: TPath,
	config?: PgTPathConfig<TMode>
): Equal<TMode, "Path"> extends true ? PgTPathBuilderInitial<TPath> : PgTPathStringBuilderInitial<TPath>;
export function definePath(name: string, config: PgTPathConfig = {}) {
	if (config.mode === "Path") return new PgTPathBuilder(name);
	return new PgTPathStringBuilder(name);
}
