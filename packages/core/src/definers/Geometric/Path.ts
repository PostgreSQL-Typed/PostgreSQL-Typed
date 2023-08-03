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
import { PgTError } from "../../PgTError.js";

export interface PgTPathConfig<TMode extends "Path" | "string" = "Path" | "string"> {
	mode?: TMode;
}

export type PgTPathType<
	TTableName extends string,
	TName extends string,
	TMode extends "Path" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Path" ? Path : string,
	TDriverParameter = Path,
> = PgTPath<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTPathBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTPathBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTPathHKT;
}
export interface PgTPathHKT extends ColumnHKTBase {
	_type: PgTPath<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Path
export type PgTPathBuilderInitial<TName extends string> = PgTPathBuilder<{
	name: TName;
	data: Path;
	driverParam: Path;
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
		const result = Path.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Path as string
export type PgTPathStringBuilderInitial<TName extends string> = PgTPathStringBuilder<{
	name: TName;
	data: string;
	driverParam: Path;
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
		const result = Path.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
