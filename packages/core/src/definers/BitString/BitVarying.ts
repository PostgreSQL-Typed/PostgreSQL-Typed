import { BitVarying } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export interface PgTBitVaryingConfig {
	length?: number;
}

export type PgTBitVaryingType<
	TTableName extends string,
	TName extends string,
	TMode extends "BitVarying" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "BitVarying" ? BitVarying<number> : TMode extends "string" ? string : number,
	TDriverParameter = BitVarying<number>,
	TColumnType extends "PgTBitVarying" = "PgTBitVarying",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTBitVarying<{
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

//#region BitVarying
export type PgTBitVaryingBuilderInitial<TName extends string> = PgTBitVaryingBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTBitVarying";
	data: BitVarying<number>;
	driverParam: BitVarying<number>;
	enumValues: undefined;
}>;

export class PgTBitVaryingBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTBitVarying">> extends PgTColumnBuilder<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitVaryingBuilder";

	constructor(name: T["name"], config: PgTBitVaryingConfig) {
		super(name, "custom", "PgTBitVarying");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitVarying<MakeColumnConfig<T, TTableName>> {
		return new PgTBitVarying<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBitVarying<T extends ColumnBaseConfig<"custom", "PgTBitVarying">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitVarying";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varbit" : `varbit(${this.length})`;
	}

	override mapFromDriverValue(value: BitVarying<number>): BitVarying<number> {
		return this.length === undefined ? BitVarying.from(value) : BitVarying.setN(this.length).from(value);
	}

	override mapToDriverValue(value: BitVarying<number>): BitVarying<number> {
		const result = this.length === undefined ? BitVarying.safeFrom(value) : BitVarying.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTBitVaryingStringBuilderInitial<TName extends string> = PgTBitVaryingStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTBitVaryingString";
	data: string;
	driverParam: BitVarying<number>;
	enumValues: undefined;
}>;

export class PgTBitVaryingStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTBitVaryingString">> extends PgTColumnBuilder<
	T,
	{ length: number | undefined }
> {
	static readonly [entityKind]: string = "PgTBitVaryingStringBuilder";

	constructor(name: T["name"], config: PgTBitVaryingConfig) {
		super(name, "string", "PgTBitVaryingString");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitVaryingString<MakeColumnConfig<T, TTableName>> {
		return new PgTBitVaryingString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBitVaryingString<T extends ColumnBaseConfig<"string", "PgTBitVaryingString">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitVaryingString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varbit" : `varbit(${this.length})`;
	}

	override mapFromDriverValue(value: BitVarying<number>): string {
		return (this.length === undefined ? BitVarying.from(value) : BitVarying.setN(this.length).from(value)).postgres;
	}

	override mapToDriverValue(value: string): BitVarying<number> {
		const result = this.length === undefined ? BitVarying.safeFrom(value) : BitVarying.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTBitVaryingNumberBuilderInitial<TName extends string> = PgTBitVaryingNumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTBitVaryingNumber";
	data: number;
	driverParam: BitVarying<number>;
	enumValues: undefined;
}>;

export class PgTBitVaryingNumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTBitVaryingNumber">> extends PgTColumnBuilder<
	T,
	{ length: number | undefined }
> {
	static readonly [entityKind]: string = "PgTBitVaryingNumberBuilder";

	constructor(name: T["name"], config: PgTBitVaryingConfig) {
		super(name, "number", "PgTBitVaryingNumber");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitVaryingNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBitVaryingNumber<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBitVaryingNumber<T extends ColumnBaseConfig<"number", "PgTBitVaryingNumber">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitVaryingNumber";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "varbit" : `varbit(${this.length})`;
	}

	override mapFromDriverValue(value: BitVarying<number>): number {
		return (this.length === undefined ? BitVarying.from(value) : BitVarying.setN(this.length).from(value)).toNumber();
	}

	override mapToDriverValue(value: number): BitVarying<number> {
		const result = this.length === undefined ? BitVarying.safeFrom(value) : BitVarying.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineBitVarying<TName extends string>(name: TName, config?: { mode: "string"; length?: number }): PgTBitVaryingStringBuilderInitial<TName>;
export function defineBitVarying<TName extends string>(name: TName, config?: { mode: "BitVarying"; length?: number }): PgTBitVaryingBuilderInitial<TName>;
export function defineBitVarying<TName extends string>(name: TName, config?: { mode: "number"; length?: number }): PgTBitVaryingNumberBuilderInitial<TName>;
export function defineBitVarying<TName extends string>(name: TName, config?: { mode: "BitVarying" | "number" | "string"; length?: number }) {
	if (config?.mode === "BitVarying") return new PgTBitVaryingBuilder(name, { length: config.length }) as PgTBitVaryingBuilderInitial<TName>;
	if (config?.mode === "number") return new PgTBitVaryingNumberBuilder(name, { length: config.length }) as PgTBitVaryingNumberBuilderInitial<TName>;
	return new PgTBitVaryingStringBuilder(name, { length: config?.length }) as PgTBitVaryingStringBuilderInitial<TName>;
}
