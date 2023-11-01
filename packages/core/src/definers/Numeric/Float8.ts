/* eslint-disable unicorn/filename-case */
import { BigNumber, Float8 } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Float8
export type PgTFloat8BuilderInitial<TName extends string> = PgTFloat8Builder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTFloat8";
	data: Float8;
	driverParam: Float8;
	enumValues: undefined;
}>;

export class PgTFloat8Builder<T extends ColumnBuilderBaseConfig<"custom", "PgTFloat8">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8Builder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTFloat8");
	}

	/** @internal */
	build<TTableFloat8 extends string>(table: AnyPgTable<{ name: TTableFloat8 }>): PgTFloat8<MakeColumnConfig<T, TTableFloat8>> {
		return new PgTFloat8<MakeColumnConfig<T, TTableFloat8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat8<T extends ColumnBaseConfig<"custom", "PgTFloat8">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat8";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: Float8): Float8 {
		return Float8.from(value);
	}

	override mapToDriverValue(value: Float8): Float8 {
		const result = Float8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTFloat8StringBuilderInitial<TName extends string> = PgTFloat8StringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTFloat8String";
	data: string;
	driverParam: Float8;
	enumValues: undefined;
}>;

export class PgTFloat8StringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTFloat8String">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8StringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTFloat8String");
	}

	/** @internal */
	build<TTableFloat8 extends string>(table: AnyPgTable<{ name: TTableFloat8 }>): PgTFloat8String<MakeColumnConfig<T, TTableFloat8>> {
		return new PgTFloat8String<MakeColumnConfig<T, TTableFloat8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat8String<T extends ColumnBaseConfig<"string", "PgTFloat8String">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat8String";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: Float8): string {
		return Float8.from(value).postgres;
	}

	override mapToDriverValue(value: string): Float8 {
		const result = Float8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTFloat8NumberBuilderInitial<TName extends string> = PgTFloat8NumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTFloat8Number";
	data: number;
	driverParam: Float8;
	enumValues: undefined;
}>;

export class PgTFloat8NumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTFloat8Number">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8NumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTFloat8Number");
	}

	/** @internal */
	build<TTableFloat8 extends string>(table: AnyPgTable<{ name: TTableFloat8 }>): PgTFloat8Number<MakeColumnConfig<T, TTableFloat8>> {
		return new PgTFloat8Number<MakeColumnConfig<T, TTableFloat8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat8Number<T extends ColumnBaseConfig<"number", "PgTFloat8Number">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat8Number";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: Float8): number {
		return Float8.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Float8 {
		const result = Float8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region BigNumber
export type PgTFloat8BigNumberBuilderInitial<TName extends string> = PgTFloat8BigNumberBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTFloat8BigNumber";
	data: BigNumber;
	driverParam: Float8;
	enumValues: undefined;
}>;

export class PgTFloat8BigNumberBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTFloat8BigNumber">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTFloat8BigNumberBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTFloat8BigNumber");
	}

	/** @internal */
	build<TTableFloat8 extends string>(table: AnyPgTable<{ name: TTableFloat8 }>): PgTFloat8BigNumber<MakeColumnConfig<T, TTableFloat8>> {
		return new PgTFloat8BigNumber<MakeColumnConfig<T, TTableFloat8>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTFloat8BigNumber<T extends ColumnBaseConfig<"custom", "PgTFloat8BigNumber">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTFloat8BigNumber";

	getSQLType(): string {
		return "float8";
	}

	override mapFromDriverValue(value: Float8): BigNumber {
		return Float8.from(value).toBigNumber();
	}

	override mapToDriverValue(value: BigNumber): Float8 {
		const result = Float8.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineFloat8<TName extends string>(name: TName, config: { mode: "Float8" }): PgTFloat8BuilderInitial<TName>;
export function defineFloat8<TName extends string>(name: TName, config: { mode: "string" }): PgTFloat8StringBuilderInitial<TName>;
export function defineFloat8<TName extends string>(name: TName, config: { mode: "BigNumber" }): PgTFloat8BigNumberBuilderInitial<TName>;
export function defineFloat8<TName extends string>(name: TName, config?: { mode: "number" }): PgTFloat8NumberBuilderInitial<TName>;
export function defineFloat8<TName extends string>(name: TName, config?: { mode: "Float8" | "number" | "string" | "BigNumber" }) {
	if (config?.mode === "Float8") return new PgTFloat8Builder(name) as PgTFloat8BuilderInitial<TName>;
	if (config?.mode === "BigNumber") return new PgTFloat8BigNumberBuilder(name) as PgTFloat8BigNumberBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTFloat8StringBuilder(name) as PgTFloat8StringBuilderInitial<TName>;
	return new PgTFloat8NumberBuilder(name) as PgTFloat8NumberBuilderInitial<TName>;
}
