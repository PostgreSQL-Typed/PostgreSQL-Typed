import { DateTime, Timestamp } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, entityKind, MakeColumnConfig, sql } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export abstract class PgTTimestampColumnBaseBuilder<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = object,
> extends PgTColumnBuilder<T, TRuntimeConfig> {
	static readonly [entityKind]: string = "PgTTimestampColumnBaseBuilder";

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export type PgTTimestampType<
	TTableName extends string,
	TName extends string,
	TMode extends "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Timestamp"
		? Timestamp
		: TMode extends "globalThis.Date"
		? globalThis.Date
		: TMode extends "luxon.DateTime"
		? luxon.DateTime
		: TMode extends "unix"
		? number
		: string,
	TDriverParameter = Timestamp,
	TColumnType extends "PgTTimestamp" = "PgTTimestamp",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTTimestamp<{
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
export type PgTTimestampBuilderInitial<TName extends string> = PgTTimestampBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestamp";
	data: Timestamp;
	driverParam: Timestamp;
	enumValues: undefined;
}>;

export class PgTTimestampBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestamp">> extends PgTTimestampColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestamp");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestamp<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestamp<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestamp<T extends ColumnBaseConfig<"custom", "PgTTimestamp">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestamp";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: Timestamp): Timestamp {
		return Timestamp.from(value);
	}

	override mapToDriverValue(value: Timestamp): Timestamp {
		const result = Timestamp.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region globalThis.Date
export type PgTTimestampGlobalThisDateBuilderInitial<TName extends string> = PgTTimestampGlobalThisDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampGlobalThisDate";
	data: globalThis.Date;
	driverParam: Timestamp;
	enumValues: undefined;
}>;

export class PgTTimestampGlobalThisDateBuilder<
	T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampGlobalThisDate">,
> extends PgTTimestampColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampGlobalThisDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampGlobalThisDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampGlobalThisDate<T extends ColumnBaseConfig<"custom", "PgTTimestampGlobalThisDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampGlobalThisDate";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: Timestamp): globalThis.Date {
		return Timestamp.from(value).toJSDate();
	}

	override mapToDriverValue(value: globalThis.Date): Timestamp {
		const result = Timestamp.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region luxon.DateTime
export type PgTTimestampLuxonDateBuilderInitial<TName extends string> = PgTTimestampLuxonDateBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTTimestampLuxonDate";
	data: DateTime;
	driverParam: Timestamp;
	enumValues: undefined;
}>;

export class PgTTimestampLuxonDateBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTTimestampLuxonDate">> extends PgTTimestampColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampLuxonDateBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTTimestampLuxonDate");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampLuxonDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampLuxonDate<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampLuxonDate<T extends ColumnBaseConfig<"custom", "PgTTimestampLuxonDate">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampLuxonDate";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: Timestamp): DateTime {
		return Timestamp.from(value).toDateTime();
	}

	override mapToDriverValue(value: DateTime): Timestamp {
		const result = Timestamp.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region unix
export type PgTTimestampUnixBuilderInitial<TName extends string> = PgTTimestampUnixBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTTimestampUnix";
	data: number;
	driverParam: Timestamp;
	enumValues: undefined;
}>;

export class PgTTimestampUnixBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTTimestampUnix">> extends PgTTimestampColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampUnixBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTTimestampUnix");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampUnix<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampUnix<T extends ColumnBaseConfig<"number", "PgTTimestampUnix">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampUnix";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: Timestamp): number {
		return Timestamp.from(value).toNumber();
	}

	override mapToDriverValue(value: number): Timestamp {
		const result = Timestamp.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTimestampStringBuilderInitial<TName extends string> = PgTTimestampStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTimestampString";
	data: string;
	driverParam: Timestamp;
	enumValues: undefined;
}>;

export class PgTTimestampStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTimestampString">> extends PgTTimestampColumnBaseBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTimestampString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTimestampString<T extends ColumnBaseConfig<"string", "PgTTimestampString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTimestampString";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: Timestamp): string {
		return Timestamp.from(value).postgres;
	}

	override mapToDriverValue(value: string): Timestamp {
		const result = Timestamp.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineTimestamp<TName extends string>(name: TName, config?: { mode: "globalThis.Date" }): PgTTimestampGlobalThisDateBuilderInitial<TName>;
export function defineTimestamp<TName extends string>(name: TName, config?: { mode: "Timestamp" }): PgTTimestampBuilderInitial<TName>;
export function defineTimestamp<TName extends string>(name: TName, config?: { mode: "luxon.DateTime" }): PgTTimestampLuxonDateBuilderInitial<TName>;
export function defineTimestamp<TName extends string>(name: TName, config?: { mode: "unix" }): PgTTimestampUnixBuilderInitial<TName>;
export function defineTimestamp<TName extends string>(name: TName, config?: { mode: "string" }): PgTTimestampStringBuilderInitial<TName>;
export function defineTimestamp<TName extends string>(name: TName, config?: { mode: "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" }) {
	if (config?.mode === "Timestamp") return new PgTTimestampBuilder(name) as PgTTimestampBuilderInitial<TName>;
	if (config?.mode === "luxon.DateTime") return new PgTTimestampLuxonDateBuilder(name) as PgTTimestampLuxonDateBuilderInitial<TName>;
	if (config?.mode === "unix") return new PgTTimestampUnixBuilder(name) as PgTTimestampUnixBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTTimestampStringBuilder(name) as PgTTimestampStringBuilderInitial<TName>;
	return new PgTTimestampGlobalThisDateBuilder(name) as PgTTimestampGlobalThisDateBuilderInitial<TName>;
}
