/* eslint-disable unicorn/filename-case */
import { JSON } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region JSON
export type PgTJSONBBuilderInitial<TName extends string> = PgTJSONBBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTJSONB";
	data: JSON;
	driverParam: JSON;
	enumValues: undefined;
}>;

export class PgTJSONBBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTJSONB">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTJSONBBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTJSONB");
	}

	/** @internal */
	build<TTableJSON extends string>(table: AnyPgTable<{ name: TTableJSON }>): PgTJSONB<MakeColumnConfig<T, TTableJSON>> {
		return new PgTJSONB<MakeColumnConfig<T, TTableJSON>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTJSONB<T extends ColumnBaseConfig<"custom", "PgTJSONB">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTJSONB";

	getSQLType(): string {
		return "jsonb";
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
export type PgTJSONBStringBuilderInitial<TName extends string> = PgTJSONBStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTJSONBString";
	data: string;
	driverParam: JSON;
	enumValues: undefined;
}>;

export class PgTJSONBStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTJSONBString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTJSONBStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTJSONBString");
	}

	/** @internal */
	build<TTableJSON extends string>(table: AnyPgTable<{ name: TTableJSON }>): PgTJSONBString<MakeColumnConfig<T, TTableJSON>> {
		return new PgTJSONBString<MakeColumnConfig<T, TTableJSON>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTJSONBString<T extends ColumnBaseConfig<"string", "PgTJSONBString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTJSONBString";

	getSQLType(): string {
		return "jsonb";
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
export type PgTJSONBValueBuilderInitial<TName extends string> = PgTJSONBValueBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTJSONBValue";
	data: Record<string, unknown> | unknown[] | string | number | boolean | null;
	driverParam: JSON;
	enumValues: undefined;
}>;

export class PgTJSONBValueBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTJSONBValue">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTJSONBValueBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTJSONBValue");
	}

	/** @internal */
	build<TTableJSON extends string>(table: AnyPgTable<{ name: TTableJSON }>): PgTJSONBValue<MakeColumnConfig<T, TTableJSON>> {
		return new PgTJSONBValue<MakeColumnConfig<T, TTableJSON>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTJSONBValue<T extends ColumnBaseConfig<"string", "PgTJSONBValue">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTJSONBValue";

	getSQLType(): string {
		return "jsonb";
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

export function defineJSONB<TName extends string>(name: TName, config: { mode: "JSON" }): PgTJSONBBuilderInitial<TName>;
export function defineJSONB<TName extends string>(name: TName, config: { mode: "string" }): PgTJSONBStringBuilderInitial<TName>;
export function defineJSONB<TName extends string>(name: TName, config?: { mode: "value" }): PgTJSONBValueBuilderInitial<TName>;
export function defineJSONB<TName extends string>(name: TName, config?: { mode: "JSON" | "string" | "value" }) {
	if (config?.mode === "JSON") return new PgTJSONBBuilder(name) as PgTJSONBBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTJSONBStringBuilder(name) as PgTJSONBStringBuilderInitial<TName>;
	return new PgTJSONBValueBuilder(name) as PgTJSONBValueBuilderInitial<TName>;
}
