import { Bit } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export interface PgTBitConfig {
	length?: number;
}

export type PgTBitType<
	TTableName extends string,
	TName extends string,
	TMode extends "Bit" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Bit" ? Bit<number> : TMode extends "string" ? string : number,
	TDriverParameter = Bit<number>,
	TColumnType extends "PgTBit" = "PgTBit",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTBit<{
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

//#region Bit
export type PgTBitBuilderInitial<TName extends string> = PgTBitBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTBit";
	data: Bit<number>;
	driverParam: Bit<number>;
	enumValues: undefined;
}>;

export class PgTBitBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTBit">> extends PgTColumnBuilder<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitBuilder";

	constructor(name: T["name"], config: PgTBitConfig) {
		super(name, "custom", "PgTBit");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBit<MakeColumnConfig<T, TTableName>> {
		return new PgTBit<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBit<T extends ColumnBaseConfig<"custom", "PgTBit">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBit";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: Bit<number>): Bit<number> {
		return this.length === undefined ? Bit.from(value) : Bit.setN(this.length).from(value);
	}

	override mapToDriverValue(value: Bit<number>): Bit<number> {
		const result = this.length === undefined ? Bit.safeFrom(value) : Bit.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTBitStringBuilderInitial<TName extends string> = PgTBitStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTBitString";
	data: string;
	driverParam: Bit<number>;
	enumValues: undefined;
}>;

export class PgTBitStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTBitString">> extends PgTColumnBuilder<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitStringBuilder";

	constructor(name: T["name"], config: PgTBitConfig) {
		super(name, "string", "PgTBitString");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitString<MakeColumnConfig<T, TTableName>> {
		return new PgTBitString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBitString<T extends ColumnBaseConfig<"string", "PgTBitString">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitString";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: Bit<number>): string {
		return (this.length === undefined ? Bit.from(value) : Bit.setN(this.length).from(value)).postgres;
	}

	override mapToDriverValue(value: string): Bit<number> {
		const result = this.length === undefined ? Bit.safeFrom(value) : Bit.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTBitNumberBuilderInitial<TName extends string> = PgTBitNumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTBitNumber";
	data: number;
	driverParam: Bit<number>;
	enumValues: undefined;
}>;

export class PgTBitNumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTBitNumber">> extends PgTColumnBuilder<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitNumberBuilder";

	constructor(name: T["name"], config: PgTBitConfig) {
		super(name, "number", "PgTBitNumber");
		this.config.length = config.length;
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTBitNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTBitNumber<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBitNumber<T extends ColumnBaseConfig<"number", "PgTBitNumber">> extends PgTColumn<T, { length: number | undefined }> {
	static readonly [entityKind]: string = "PgTBitNumber";

	readonly length = this.config.length;

	getSQLType(): string {
		return this.length === undefined ? "bit" : `bit(${this.length})`;
	}

	override mapFromDriverValue(value: Bit<number>): number {
		return (this.length === undefined ? Bit.from(value) : Bit.setN(this.length).from(value)).toNumber();
	}

	override mapToDriverValue(value: number): Bit<number> {
		const result = this.length === undefined ? Bit.safeFrom(value) : Bit.setN(this.length).safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineBit<TName extends string>(name: TName, config?: { mode: "string"; length?: number }): PgTBitStringBuilderInitial<TName>;
export function defineBit<TName extends string>(name: TName, config?: { mode: "Bit"; length?: number }): PgTBitBuilderInitial<TName>;
export function defineBit<TName extends string>(name: TName, config?: { mode: "number"; length?: number }): PgTBitNumberBuilderInitial<TName>;
export function defineBit<TName extends string>(name: TName, config?: { mode: "Bit" | "number" | "string"; length?: number }) {
	if (config?.mode === "Bit") return new PgTBitBuilder(name, { length: config.length }) as PgTBitBuilderInitial<TName>;
	if (config?.mode === "number") return new PgTBitNumberBuilder(name, { length: config.length }) as PgTBitNumberBuilderInitial<TName>;
	return new PgTBitStringBuilder(name, { length: config?.length }) as PgTBitStringBuilderInitial<TName>;
}
