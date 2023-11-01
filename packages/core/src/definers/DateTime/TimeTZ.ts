/* eslint-disable unicorn/filename-case */
import { DateTime, TimeTZ } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, entityKind, MakeColumnConfig, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export abstract class PgTTimeTZColumnBaseBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
> extends PgTColumnBuilder<T, TRuntimeConfig> {
	static readonly [entityKind]: string = "PgTTimeTZColumnBaseBuilder";

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

//#region Date
export type PgTTimeTZBuilderInitial<TName extends string> = PgTTimeTZBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimeTZ";
	data: TimeTZ;
	driverParam: TimeTZ;
	enumValues: undefined;
}>;

export class PgTTimeTZBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimeTZ">> extends PgTTimeTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimeTZ");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZ<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZ<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeTZ<T extends ColumnBaseConfig<"custom", "PgTTimeTZ">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeTZ";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: TimeTZ): TimeTZ {
		return TimeTZ.from(value);
	}

	override mapToDriverValue(value: TimeTZ): TimeTZ {
		const result = TimeTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region globalThis.Date
export type PgTTimeTZGlobalThisDateBuilderInitial<TName extends string> = PgTTimeTZGlobalThisDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimeTZGlobalThisDate";
	data: globalThis.Date;
	driverParam: TimeTZ;
	enumValues: undefined;
}>;

export class PgTTimeTZGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimeTZGlobalThisDate">> extends PgTTimeTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZGlobalThisDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimeTZGlobalThisDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeTZGlobalThisDate<T extends ColumnBaseConfig<"custom", "PgTTimeTZGlobalThisDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeTZGlobalThisDate";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: TimeTZ): globalThis.Date {
		return TimeTZ.from(value).toJSDate();
	}

	override mapToDriverValue(value: globalThis.Date): TimeTZ {
		const result = TimeTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region luxon.DateTime
export type PgTTimeTZLuxonDateBuilderInitial<TName extends string> = PgTTimeTZLuxonDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimeTZLuxonDate";
	data: DateTime;
	driverParam: TimeTZ;
	enumValues: undefined;
}>;

export class PgTTimeTZLuxonDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimeTZLuxonDate">> extends PgTTimeTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZLuxonDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimeTZLuxonDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZLuxonDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZLuxonDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeTZLuxonDate<T extends ColumnBaseConfig<"custom", "PgTTimeTZLuxonDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeTZLuxonDate";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: TimeTZ): DateTime {
		return TimeTZ.from(value).toDateTime();
	}

	override mapToDriverValue(value: DateTime): TimeTZ {
		const result = TimeTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region unix
export type PgTTimeTZUnixBuilderInitial<TName extends string> = PgTTimeTZUnixBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTTimeTZUnix";
	data: number;
	driverParam: TimeTZ;
	enumValues: undefined;
}>;

export class PgTTimeTZUnixBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTTimeTZUnix">> extends PgTTimeTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZUnixBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTTimeTZUnix");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZUnix<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeTZUnix<T extends ColumnBaseConfig<"number", "PgTTimeTZUnix">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeTZUnix";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: TimeTZ): number {
		return TimeTZ.from(value).toNumber();
	}

	override mapToDriverValue(value: number): TimeTZ {
		const result = TimeTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimeTZStringBuilderInitial<TName extends string> = PgTTimeTZStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimeTZString";
	data: string;
	driverParam: TimeTZ;
	enumValues: undefined;
}>;

export class PgTTimeTZStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimeTZString">> extends PgTTimeTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimeTZString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeTZString<T extends ColumnBaseConfig<"string", "PgTTimeTZString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeTZString";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: TimeTZ): string {
		return TimeTZ.from(value).postgres;
	}

	override mapToDriverValue(value: string): TimeTZ {
		const result = TimeTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimeTZ<TName extends string>(name: TName, config: { mode: "TimeTZ" }): PgTTimeTZBuilderInitial<TName>;
export function defineTimeTZ<TName extends string>(name: TName, config: { mode: "luxon.DateTime" }): PgTTimeTZLuxonDateBuilderInitial<TName>;
export function defineTimeTZ<TName extends string>(name: TName, config: { mode: "unix" }): PgTTimeTZUnixBuilderInitial<TName>;
export function defineTimeTZ<TName extends string>(name: TName, config: { mode: "string" }): PgTTimeTZStringBuilderInitial<TName>;
export function defineTimeTZ<TName extends string>(name: TName, config?: { mode: "globalThis.Date" }): PgTTimeTZGlobalThisDateBuilderInitial<TName>;
export function defineTimeTZ<TName extends string>(name: TName, config?: { mode: "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" }) {
	if (config?.mode === "TimeTZ") return new PgTTimeTZBuilder(name) as PgTTimeTZBuilderInitial<TName>;
	if (config?.mode === "luxon.DateTime") return new PgTTimeTZLuxonDateBuilder(name) as PgTTimeTZLuxonDateBuilderInitial<TName>;
	if (config?.mode === "unix") return new PgTTimeTZUnixBuilder(name) as PgTTimeTZUnixBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTTimeTZStringBuilder(name) as PgTTimeTZStringBuilderInitial<TName>;
	return new PgTTimeTZGlobalThisDateBuilder(name) as PgTTimeTZGlobalThisDateBuilderInitial<TName>;
}
