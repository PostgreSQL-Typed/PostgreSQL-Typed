/* eslint-disable unicorn/filename-case */
import { Int2 } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTInt2Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Int2" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Int2" ? Int2 : TMode extends "string" ? string : number,
	TDriverParameter = Int2,
	TColumnType extends "PgTInt2" = "PgTInt2",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTInt2<{
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

//#region Int2
export type PgTInt2BuilderInitial<TName extends string> = PgTInt2Builder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt2";
	data: Int2;
	driverParam: Int2;
	enumValues: undefined;
}>;

export class PgTInt2Builder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt2">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt2Builder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt2");
	}

	/** @internal */
	build<TTableInt2 extends string>(table: AnyPgTable<{ name: TTableInt2 }>): PgTInt2<MakeColumnConfig<T, TTableInt2>> {
		return new PgTInt2<MakeColumnConfig<T, TTableInt2>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt2<T extends ColumnBaseConfig<"custom", "PgTInt2">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt2";

	getSQLType(): string {
		return "int2";
	}

	override mapFromDriverValue(value: Int2): Int2 {
		return Int2.from(value);
	}

	override mapToDriverValue(value: Int2): Int2 {
		const result = Int2.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt2StringBuilderInitial<TName extends string> = PgTInt2StringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt2String";
	data: string;
	driverParam: Int2;
	enumValues: undefined;
}>;

export class PgTInt2StringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt2String">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt2StringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt2String");
	}

	/** @internal */
	build<TTableInt2 extends string>(table: AnyPgTable<{ name: TTableInt2 }>): PgTInt2String<MakeColumnConfig<T, TTableInt2>> {
		return new PgTInt2String<MakeColumnConfig<T, TTableInt2>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt2String<T extends ColumnBaseConfig<"string", "PgTInt2String">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt2String";

	getSQLType(): string {
		return "int2";
	}

	override mapFromDriverValue(value: Int2): string {
		return Int2.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int2 {
		const result = Int2.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTInt2NumberBuilderInitial<TName extends string> = PgTInt2NumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTInt2Number";
	data: number;
	driverParam: Int2;
	enumValues: undefined;
}>;

export class PgTInt2NumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTInt2Number">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt2NumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTInt2Number");
	}

	/** @internal */
	build<TTableInt2 extends string>(table: AnyPgTable<{ name: TTableInt2 }>): PgTInt2Number<MakeColumnConfig<T, TTableInt2>> {
		return new PgTInt2Number<MakeColumnConfig<T, TTableInt2>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt2Number<T extends ColumnBaseConfig<"number", "PgTInt2Number">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt2Number";

	getSQLType(): string {
		return "int2";
	}

	override mapFromDriverValue(value: Int2): number {
		return Int2.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Int2 {
		const result = Int2.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt2<TName extends string>(name: TName, config?: { mode: "number" }): PgTInt2NumberBuilderInitial<TName>;
export function defineInt2<TName extends string>(name: TName, config?: { mode: "Int2" }): PgTInt2BuilderInitial<TName>;
export function defineInt2<TName extends string>(name: TName, config?: { mode: "string" }): PgTInt2StringBuilderInitial<TName>;
export function defineInt2<TName extends string>(name: TName, config?: { mode: "Int2" | "number" | "string" }) {
	if (config?.mode === "Int2") return new PgTInt2Builder(name) as PgTInt2BuilderInitial<TName>;
	if (config?.mode === "string") return new PgTInt2StringBuilder(name) as PgTInt2StringBuilderInitial<TName>;
	return new PgTInt2NumberBuilder(name) as PgTInt2NumberBuilderInitial<TName>;
}
