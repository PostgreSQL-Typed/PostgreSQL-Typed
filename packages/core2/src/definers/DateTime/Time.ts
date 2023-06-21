/* eslint-disable unicorn/filename-case */
import { Time } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgTime, PgTimeBuilder } from "drizzle-orm/pg-core";

export interface PgTTimeConfig<
	TMode extends "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Date
export type PgTTimeBuilderInitial<TName extends string> = PgTTimeBuilder<{
	name: TName;
	data: Time;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTime<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTime<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTime";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Time.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as string
export type PgTTimeStringBuilderInitial<TName extends string> = PgTTimeStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeString<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Time.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as globalThis.Date
export type PgTTimeGlobalThisDateBuilderInitial<TName extends string> = PgTTimeGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeGlobalThisDateBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeGlobalThisDate<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeGlobalThisDate";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Time.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as luxon.DateTime
export type PgTTimeLuxonDateTimeBuilderInitial<TName extends string> = PgTTimeLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeLuxonDateTimeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeLuxonDateTime<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeLuxonDateTime";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Time.from(value as string).postgres;
	}
}

//#region @postgresql-typed/parsers Date as unix
export type PgTTimeUnixBuilderInitial<TName extends string> = PgTTimeUnixBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeUnixBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeUnix<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeUnix";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Time.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTime<TName extends string, TMode extends PgTTimeConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimeConfig<TMode>
): Equal<TMode, "Time"> extends true
	? PgTTimeBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTTimeStringBuilderInitial<TName>
	: Equal<TMode, "luxon.DateTime"> extends true
	? PgTTimeLuxonDateTimeBuilderInitial<TName>
	: Equal<TMode, "unix"> extends true
	? PgTTimeUnixBuilderInitial<TName>
	: PgTTimeGlobalThisDateBuilderInitial<TName>;

export function defineTime(name: string, config: PgTTimeConfig = {}) {
	if (config.mode === "Time") return new PgTTimeBuilder(name, false, undefined);
	if (config.mode === "string") return new PgTTimeStringBuilder(name, false, undefined);
	if (config.mode === "luxon.DateTime") return new PgTTimeLuxonDateTimeBuilder(name, false, undefined);
	if (config.mode === "unix") return new PgTTimeUnixBuilder(name, false, undefined);
	return new PgTTimeGlobalThisDateBuilder(name, false, undefined);
}
