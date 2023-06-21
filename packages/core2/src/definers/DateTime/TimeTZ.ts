/* eslint-disable unicorn/filename-case */
import { TimeTZ } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgTime, PgTimeBuilder } from "drizzle-orm/pg-core";

export interface PgTTimeTZConfig<
	TMode extends "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Date
export type PgTTimeTZBuilderInitial<TName extends string> = PgTTimeTZBuilder<{
	name: TName;
	data: TimeTZ;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZ<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZ<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeTZ<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeTZ";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as string
export type PgTTimeTZStringBuilderInitial<TName extends string> = PgTTimeTZStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeTZString<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeTZString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as globalThis.Date
export type PgTTimeTZGlobalThisDateBuilderInitial<TName extends string> = PgTTimeTZGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZGlobalThisDateBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeTZGlobalThisDate<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeTZGlobalThisDate";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as luxon.DateTime
export type PgTTimeTZLuxonDateTimeBuilderInitial<TName extends string> = PgTTimeTZLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZLuxonDateTimeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeTZLuxonDateTime<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeTZLuxonDateTime";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string).postgres;
	}
}

//#region @postgresql-typed/parsers Date as unix
export type PgTTimeTZUnixBuilderInitial<TName extends string> = PgTTimeTZUnixBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgTimeBuilder<T> {
	static readonly [entityKind]: string = "PgTTimeTZUnixBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimeTZUnix<T extends ColumnBaseConfig> extends PgTime<T> {
	static readonly [entityKind]: string = "PgTTimeTZUnix";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimeTZ<TName extends string, TMode extends PgTTimeTZConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimeTZConfig<TMode>
): Equal<TMode, "TimeTZ"> extends true
	? PgTTimeTZBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTTimeTZStringBuilderInitial<TName>
	: Equal<TMode, "luxon.DateTime"> extends true
	? PgTTimeTZLuxonDateTimeBuilderInitial<TName>
	: Equal<TMode, "unix"> extends true
	? PgTTimeTZUnixBuilderInitial<TName>
	: PgTTimeTZGlobalThisDateBuilderInitial<TName>;

export function defineTimeTZ(name: string, config: PgTTimeTZConfig = {}) {
	if (config.mode === "TimeTZ") return new PgTTimeTZBuilder(name, true, undefined);
	if (config.mode === "string") return new PgTTimeTZStringBuilder(name, true, undefined);
	if (config.mode === "luxon.DateTime") return new PgTTimeTZLuxonDateTimeBuilder(name, true, undefined);
	if (config.mode === "unix") return new PgTTimeTZUnixBuilder(name, true, undefined);
	return new PgTTimeTZGlobalThisDateBuilder(name, true, undefined);
}
