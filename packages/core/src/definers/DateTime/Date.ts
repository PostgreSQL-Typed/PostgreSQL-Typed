import { Date, DateTime } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, entityKind, MakeColumnConfig, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export abstract class PgTDateColumnBaseBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
> extends PgTColumnBuilder<T, TRuntimeConfig> {
	static readonly [entityKind]: string = "PgTDateColumnBaseBuilder";

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

//#region Date
export type PgTDateBuilderInitial<TName extends string> = PgTDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTDate";
	data: Date;
	driverParam: Date;
	enumValues: undefined;
}>;

export class PgTDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTDate">> extends PgTDateColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDate<MakeColumnConfig<T, TTableName>> {
		return new PgTDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDate<T extends ColumnBaseConfig<"custom", "PgTDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDate";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: Date): Date {
		return Date.from(value);
	}

	override mapToDriverValue(value: Date): Date {
		const result = Date.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region globalThis.Date
export type PgTDateGlobalThisDateBuilderInitial<TName extends string> = PgTDateGlobalThisDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTDateGlobalThisDate";
	data: globalThis.Date;
	driverParam: Date;
	enumValues: undefined;
}>;

export class PgTDateGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTDateGlobalThisDate">> extends PgTDateColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTDateGlobalThisDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTDateGlobalThisDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTDateGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateGlobalThisDate<T extends ColumnBaseConfig<"custom", "PgTDateGlobalThisDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateGlobalThisDate";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: Date): globalThis.Date {
		return Date.from(value).toJSDate();
	}

	override mapToDriverValue(value: globalThis.Date): Date {
		const result = Date.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region luxon.DateTime
export type PgTDateLuxonDateBuilderInitial<TName extends string> = PgTDateLuxonDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTDateLuxonDate";
	data: DateTime;
	driverParam: Date;
	enumValues: undefined;
}>;

export class PgTDateLuxonDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTDateLuxonDate">> extends PgTDateColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTDateLuxonDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTDateLuxonDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateLuxonDate<MakeColumnConfig<T, TTableName>> {
		return new PgTDateLuxonDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateLuxonDate<T extends ColumnBaseConfig<"custom", "PgTDateLuxonDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateLuxonDate";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: Date): DateTime {
		return Date.from(value).toDateTime();
	}

	override mapToDriverValue(value: DateTime): Date {
		const result = Date.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region unix
export type PgTDateUnixBuilderInitial<TName extends string> = PgTDateUnixBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTDateUnix";
	data: number;
	driverParam: Date;
	enumValues: undefined;
}>;

export class PgTDateUnixBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTDateUnix">> extends PgTDateColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTDateUnixBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTDateUnix");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTDateUnix<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateUnix<T extends ColumnBaseConfig<"number", "PgTDateUnix">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateUnix";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: Date): number {
		return Date.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Date {
		const result = Date.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTDateStringBuilderInitial<TName extends string> = PgTDateStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTDateString";
	data: string;
	driverParam: Date;
	enumValues: undefined;
}>;

export class PgTDateStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTDateString">> extends PgTDateColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTDateStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTDateString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateString<MakeColumnConfig<T, TTableName>> {
		return new PgTDateString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTDateString<T extends ColumnBaseConfig<"string", "PgTDateString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTDateString";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: Date): string {
		return Date.from(value).postgres;
	}

	override mapToDriverValue(value: string): Date {
		const result = Date.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineDate<TName extends string>(name: TName, config: { mode: "Date" }): PgTDateBuilderInitial<TName>;
export function defineDate<TName extends string>(name: TName, config: { mode: "luxon.DateTime" }): PgTDateLuxonDateBuilderInitial<TName>;
export function defineDate<TName extends string>(name: TName, config: { mode: "unix" }): PgTDateUnixBuilderInitial<TName>;
export function defineDate<TName extends string>(name: TName, config: { mode: "string" }): PgTDateStringBuilderInitial<TName>;
export function defineDate<TName extends string>(name: TName, config?: { mode: "globalThis.Date" }): PgTDateGlobalThisDateBuilderInitial<TName>;
export function defineDate<TName extends string>(name: TName, config?: { mode: "Date" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" }) {
	if (config?.mode === "Date") return new PgTDateBuilder(name) as PgTDateBuilderInitial<TName>;
	if (config?.mode === "luxon.DateTime") return new PgTDateLuxonDateBuilder(name) as PgTDateLuxonDateBuilderInitial<TName>;
	if (config?.mode === "unix") return new PgTDateUnixBuilder(name) as PgTDateUnixBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTDateStringBuilder(name) as PgTDateStringBuilderInitial<TName>;
	return new PgTDateGlobalThisDateBuilder(name) as PgTDateGlobalThisDateBuilderInitial<TName>;
}
