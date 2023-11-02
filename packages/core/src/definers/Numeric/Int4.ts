/* eslint-disable unicorn/filename-case */
import { Int4 } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTInt4Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Int4" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int4" ? Int4 : TMode extends "string" ? string : number,
	TDriverParameter = Int4,
	TColumnType extends "PgTInt4" = "PgTInt4",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTInt4<{
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

//#region Int4
export type PgTInt4BuilderInitial<TName extends string> = PgTInt4Builder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt4";
	data: Int4;
	driverParam: Int4;
	enumValues: undefined;
}>;

export class PgTInt4Builder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt4">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4Builder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt4");
	}

	/** @internal */
	build<TTableInt4 extends string>(table: AnyPgTable<{ name: TTableInt4 }>): PgTInt4<MakeColumnConfig<T, TTableInt4>> {
		return new PgTInt4<MakeColumnConfig<T, TTableInt4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4<T extends ColumnBaseConfig<"custom", "PgTInt4">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: Int4): Int4 {
		return Int4.from(value);
	}

	override mapToDriverValue(value: Int4): Int4 {
		const result = Int4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt4StringBuilderInitial<TName extends string> = PgTInt4StringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt4String";
	data: string;
	driverParam: Int4;
	enumValues: undefined;
}>;

export class PgTInt4StringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt4String">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4StringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt4String");
	}

	/** @internal */
	build<TTableInt4 extends string>(table: AnyPgTable<{ name: TTableInt4 }>): PgTInt4String<MakeColumnConfig<T, TTableInt4>> {
		return new PgTInt4String<MakeColumnConfig<T, TTableInt4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4String<T extends ColumnBaseConfig<"string", "PgTInt4String">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4String";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: Int4): string {
		return Int4.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int4 {
		const result = Int4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTInt4NumberBuilderInitial<TName extends string> = PgTInt4NumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTInt4Number";
	data: number;
	driverParam: Int4;
	enumValues: undefined;
}>;

export class PgTInt4NumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTInt4Number">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt4NumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTInt4Number");
	}

	/** @internal */
	build<TTableInt4 extends string>(table: AnyPgTable<{ name: TTableInt4 }>): PgTInt4Number<MakeColumnConfig<T, TTableInt4>> {
		return new PgTInt4Number<MakeColumnConfig<T, TTableInt4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt4Number<T extends ColumnBaseConfig<"number", "PgTInt4Number">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt4Number";

	getSQLType(): string {
		return "int4";
	}

	override mapFromDriverValue(value: Int4): number {
		return Int4.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Int4 {
		const result = Int4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt4<TName extends string>(name: TName, config?: { mode: "number" }): PgTInt4NumberBuilderInitial<TName>;
export function defineInt4<TName extends string>(name: TName, config?: { mode: "Int4" }): PgTInt4BuilderInitial<TName>;
export function defineInt4<TName extends string>(name: TName, config?: { mode: "string" }): PgTInt4StringBuilderInitial<TName>;
export function defineInt4<TName extends string>(name: TName, config?: { mode: "Int4" | "number" | "string" }) {
	if (config?.mode === "Int4") return new PgTInt4Builder(name) as PgTInt4BuilderInitial<TName>;
	if (config?.mode === "string") return new PgTInt4StringBuilder(name) as PgTInt4StringBuilderInitial<TName>;
	return new PgTInt4NumberBuilder(name) as PgTInt4NumberBuilderInitial<TName>;
}
