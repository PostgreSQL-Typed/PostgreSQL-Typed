import { DateTime, Time } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, entityKind, MakeColumnConfig, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export abstract class PgTTimeColumnBaseBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
> extends PgTColumnBuilder<T, TRuntimeConfig> {
	static readonly [entityKind]: string = "PgTTimeColumnBaseBuilder";

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export type PgTTimeType<
	TTableName extends string,
	TName extends string,
	TMode extends "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Time"
		? Time
		: TMode extends "globalThis.Date"
		? globalThis.Date
		: TMode extends "luxon.DateTime"
		? luxon.DateTime
		: TMode extends "unix"
		? number
		: string,
	TDriverParameter = Time,
	TColumnType extends "PgTTime" = "PgTTime",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTTime<{
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
export type PgTTimeBuilderInitial<TName extends string> = PgTTimeBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTime";
	data: Time;
	driverParam: Time;
	enumValues: undefined;
}>;

export class PgTTimeBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTime">> extends PgTTimeColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTime");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTime<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTime<T extends ColumnBaseConfig<"custom", "PgTTime">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTime";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: Time): Time {
		return Time.from(value);
	}

	override mapToDriverValue(value: Time): Time {
		const result = Time.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region globalThis.Date
export type PgTTimeGlobalThisDateBuilderInitial<TName extends string> = PgTTimeGlobalThisDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimeGlobalThisDate";
	data: globalThis.Date;
	driverParam: Time;
	enumValues: undefined;
}>;

export class PgTTimeGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimeGlobalThisDate">> extends PgTTimeColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeGlobalThisDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimeGlobalThisDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeGlobalThisDate<T extends ColumnBaseConfig<"custom", "PgTTimeGlobalThisDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeGlobalThisDate";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: Time): globalThis.Date {
		return Time.from(value).toJSDate();
	}

	override mapToDriverValue(value: globalThis.Date): Time {
		const result = Time.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region luxon.DateTime
export type PgTTimeLuxonDateBuilderInitial<TName extends string> = PgTTimeLuxonDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimeLuxonDate";
	data: DateTime;
	driverParam: Time;
	enumValues: undefined;
}>;

export class PgTTimeLuxonDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimeLuxonDate">> extends PgTTimeColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeLuxonDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimeLuxonDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeLuxonDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeLuxonDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeLuxonDate<T extends ColumnBaseConfig<"custom", "PgTTimeLuxonDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeLuxonDate";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: Time): DateTime {
		return Time.from(value).toDateTime();
	}

	override mapToDriverValue(value: DateTime): Time {
		const result = Time.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region unix
export type PgTTimeUnixBuilderInitial<TName extends string> = PgTTimeUnixBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTTimeUnix";
	data: number;
	driverParam: Time;
	enumValues: undefined;
}>;

export class PgTTimeUnixBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTTimeUnix">> extends PgTTimeColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeUnixBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTTimeUnix");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeUnix<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeUnix<T extends ColumnBaseConfig<"number", "PgTTimeUnix">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeUnix";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: Time): number {
		return Time.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Time {
		const result = Time.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimeStringBuilderInitial<TName extends string> = PgTTimeStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimeString";
	data: string;
	driverParam: Time;
	enumValues: undefined;
}>;

export class PgTTimeStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimeString">> extends PgTTimeColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimeString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimeString<T extends ColumnBaseConfig<"string", "PgTTimeString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimeString";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: Time): string {
		return Time.from(value).postgres;
	}

	override mapToDriverValue(value: string): Time {
		const result = Time.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTime<TName extends string>(name: TName, config?: { mode: "globalThis.Date" }): PgTTimeGlobalThisDateBuilderInitial<TName>;
export function defineTime<TName extends string>(name: TName, config?: { mode: "Time" }): PgTTimeBuilderInitial<TName>;
export function defineTime<TName extends string>(name: TName, config?: { mode: "luxon.DateTime" }): PgTTimeLuxonDateBuilderInitial<TName>;
export function defineTime<TName extends string>(name: TName, config?: { mode: "unix" }): PgTTimeUnixBuilderInitial<TName>;
export function defineTime<TName extends string>(name: TName, config?: { mode: "string" }): PgTTimeStringBuilderInitial<TName>;
export function defineTime<TName extends string>(name: TName, config?: { mode: "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" }) {
	if (config?.mode === "Time") return new PgTTimeBuilder(name) as PgTTimeBuilderInitial<TName>;
	if (config?.mode === "luxon.DateTime") return new PgTTimeLuxonDateBuilder(name) as PgTTimeLuxonDateBuilderInitial<TName>;
	if (config?.mode === "unix") return new PgTTimeUnixBuilder(name) as PgTTimeUnixBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTTimeStringBuilder(name) as PgTTimeStringBuilderInitial<TName>;
	return new PgTTimeGlobalThisDateBuilder(name) as PgTTimeGlobalThisDateBuilderInitial<TName>;
}
