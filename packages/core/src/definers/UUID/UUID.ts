/* eslint-disable unicorn/filename-case */
import { UUID } from "@postgresql-typed/parsers";
import {
	type Assume,
	type ColumnBaseConfig,
	type ColumnBuilderBaseConfig,
	type ColumnBuilderHKTBase,
	type ColumnHKTBase,
	entityKind,
	type Equal,
	type MakeColumnConfig,
	sql,
} from "drizzle-orm";
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTUUIDConfig<TMode extends "UUID" | "string" = "UUID" | "string"> {
	mode?: TMode;
}

export type PgTUUIDType<
	TTableName extends string,
	TName extends string,
	TMode extends "UUID" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "UUID" ? UUID : string,
	TDriverParameter = UUID
> = PgTUUID<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTUUIDBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTUUIDBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTUUIDHKT;
}
export interface PgTUUIDHKT extends ColumnHKTBase {
	_type: PgTUUID<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers UUID
export type PgTUUIDBuilderInitial<TUUID extends string> = PgTUUIDBuilder<{
	name: TUUID;
	data: UUID;
	driverParam: UUID;
	notNull: false;
	hasDefault: false;
}>;

export class PgTUUIDBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTUUIDBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTUUIDBuilder";

	build<TTableUUID extends string>(table: AnyPgTable<{ name: TTableUUID }>): PgTUUID<MakeColumnConfig<T, TTableUUID>> {
		return new PgTUUID<MakeColumnConfig<T, TTableUUID>>(table, this.config);
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

	/**
	 * Adds `default gen_random_uuid()` to the column definition.
	 */
	/* c8 ignore next 3 */
	defaultRandom(): ReturnType<this["default"]> {
		return this.default(sql`gen_random_uuid()`) as ReturnType<this["default"]>;
	}
}

export class PgTUUID<T extends ColumnBaseConfig> extends PgColumn<PgTUUIDHKT, T> {
	static readonly [entityKind]: string = "PgTUUID";

	getSQLType(): string {
		return "uuid";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return UUID.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = UUID.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers UUID as string
export type PgTUUIDStringBuilderInitial<TUUID extends string> = PgTUUIDStringBuilder<{
	name: TUUID;
	data: string;
	driverParam: UUID;
	notNull: false;
	hasDefault: false;
}>;

export class PgTUUIDStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTUUIDBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTUUIDStringBuilder";

	build<TTableUUID extends string>(table: AnyPgTable<{ name: TTableUUID }>): PgTUUIDString<MakeColumnConfig<T, TTableUUID>> {
		return new PgTUUIDString<MakeColumnConfig<T, TTableUUID>>(table, this.config);
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

	/**
	 * Adds `default gen_random_uuid()` to the column definition.
	 */
	/* c8 ignore next 3 */
	defaultRandom(): ReturnType<this["default"]> {
		return this.default(sql`gen_random_uuid()`) as ReturnType<this["default"]>;
	}
}

export class PgTUUIDString<T extends ColumnBaseConfig> extends PgColumn<PgTUUIDHKT, T> {
	static readonly [entityKind]: string = "PgTUUIDString";

	getSQLType(): string {
		return "uuid";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return UUID.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = UUID.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineUUID<TUUID extends string, TMode extends PgTUUIDConfig["mode"] & {}>(
	name: TUUID,
	config?: PgTUUIDConfig<TMode>
): Equal<TMode, "UUID"> extends true ? PgTUUIDBuilderInitial<TUUID> : PgTUUIDStringBuilderInitial<TUUID>;
export function defineUUID(name: string, config: PgTUUIDConfig = {}) {
	if (config.mode === "UUID") return new PgTUUIDBuilder(name);
	return new PgTUUIDStringBuilder(name);
}
