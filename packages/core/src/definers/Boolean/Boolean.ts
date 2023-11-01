/* eslint-disable @typescript-eslint/ban-types */
import { Boolean } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Boolean
export type PgTBooleanBuilderInitial<TName extends string> = PgTBooleanBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTBoolean";
	data: Boolean;
	driverParam: Boolean;
	enumValues: undefined;
}>;

export class PgTBooleanBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTBoolean">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTBooleanBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTBoolean");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBoolean<MakeColumnConfig<T, TTableName>> {
		return new PgTBoolean<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBoolean<T extends ColumnBaseConfig<"custom", "PgTBoolean">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTBoolean";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: Boolean): Boolean {
		return Boolean.from(value);
	}

	override mapToDriverValue(value: Boolean): Boolean {
		const result = Boolean.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTBooleanStringBuilderInitial<TName extends string> = PgTBooleanStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTBooleanString";
	data: string;
	driverParam: Boolean;
	enumValues: undefined;
}>;

export class PgTBooleanStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTBooleanString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTBooleanStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTBooleanString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBooleanString<MakeColumnConfig<T, TTableName>> {
		return new PgTBooleanString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBooleanString<T extends ColumnBaseConfig<"string", "PgTBooleanString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTBooleanString";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: Boolean): string {
		return Boolean.from(value).postgres;
	}

	override mapToDriverValue(value: string): Boolean {
		const result = Boolean.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region boolean
export type PgTBooleanBooleanBuilderInitial<TName extends string> = PgTBooleanBooleanBuilder<{
	name: TName;
	dataType: "boolean";
	columnType: "PgTBooleanBoolean";
	data: boolean;
	driverParam: Boolean;
	enumValues: undefined;
}>;

export class PgTBooleanBooleanBuilder<T extends ColumnBuilderBaseConfig<"boolean", "PgTBooleanBoolean">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTBooleanBooleanBuilder";

	constructor(name: T["name"]) {
		super(name, "boolean", "PgTBooleanBoolean");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBooleanBoolean<MakeColumnConfig<T, TTableName>> {
		return new PgTBooleanBoolean<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBooleanBoolean<T extends ColumnBaseConfig<"boolean", "PgTBooleanBoolean">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTBooleanBoolean";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: Boolean): boolean {
		return Boolean.from(value).boolean;
	}

	override mapToDriverValue(value: boolean): Boolean {
		const result = Boolean.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTBooleanNumberBuilderInitial<TName extends string> = PgTBooleanNumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTBooleanNumber";
	data: number;
	driverParam: Boolean;
	enumValues: undefined;
}>;

export class PgTBooleanNumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTBooleanNumber">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTBooleanNumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTBooleanNumber");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBooleanNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBooleanNumber<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBooleanNumber<T extends ColumnBaseConfig<"number", "PgTBooleanNumber">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTBooleanNumber";

	getSQLType(): string {
		return "boolean";
	}

	override mapFromDriverValue(value: Boolean): number {
		return Boolean.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Boolean {
		const result = Boolean.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineBoolean<TName extends string>(name: TName, config: { mode: "Boolean" }): PgTBooleanBuilderInitial<TName>;
export function defineBoolean<TName extends string>(name: TName, config: { mode: "string" }): PgTBooleanStringBuilderInitial<TName>;
export function defineBoolean<TName extends string>(name: TName, config: { mode: "number" }): PgTBooleanNumberBuilderInitial<TName>;
export function defineBoolean<TName extends string>(name: TName, config?: { mode: "boolean" }): PgTBooleanBooleanBuilderInitial<TName>;
export function defineBoolean<TName extends string>(name: TName, config?: { mode: "Boolean" | "boolean" | "string" | "number" }) {
	if (config?.mode === "Boolean") return new PgTBooleanBuilder(name) as PgTBooleanBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTBooleanStringBuilder(name) as PgTBooleanStringBuilderInitial<TName>;
	if (config?.mode === "number") return new PgTBooleanNumberBuilder(name) as PgTBooleanNumberBuilderInitial<TName>;
	return new PgTBooleanBooleanBuilder(name) as PgTBooleanBooleanBuilderInitial<TName>;
}
