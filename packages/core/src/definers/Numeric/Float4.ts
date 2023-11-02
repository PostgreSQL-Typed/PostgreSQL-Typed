/* eslint-disable unicorn/filename-case */
import { BigNumber, Float4 } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTFloat4Type<
	TTableName extends string,
	TName extends string,
	TMode extends "Float4" | "string" | "BigNumber" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Float4" ? Float4 : TMode extends "BigNumber" ? BigNumber : TMode extends "number" ? number : string,
	TDriverParameter = Float4,
	TColumnType extends "PgTFloat4" = "PgTFloat4",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTFloat4<{
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

//#region Float4
export type PgTFloat4BuilderInitial<TName extends string> = PgTFloat4Builder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTFloat4";
	data: Float4;
	driverParam: Float4;
	enumValues: undefined;
}>;

export class PgTFloat4Builder<T extends ColumnBuilderBaseConfig<"custom", "PgTFloat4">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4Builder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTFloat4");
	}

	/** @internal */
	build<TTableFloat4 extends string>(table: AnyPgTable<{ name: TTableFloat4 }>): PgTFloat4<MakeColumnConfig<T, TTableFloat4>> {
		return new PgTFloat4<MakeColumnConfig<T, TTableFloat4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat4<T extends ColumnBaseConfig<"custom", "PgTFloat4">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat4";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: Float4): Float4 {
		return Float4.from(value);
	}

	override mapToDriverValue(value: Float4): Float4 {
		const result = Float4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTFloat4StringBuilderInitial<TName extends string> = PgTFloat4StringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTFloat4String";
	data: string;
	driverParam: Float4;
	enumValues: undefined;
}>;

export class PgTFloat4StringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTFloat4String">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4StringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTFloat4String");
	}

	/** @internal */
	build<TTableFloat4 extends string>(table: AnyPgTable<{ name: TTableFloat4 }>): PgTFloat4String<MakeColumnConfig<T, TTableFloat4>> {
		return new PgTFloat4String<MakeColumnConfig<T, TTableFloat4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat4String<T extends ColumnBaseConfig<"string", "PgTFloat4String">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat4String";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: Float4): string {
		return Float4.from(value).postgres;
	}

	override mapToDriverValue(value: string): Float4 {
		const result = Float4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTFloat4NumberBuilderInitial<TName extends string> = PgTFloat4NumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTFloat4Number";
	data: number;
	driverParam: Float4;
	enumValues: undefined;
}>;

export class PgTFloat4NumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTFloat4Number">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4NumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTFloat4Number");
	}

	/** @internal */
	build<TTableFloat4 extends string>(table: AnyPgTable<{ name: TTableFloat4 }>): PgTFloat4Number<MakeColumnConfig<T, TTableFloat4>> {
		return new PgTFloat4Number<MakeColumnConfig<T, TTableFloat4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat4Number<T extends ColumnBaseConfig<"number", "PgTFloat4Number">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat4Number";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: Float4): number {
		return Float4.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Float4 {
		const result = Float4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region BigNumber
export type PgTFloat4BigNumberBuilderInitial<TName extends string> = PgTFloat4BigNumberBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTFloat4BigNumber";
	data: BigNumber;
	driverParam: Float4;
	enumValues: undefined;
}>;

export class PgTFloat4BigNumberBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTFloat4BigNumber">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat4BigNumberBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTFloat4BigNumber");
	}

	/** @internal */
	build<TTableFloat4 extends string>(table: AnyPgTable<{ name: TTableFloat4 }>): PgTFloat4BigNumber<MakeColumnConfig<T, TTableFloat4>> {
		return new PgTFloat4BigNumber<MakeColumnConfig<T, TTableFloat4>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat4BigNumber<T extends ColumnBaseConfig<"custom", "PgTFloat4BigNumber">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat4BigNumber";

	getSQLType(): string {
		return "float4";
	}

	override mapFromDriverValue(value: Float4): BigNumber {
		return Float4.from(value).toBigNumber();
	}

	override mapToDriverValue(value: BigNumber): Float4 {
		const result = Float4.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineFloat4<TName extends string>(name: TName, config?: { mode: "number" }): PgTFloat4NumberBuilderInitial<TName>;
export function defineFloat4<TName extends string>(name: TName, config?: { mode: "Float4" }): PgTFloat4BuilderInitial<TName>;
export function defineFloat4<TName extends string>(name: TName, config?: { mode: "string" }): PgTFloat4StringBuilderInitial<TName>;
export function defineFloat4<TName extends string>(name: TName, config?: { mode: "BigNumber" }): PgTFloat4BigNumberBuilderInitial<TName>;
export function defineFloat4<TName extends string>(name: TName, config?: { mode: "Float4" | "number" | "string" | "BigNumber" }) {
	if (config?.mode === "Float4") return new PgTFloat4Builder(name) as PgTFloat4BuilderInitial<TName>;
	if (config?.mode === "BigNumber") return new PgTFloat4BigNumberBuilder(name) as PgTFloat4BigNumberBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTFloat4StringBuilder(name) as PgTFloat4StringBuilderInitial<TName>;
	return new PgTFloat4NumberBuilder(name) as PgTFloat4NumberBuilderInitial<TName>;
}
