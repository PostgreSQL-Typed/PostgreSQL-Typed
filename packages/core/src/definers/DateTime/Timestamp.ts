/* eslint-disable unicorn/filename-case */
import { Timestamp } from "@postgresql-typed/parsers";
import {
	type Assume,
	type ColumnBaseConfig,
	type ColumnBuilderBaseConfig,
	type ColumnBuilderHKTBase,
	type ColumnHKTBase,
	entityKind,
	type Equal,
	type MakeColumnConfig,
	sql,
} from "drizzle-orm";
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTTimestampConfig<
	TMode extends "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "Timestamp" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
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
	TDriverParameter = Timestamp
> = PgTTimestamp<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimestampBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampHKT;
}
export interface PgTTimestampHKT extends ColumnHKTBase {
	_type: PgTTimestamp<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Time
export type PgTTimestampBuilderInitial<TName extends string> = PgTTimestampBuilder<{
	name: TName;
	data: Timestamp;
	driverParam: Timestamp;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestamp<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestamp<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export class PgTTimestamp<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestamp";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Timestamp.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as string
export type PgTTimestampStringBuilderInitial<TName extends string> = PgTTimestampStringBuilder<{
	name: TName;
	data: string;
	driverParam: Timestamp;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export class PgTTimestampString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampString";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Timestamp.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as globalThis.Date
export type PgTTimestampGlobalThisDateBuilderInitial<TName extends string> = PgTTimestampGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: Timestamp;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampGlobalThisDateBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export class PgTTimestampGlobalThisDate<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampGlobalThisDate";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Timestamp.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as luxon.DateTime
export type PgTTimestampLuxonDateTimeBuilderInitial<TName extends string> = PgTTimestampLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: Timestamp;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampLuxonDateTimeBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export class PgTTimestampLuxonDateTime<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampLuxonDateTime";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Timestamp.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

//#region @postgresql-typed/parsers Time as unix
export type PgTTimestampUnixBuilderInitial<TName extends string> = PgTTimestampUnixBuilder<{
	name: TName;
	data: number;
	driverParam: Timestamp;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampUnixBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
	}

	override array(size?: number): PgArrayBuilder<{
		name: NonNullable<T["name"]>;
		notNull: NonNullable<T["notNull"]>;
		hasDefault: NonNullable<T["hasDefault"]>;
		data: T["data"][];
		driverParam: T["driverParam"][] | string;
	}> {
		return new PgTArrayBuilder(this.config.name, this, size) as any;
	}

	/* c8 ignore next 3 */
	defaultNow() {
		return this.default(sql`now()`);
	}
}

export class PgTTimestampUnix<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampUnix";

	getSQLType(): string {
		return "timestamp";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Timestamp.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Timestamp.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
	if (config.mode === "Timestamp") return new PgTTimestampBuilder(name);
	if (config.mode === "string") return new PgTTimestampStringBuilder(name);
	if (config.mode === "luxon.DateTime") return new PgTTimestampLuxonDateTimeBuilder(name);
	if (config.mode === "unix") return new PgTTimestampUnixBuilder(name);
	return new PgTTimestampGlobalThisDateBuilder(name);
}
