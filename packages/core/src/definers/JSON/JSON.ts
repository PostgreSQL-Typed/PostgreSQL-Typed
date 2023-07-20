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

export interface PgTJSONConfig<TMode extends "JSON" | "string" | "value" = "JSON" | "string" | "value"> {
	mode?: TMode;
}

export type PgTJSONType<
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
	TDriverParameter = JSON
> = PgTJSON<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTJSONBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTJSONBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTJSONHKT;
}
export interface PgTJSONHKT extends ColumnHKTBase {
	_type: PgTJSON<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers JSON
export type PgTJSONBuilderInitial<TName extends string> = PgTJSONBuilder<{
	name: TName;
	data: JSON;
	driverParam: JSON;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSONBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTJSONBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSONBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSON<MakeColumnConfig<T, TTableName>> {
		return new PgTJSON<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTJSON<T extends ColumnBaseConfig> extends PgColumn<PgTJSONHKT, T> {
	static readonly [entityKind]: string = "PgTJSON";

	getSQLType(): string {
		return "json";
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
export type PgTJSONStringBuilderInitial<TName extends string> = PgTJSONStringBuilder<{
	name: TName;
	data: string;
	driverParam: JSON;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSONStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTJSONBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSONStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSONString<MakeColumnConfig<T, TTableName>> {
		return new PgTJSONString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTJSONString<T extends ColumnBaseConfig> extends PgColumn<PgTJSONHKT, T> {
	static readonly [entityKind]: string = "PgTJSONString";

	getSQLType(): string {
		return "json";
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
export type PgTJSONValueBuilderInitial<TName extends string> = PgTJSONValueBuilder<{
	name: TName;
	data: Record<string, unknown> | unknown[] | string | number | boolean | null;
	driverParam: JSON;
	notNull: false;
	hasDefault: false;
}>;

export class PgTJSONValueBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTJSONBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTJSONValueBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTJSONValue<MakeColumnConfig<T, TTableName>> {
		return new PgTJSONValue<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTJSONValue<T extends ColumnBaseConfig> extends PgColumn<PgTJSONHKT, T> {
	static readonly [entityKind]: string = "PgTJSONValue";

	getSQLType(): string {
		return "json";
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
export function defineJSON<TName extends string, TMode extends PgTJSONConfig["mode"] & {}>(
	name: TName,
	config?: PgTJSONConfig<TMode>
): Equal<TMode, "JSON"> extends true
	? PgTJSONBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTJSONStringBuilderInitial<TName>
	: PgTJSONValueBuilderInitial<TName>;
export function defineJSON(name: string, config: PgTJSONConfig = {}) {
	if (config.mode === "JSON") return new PgTJSONBuilder(name);
	if (config.mode === "string") return new PgTJSONStringBuilder(name);
	return new PgTJSONValueBuilder(name);
}
