/* eslint-disable unicorn/filename-case */
import { JSON } from "@postgresql-typed/parsers";
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

export interface PgTJSONBConfig<TMode extends "JSON" | "string" | "value" = "JSON" | "string" | "value"> {
	mode?: TMode;
}

export type PgTJSONBType<
	TTableName extends string,
	TName extends string,
	TMode extends "JSON" | "string" | "value",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "JSON"
		? JSON
		: TMode extends "string"
		? string
		: TMode extends "value"
		? Record<string, unknown> | unknown[] | string | number | boolean | null
		: JSON,
	TDriverParameter = JSON,
> = PgTJSONB<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTJSONBBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTJSONBBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTJSONBHKT;
}
export interface PgTJSONBHKT extends ColumnHKTBase {
	_type: PgTJSONB<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers JSON
export type PgTJSONBBuilderInitial<TName extends string> = PgTJSONBBuilder<{
	name: TName;
	data: JSON;
	driverParam: JSON;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSONBBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTJSONBBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSONBBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSONB<MakeColumnConfig<T, TTableName>> {
		return new PgTJSONB<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTJSONB<T extends ColumnBaseConfig> extends PgColumn<PgTJSONBHKT, T> {
	static readonly [entityKind]: string = "PgTJSONB";

	getSQLType(): string {
		return "jsonb";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return JSON.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = JSON.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers JSON as string
export type PgTJSONBStringBuilderInitial<TName extends string> = PgTJSONBStringBuilder<{
	name: TName;
	data: string;
	driverParam: JSON;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSONBStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTJSONBBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSONBStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSONBString<MakeColumnConfig<T, TTableName>> {
		return new PgTJSONBString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTJSONBString<T extends ColumnBaseConfig> extends PgColumn<PgTJSONBHKT, T> {
	static readonly [entityKind]: string = "PgTJSONBString";

	getSQLType(): string {
		return "jsonb";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return JSON.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = JSON.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers JSON as value
export type PgTJSONBValueBuilderInitial<TName extends string> = PgTJSONBValueBuilder<{
	name: TName;
	data: Record<string, unknown> | unknown[] | string | number | boolean | null;
	driverParam: JSON;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSONBValueBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTJSONBBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSONBValueBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSONBValue<MakeColumnConfig<T, TTableName>> {
		return new PgTJSONBValue<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTJSONBValue<T extends ColumnBaseConfig> extends PgColumn<PgTJSONBHKT, T> {
	static readonly [entityKind]: string = "PgTJSONBValue";

	getSQLType(): string {
		return "jsonb";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return JSON.from(value as string).json;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = JSON.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineJSONB<TName extends string, TMode extends PgTJSONBConfig["mode"] & {}>(
	name: TName,
	config?: PgTJSONBConfig<TMode>
): Equal<TMode, "JSON"> extends true
	? PgTJSONBBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTJSONBStringBuilderInitial<TName>
	: PgTJSONBValueBuilderInitial<TName>;
export function defineJSONB(name: string, config: PgTJSONBConfig = {}) {
	if (config.mode === "JSON") return new PgTJSONBBuilder(name);
	if (config.mode === "string") return new PgTJSONBStringBuilder(name);
	return new PgTJSONBValueBuilder(name);
}
