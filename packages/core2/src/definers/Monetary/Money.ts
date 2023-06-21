/* eslint-disable unicorn/filename-case */
import { BigNumber, Money } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgDoublePrecisionBuilder, PgDoublePrecisionHKT } from "drizzle-orm/pg-core";

export interface PgTMoneyConfig<TMode extends "Money" | "string" | "BigNumber" | "number" = "Money" | "string" | "BigNumber" | "number"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Money
export type PgTMoneyBuilderInitial<TName extends string> = PgTMoneyBuilder<{
	name: TName;
	data: Money;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTMoneyBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTMoney<MakeColumnConfig<T, TTableName>> {
		return new PgTMoney<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTMoney<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTMoney";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Money.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Money.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Money as string
export type PgTMoneyStringBuilderInitial<TName extends string> = PgTMoneyStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTMoneyStringBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTMoneyString<MakeColumnConfig<T, TTableName>> {
		return new PgTMoneyString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTMoneyString<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTMoneyString";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Money.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Money.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Money as BigNumber
export type PgTMoneyBigNumberBuilderInitial<TName extends string> = PgTMoneyBigNumberBuilder<{
	name: TName;
	data: BigNumber;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTMoneyBigNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyBigNumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTMoneyBigNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTMoneyBigNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTMoneyBigNumber<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTMoneyBigNumber";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Money.from(value as string).toBigNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Money.from(value as BigNumber).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Money as number
export type PgTMoneyNumberBuilderInitial<TName extends string> = PgTMoneyNumberBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTMoneyNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgDoublePrecisionBuilder<T> {
	static readonly [entityKind]: string = "PgTMoneyNumberBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTMoneyNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTMoneyNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTMoneyNumber<T extends ColumnBaseConfig> extends PgColumn<PgDoublePrecisionHKT, T> {
	static readonly [entityKind]: string = "PgTMoneyNumber";

	getSQLType(): string {
		return "money";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Money.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Money.from(value as number).postgres;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineMoney<TName extends string, TMode extends PgTMoneyConfig["mode"] & {}>(
	name: TName,
	config?: PgTMoneyConfig<TMode>
): Equal<TMode, "Money"> extends true
	? PgTMoneyBuilderInitial<TName>
	: Equal<TMode, "BigNumber"> extends true
	? PgTMoneyBigNumberBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTMoneyStringBuilderInitial<TName>
	: PgTMoneyNumberBuilderInitial<TName>;
export function defineMoney(name: string, config: PgTMoneyConfig = {}) {
	if (config.mode === "Money") return new PgTMoneyBuilder(name);
	if (config.mode === "BigNumber") return new PgTMoneyBigNumberBuilder(name);
	if (config.mode === "string") return new PgTMoneyStringBuilder(name);
	return new PgTMoneyNumberBuilder(name);
}
