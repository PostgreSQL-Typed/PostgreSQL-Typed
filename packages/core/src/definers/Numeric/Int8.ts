/* eslint-disable unicorn/filename-case */
import { Int8 } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Int8
export type PgTInt8BuilderInitial<TName extends string> = PgTInt8Builder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt8";
	data: Int8;
	driverParam: Int8;
	enumValues: undefined;
}>;

export class PgTInt8Builder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt8">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8Builder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt8");
	}

	/** @internal */
	build<TTableInt8 extends string>(table: AnyPgTable<{ name: TTableInt8 }>): PgTInt8<MakeColumnConfig<T, TTableInt8>> {
		return new PgTInt8<MakeColumnConfig<T, TTableInt8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8<T extends ColumnBaseConfig<"custom", "PgTInt8">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: Int8): Int8 {
		return Int8.from(value);
	}

	override mapToDriverValue(value: Int8): Int8 {
		const result = Int8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTInt8StringBuilderInitial<TName extends string> = PgTInt8StringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTInt8String";
	data: string;
	driverParam: Int8;
	enumValues: undefined;
}>;

export class PgTInt8StringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTInt8String">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8StringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTInt8String");
	}

	/** @internal */
	build<TTableInt8 extends string>(table: AnyPgTable<{ name: TTableInt8 }>): PgTInt8String<MakeColumnConfig<T, TTableInt8>> {
		return new PgTInt8String<MakeColumnConfig<T, TTableInt8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8String<T extends ColumnBaseConfig<"string", "PgTInt8String">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8String";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: Int8): string {
		return Int8.from(value).postgres;
	}

	override mapToDriverValue(value: string): Int8 {
		const result = Int8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTInt8NumberBuilderInitial<TName extends string> = PgTInt8NumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTInt8Number";
	data: number;
	driverParam: Int8;
	enumValues: undefined;
}>;

export class PgTInt8NumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTInt8Number">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8NumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTInt8Number");
	}

	/** @internal */
	build<TTableInt8 extends string>(table: AnyPgTable<{ name: TTableInt8 }>): PgTInt8Number<MakeColumnConfig<T, TTableInt8>> {
		return new PgTInt8Number<MakeColumnConfig<T, TTableInt8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8Number<T extends ColumnBaseConfig<"number", "PgTInt8Number">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8Number";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: Int8): number {
		return Int8.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Int8 {
		const result = Int8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region BigInt
export type PgTInt8BigIntBuilderInitial<TName extends string> = PgTInt8BigIntBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTInt8BigInt";
	data: bigint;
	driverParam: Int8;
	enumValues: undefined;
}>;

export class PgTInt8BigIntBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTInt8BigInt">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTInt8BigIntBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTInt8BigInt");
	}

	/** @internal */
	build<TTableInt8 extends string>(table: AnyPgTable<{ name: TTableInt8 }>): PgTInt8BigInt<MakeColumnConfig<T, TTableInt8>> {
		return new PgTInt8BigInt<MakeColumnConfig<T, TTableInt8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTInt8BigInt<T extends ColumnBaseConfig<"custom", "PgTInt8BigInt">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTInt8BigInt";

	getSQLType(): string {
		return "int8";
	}

	override mapFromDriverValue(value: Int8): bigint {
		return Int8.from(value).toBigint();
	}

	override mapToDriverValue(value: bigint): Int8 {
		const result = Int8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineInt8<TName extends string>(name: TName, config: { mode: "Int8" }): PgTInt8BuilderInitial<TName>;
export function defineInt8<TName extends string>(name: TName, config: { mode: "string" }): PgTInt8StringBuilderInitial<TName>;
export function defineInt8<TName extends string>(name: TName, config: { mode: "BigInt" }): PgTInt8BigIntBuilderInitial<TName>;
export function defineInt8<TName extends string>(name: TName, config?: { mode: "number" }): PgTInt8NumberBuilderInitial<TName>;
export function defineInt8<TName extends string>(name: TName, config?: { mode: "Int8" | "number" | "string" | "BigInt" }) {
	if (config?.mode === "Int8") return new PgTInt8Builder(name) as PgTInt8BuilderInitial<TName>;
	if (config?.mode === "BigInt") return new PgTInt8BigIntBuilder(name) as PgTInt8BigIntBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTInt8StringBuilder(name) as PgTInt8StringBuilderInitial<TName>;
	return new PgTInt8NumberBuilder(name) as PgTInt8NumberBuilderInitial<TName>;
}
