/* eslint-disable unicorn/filename-case */
import { BigNumber, Money } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTMoneyType<
	TTableName extends string,
	TName extends string,
	TMode extends "Money" | "string" | "BigNumber" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Money" ? Money : TMode extends "BigNumber" ? BigNumber : TMode extends "number" ? number : string,
	TDriverParameter = Money,
	TColumnType extends "PgTMoney" = "PgTMoney",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTMoney<{
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

//#region Money
export type PgTMoneyBuilderInitial<TName extends string> = PgTMoneyBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTMoney";
	data: Money;
	driverParam: Money;
	enumValues: undefined;
}>;

export class PgTMoneyBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTMoney">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTMoney");
	}

	/** @internal */
	build<TTableMoney extends string>(table: AnyPgTable<{ name: TTableMoney }>): PgTMoney<MakeColumnConfig<T, TTableMoney>> {
		return new PgTMoney<MakeColumnConfig<T, TTableMoney>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTMoney<T extends ColumnBaseConfig<"custom", "PgTMoney">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTMoney";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: Money): Money {
		return Money.from(value);
	}

	override mapToDriverValue(value: Money): Money {
		const result = Money.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTMoneyStringBuilderInitial<TName extends string> = PgTMoneyStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTMoneyString";
	data: string;
	driverParam: Money;
	enumValues: undefined;
}>;

export class PgTMoneyStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTMoneyString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTMoneyString");
	}

	/** @internal */
	build<TTableMoney extends string>(table: AnyPgTable<{ name: TTableMoney }>): PgTMoneyString<MakeColumnConfig<T, TTableMoney>> {
		return new PgTMoneyString<MakeColumnConfig<T, TTableMoney>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTMoneyString<T extends ColumnBaseConfig<"string", "PgTMoneyString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTMoneyString";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: Money): string {
		return Money.from(value).postgres;
	}

	override mapToDriverValue(value: string): Money {
		const result = Money.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTMoneyNumberBuilderInitial<TName extends string> = PgTMoneyNumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTMoneyNumber";
	data: number;
	driverParam: Money;
	enumValues: undefined;
}>;

export class PgTMoneyNumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTMoneyNumber">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyNumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTMoneyNumber");
	}

	/** @internal */
	build<TTableMoney extends string>(table: AnyPgTable<{ name: TTableMoney }>): PgTMoneyNumber<MakeColumnConfig<T, TTableMoney>> {
		return new PgTMoneyNumber<MakeColumnConfig<T, TTableMoney>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTMoneyNumber<T extends ColumnBaseConfig<"number", "PgTMoneyNumber">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTMoneyNumber";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: Money): number {
		return Money.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Money {
		const result = Money.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region BigNumber
export type PgTMoneyBigNumberBuilderInitial<TName extends string> = PgTMoneyBigNumberBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTMoneyBigNumber";
	data: BigNumber;
	driverParam: Money;
	enumValues: undefined;
}>;

export class PgTMoneyBigNumberBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTMoneyBigNumber">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyBigNumberBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTMoneyBigNumber");
	}

	/** @internal */
	build<TTableMoney extends string>(table: AnyPgTable<{ name: TTableMoney }>): PgTMoneyBigNumber<MakeColumnConfig<T, TTableMoney>> {
		return new PgTMoneyBigNumber<MakeColumnConfig<T, TTableMoney>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTMoneyBigNumber<T extends ColumnBaseConfig<"custom", "PgTMoneyBigNumber">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTMoneyBigNumber";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: Money): BigNumber {
		return Money.from(value).toBigNumber();
	}

	override mapToDriverValue(value: BigNumber): Money {
		const result = Money.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineMoney<TName extends string>(name: TName, config?: { mode: "number" }): PgTMoneyNumberBuilderInitial<TName>;
export function defineMoney<TName extends string>(name: TName, config?: { mode: "Money" }): PgTMoneyBuilderInitial<TName>;
export function defineMoney<TName extends string>(name: TName, config?: { mode: "string" }): PgTMoneyStringBuilderInitial<TName>;
export function defineMoney<TName extends string>(name: TName, config?: { mode: "BigNumber" }): PgTMoneyBigNumberBuilderInitial<TName>;
export function defineMoney<TName extends string>(name: TName, config?: { mode: "Money" | "number" | "string" | "BigNumber" }) {
	if (config?.mode === "Money") return new PgTMoneyBuilder(name) as PgTMoneyBuilderInitial<TName>;
	if (config?.mode === "BigNumber") return new PgTMoneyBigNumberBuilder(name) as PgTMoneyBigNumberBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTMoneyStringBuilder(name) as PgTMoneyStringBuilderInitial<TName>;
	return new PgTMoneyNumberBuilder(name) as PgTMoneyNumberBuilderInitial<TName>;
}
