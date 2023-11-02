/* eslint-disable unicorn/filename-case */
import { DateTime, TimestampTZ } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, entityKind, MakeColumnConfig, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export abstract class PgTTimestampTZColumnBaseBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
> extends PgTColumnBuilder<T, TRuntimeConfig> {
	static readonly [entityKind]: string = "PgTTimestampTZColumnBaseBuilder";

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export type PgTTimestampTZType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimestampTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimestampTZ"
		? TimestampTZ
		: TMode extends "globalThis.Date"
		? globalThis.Date
		: TMode extends "luxon.DateTime"
		? luxon.DateTime
		: TMode extends "unix"
		? number
		: string,
	TDriverParameter = TimestampTZ,
	TColumnType extends "PgTTimestampTZ" = "PgTTimestampTZ",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTTimestampTZ<{
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

//#region Date
export type PgTTimestampTZBuilderInitial<TName extends string> = PgTTimestampTZBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampTZ";
	data: TimestampTZ;
	driverParam: TimestampTZ;
	enumValues: undefined;
}>;

export class PgTTimestampTZBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampTZ">> extends PgTTimestampTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampTZ");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZ<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZ<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZ<T extends ColumnBaseConfig<"custom", "PgTTimestampTZ">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZ";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: TimestampTZ): TimestampTZ {
		return TimestampTZ.from(value);
	}

	override mapToDriverValue(value: TimestampTZ): TimestampTZ {
		const result = TimestampTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region globalThis.Date
export type PgTTimestampTZGlobalThisDateBuilderInitial<TName extends string> = PgTTimestampTZGlobalThisDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampTZGlobalThisDate";
	data: globalThis.Date;
	driverParam: TimestampTZ;
	enumValues: undefined;
}>;

export class PgTTimestampTZGlobalThisDateBuilder<
	T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampTZGlobalThisDate">,
> extends PgTTimestampTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZGlobalThisDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampTZGlobalThisDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZGlobalThisDate<T extends ColumnBaseConfig<"custom", "PgTTimestampTZGlobalThisDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZGlobalThisDate";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: TimestampTZ): globalThis.Date {
		return TimestampTZ.from(value).toJSDate();
	}

	override mapToDriverValue(value: globalThis.Date): TimestampTZ {
		const result = TimestampTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region luxon.DateTime
export type PgTTimestampTZLuxonDateBuilderInitial<TName extends string> = PgTTimestampTZLuxonDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampTZLuxonDate";
	data: DateTime;
	driverParam: TimestampTZ;
	enumValues: undefined;
}>;

export class PgTTimestampTZLuxonDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampTZLuxonDate">> extends PgTTimestampTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZLuxonDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampTZLuxonDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZLuxonDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZLuxonDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZLuxonDate<T extends ColumnBaseConfig<"custom", "PgTTimestampTZLuxonDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZLuxonDate";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: TimestampTZ): DateTime {
		return TimestampTZ.from(value).toDateTime();
	}

	override mapToDriverValue(value: DateTime): TimestampTZ {
		const result = TimestampTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region unix
export type PgTTimestampTZUnixBuilderInitial<TName extends string> = PgTTimestampTZUnixBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTTimestampTZUnix";
	data: number;
	driverParam: TimestampTZ;
	enumValues: undefined;
}>;

export class PgTTimestampTZUnixBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTTimestampTZUnix">> extends PgTTimestampTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZUnixBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTTimestampTZUnix");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZUnix<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZUnix<T extends ColumnBaseConfig<"number", "PgTTimestampTZUnix">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZUnix";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: TimestampTZ): number {
		return TimestampTZ.from(value).toNumber();
	}

	override mapToDriverValue(value: number): TimestampTZ {
		const result = TimestampTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimestampTZStringBuilderInitial<TName extends string> = PgTTimestampTZStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimestampTZString";
	data: string;
	driverParam: TimestampTZ;
	enumValues: undefined;
}>;

export class PgTTimestampTZStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimestampTZString">> extends PgTTimestampTZColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampTZStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimestampTZString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampTZString<T extends ColumnBaseConfig<"string", "PgTTimestampTZString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampTZString";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: TimestampTZ): string {
		return TimestampTZ.from(value).postgres;
	}

	override mapToDriverValue(value: string): TimestampTZ {
		const result = TimestampTZ.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimestampTZ<TName extends string>(name: TName, config?: { mode: "globalThis.Date" }): PgTTimestampTZGlobalThisDateBuilderInitial<TName>;
export function defineTimestampTZ<TName extends string>(name: TName, config?: { mode: "TimestampTZ" }): PgTTimestampTZBuilderInitial<TName>;
export function defineTimestampTZ<TName extends string>(name: TName, config?: { mode: "luxon.DateTime" }): PgTTimestampTZLuxonDateBuilderInitial<TName>;
export function defineTimestampTZ<TName extends string>(name: TName, config?: { mode: "unix" }): PgTTimestampTZUnixBuilderInitial<TName>;
export function defineTimestampTZ<TName extends string>(name: TName, config?: { mode: "string" }): PgTTimestampTZStringBuilderInitial<TName>;
export function defineTimestampTZ<TName extends string>(
	name: TName,
	config?: { mode: "TimestampTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" }
) {
	if (config?.mode === "TimestampTZ") return new PgTTimestampTZBuilder(name) as PgTTimestampTZBuilderInitial<TName>;
	if (config?.mode === "luxon.DateTime") return new PgTTimestampTZLuxonDateBuilder(name) as PgTTimestampTZLuxonDateBuilderInitial<TName>;
	if (config?.mode === "unix") return new PgTTimestampTZUnixBuilder(name) as PgTTimestampTZUnixBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTTimestampTZStringBuilder(name) as PgTTimestampTZStringBuilderInitial<TName>;
	return new PgTTimestampTZGlobalThisDateBuilder(name) as PgTTimestampTZGlobalThisDateBuilderInitial<TName>;
}
