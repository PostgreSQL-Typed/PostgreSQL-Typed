/* eslint-disable unicorn/filename-case */
import { Timestamp } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig } from "drizzle-orm";
import { type AnyPgTable, PgColumn, PgTimestampBuilder, PgTimestampHKT } from "drizzle-orm/pg-core";

export interface PgTTimestampConfig<
	TMode extends "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Date
export type PgTTimestampBuilderInitial<TName extends string> = PgTTimestampBuilder<{
	name: TName;
	data: Timestamp;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampBuilder<T extends ColumnBuilderBaseConfig> extends PgTimestampBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestamp<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestamp<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestamp<T extends ColumnBaseConfig> extends PgColumn<PgTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestamp";

	readonly withTimezone: boolean;
	readonly precision: number | undefined;

	constructor(table: AnyPgTable<{ name: T["tableName"] }>, config: PgTimestampBuilder<T>["config"]) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}

	getSQLType(): string {
		const precision = this.precision === undefined ? "" : ` (${this.precision})`;
		return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Timestamp.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as string
export type PgTTimestampStringBuilderInitial<TName extends string> = PgTTimestampStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTimestampBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampString<T extends ColumnBaseConfig> extends PgColumn<PgTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampString";

	readonly withTimezone: boolean;
	readonly precision: number | undefined;

	constructor(table: AnyPgTable<{ name: T["tableName"] }>, config: PgTimestampBuilder<T>["config"]) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}

	getSQLType(): string {
		const precision = this.precision === undefined ? "" : ` (${this.precision})`;
		return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Timestamp.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as globalThis.Date
export type PgTTimestampGlobalThisDateBuilderInitial<TName extends string> = PgTTimestampGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgTimestampBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampGlobalThisDateBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampGlobalThisDate<T extends ColumnBaseConfig> extends PgColumn<PgTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampGlobalThisDate";

	readonly withTimezone: boolean;
	readonly precision: number | undefined;

	constructor(table: AnyPgTable<{ name: T["tableName"] }>, config: PgTimestampBuilder<T>["config"]) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}

	getSQLType(): string {
		const precision = this.precision === undefined ? "" : ` (${this.precision})`;
		return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Timestamp.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as luxon.DateTime
export type PgTTimestampLuxonDateTimeBuilderInitial<TName extends string> = PgTTimestampLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgTimestampBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampLuxonDateTimeBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampLuxonDateTime<T extends ColumnBaseConfig> extends PgColumn<PgTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampLuxonDateTime";

	readonly withTimezone: boolean;
	readonly precision: number | undefined;

	constructor(table: AnyPgTable<{ name: T["tableName"] }>, config: PgTimestampBuilder<T>["config"]) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}

	getSQLType(): string {
		const precision = this.precision === undefined ? "" : ` (${this.precision})`;
		return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Timestamp.from(value as string).postgres;
	}
}

//#region @postgresql-typed/parsers Date as unix
export type PgTTimestampUnixBuilderInitial<TName extends string> = PgTTimestampUnixBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgTimestampBuilder<T> {
	static readonly [entityKind]: string = "PgTTimestampUnixBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTimestampUnix<T extends ColumnBaseConfig> extends PgColumn<PgTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampUnix";

	readonly withTimezone: boolean;
	readonly precision: number | undefined;

	constructor(table: AnyPgTable<{ name: T["tableName"] }>, config: PgTimestampBuilder<T>["config"]) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}

	getSQLType(): string {
		const precision = this.precision === undefined ? "" : ` (${this.precision})`;
		return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Timestamp.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestamp<TName extends string, TMode extends PgTTimestampConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimestampConfig<TMode>
): Equal<TMode, "Timestamp"> extends true
	? PgTTimestampBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTTimestampStringBuilderInitial<TName>
	: Equal<TMode, "luxon.DateTime"> extends true
	? PgTTimestampLuxonDateTimeBuilderInitial<TName>
	: Equal<TMode, "unix"> extends true
	? PgTTimestampUnixBuilderInitial<TName>
	: PgTTimestampGlobalThisDateBuilderInitial<TName>;

export function defineTimestamp(name: string, config: PgTTimestampConfig = {}) {
	if (config.mode === "Timestamp") return new PgTTimestampBuilder(name, false, undefined);
	if (config.mode === "string") return new PgTTimestampStringBuilder(name, false, undefined);
	if (config.mode === "luxon.DateTime") return new PgTTimestampLuxonDateTimeBuilder(name, false, undefined);
	if (config.mode === "unix") return new PgTTimestampUnixBuilder(name, false, undefined);
	return new PgTTimestampGlobalThisDateBuilder(name, false, undefined);
}
