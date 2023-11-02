/* eslint-disable unicorn/filename-case */
import { JSON } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

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
	TDriverParameter = JSON,
	TColumnType extends "PgTJSON" = "PgTJSON",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTJSON<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
	columnType: TColumnType;
	dataType: TDataType;
	enumValues: TEnumValues;
}>;

//#region JSON
export type PgTJSONBuilderInitial<TName extends string> = PgTJSONBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTJSON";
	data: JSON;
	driverParam: JSON;
	enumValues: undefined;
}>;

export class PgTJSONBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTJSON">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTJSONBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTJSON");
	}

	/** @internal */
	build<TTableJSON extends string>(table: AnyPgTable<{ name: TTableJSON }>): PgTJSON<MakeColumnConfig<T, TTableJSON>> {
		return new PgTJSON<MakeColumnConfig<T, TTableJSON>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTJSON<T extends ColumnBaseConfig<"custom", "PgTJSON">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTJSON";

	getSQLType(): string {
		return "json";
	}

	override mapFromDriverValue(value: JSON): JSON {
		return JSON.from(value);
	}

	override mapToDriverValue(value: JSON): JSON {
		const result = JSON.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTJSONStringBuilderInitial<TName extends string> = PgTJSONStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTJSONString";
	data: string;
	driverParam: JSON;
	enumValues: undefined;
}>;

export class PgTJSONStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTJSONString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTJSONStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTJSONString");
	}

	/** @internal */
	build<TTableJSON extends string>(table: AnyPgTable<{ name: TTableJSON }>): PgTJSONString<MakeColumnConfig<T, TTableJSON>> {
		return new PgTJSONString<MakeColumnConfig<T, TTableJSON>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTJSONString<T extends ColumnBaseConfig<"string", "PgTJSONString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTJSONString";

	getSQLType(): string {
		return "json";
	}

	override mapFromDriverValue(value: JSON): string {
		return JSON.from(value).postgres;
	}

	override mapToDriverValue(value: string): JSON {
		const result = JSON.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region value
export type PgTJSONValueBuilderInitial<TName extends string> = PgTJSONValueBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTJSONValue";
	data: Record<string, unknown> | unknown[] | string | number | boolean | null;
	driverParam: JSON;
	enumValues: undefined;
}>;

export class PgTJSONValueBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTJSONValue">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTJSONValueBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTJSONValue");
	}

	/** @internal */
	build<TTableJSON extends string>(table: AnyPgTable<{ name: TTableJSON }>): PgTJSONValue<MakeColumnConfig<T, TTableJSON>> {
		return new PgTJSONValue<MakeColumnConfig<T, TTableJSON>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTJSONValue<T extends ColumnBaseConfig<"string", "PgTJSONValue">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTJSONValue";

	getSQLType(): string {
		return "json";
	}

	override mapFromDriverValue(value: JSON): Record<string, unknown> | unknown[] | string | number | boolean | null {
		return JSON.from(value).json;
	}

	override mapToDriverValue(value: Record<string, unknown> | unknown[] | string | number | boolean | null): JSON {
		const result = JSON.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineJSON<TName extends string>(name: TName, config?: { mode: "value" }): PgTJSONValueBuilderInitial<TName>;
export function defineJSON<TName extends string>(name: TName, config?: { mode: "string" }): PgTJSONStringBuilderInitial<TName>;
export function defineJSON<TName extends string>(name: TName, config?: { mode: "JSON" }): PgTJSONBuilderInitial<TName>;
export function defineJSON<TName extends string>(name: TName, config?: { mode: "JSON" | "string" | "value" }) {
	if (config?.mode === "JSON") return new PgTJSONBuilder(name) as PgTJSONBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTJSONStringBuilder(name) as PgTJSONStringBuilderInitial<TName>;
	return new PgTJSONValueBuilder(name) as PgTJSONValueBuilderInitial<TName>;
}
