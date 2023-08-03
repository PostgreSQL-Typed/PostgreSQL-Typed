/* eslint-disable unicorn/filename-case */
import { TimestampTZ } from "@postgresql-typed/parsers";
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

export interface PgTTimestampTZConfig<
	TMode extends "TimestampTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" =
		| "TimestampTZ"
		| "globalThis.Date"
		| "luxon.DateTime"
		| "unix"
		| "string",
> {
	mode?: TMode;
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
> = PgTTimestampTZ<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimestampTZBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimestampTZBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimestampTZHKT;
}
export interface PgTTimestampTZHKT extends ColumnHKTBase {
	_type: PgTTimestampTZ<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Time
export type PgTTimestampTZBuilderInitial<TName extends string> = PgTTimestampTZBuilder<{
	name: TName;
	data: TimestampTZ;
	driverParam: TimestampTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZ<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZ<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimestampTZ<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZ";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZ.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZ.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as string
export type PgTTimestampTZStringBuilderInitial<TName extends string> = PgTTimestampTZStringBuilder<{
	name: TName;
	data: string;
	driverParam: TimestampTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimestampTZString<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZString";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZ.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZ.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as globalThis.Date
export type PgTTimestampTZGlobalThisDateBuilderInitial<TName extends string> = PgTTimestampTZGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: TimestampTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZGlobalThisDateBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimestampTZGlobalThisDate<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZGlobalThisDate";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZ.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZ.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as luxon.DateTime
export type PgTTimestampTZLuxonDateTimeBuilderInitial<TName extends string> = PgTTimestampTZLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: TimestampTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZLuxonDateTimeBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimestampTZLuxonDateTime<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZLuxonDateTime";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZ.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZ.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

//#region @postgresql-typed/parsers Time as unix
export type PgTTimestampTZUnixBuilderInitial<TName extends string> = PgTTimestampTZUnixBuilder<{
	name: TName;
	data: number;
	driverParam: TimestampTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimestampTZUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimestampTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZUnixBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimestampTZUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimestampTZUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimestampTZUnix<T extends ColumnBaseConfig> extends PgColumn<PgTTimestampTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimestampTZUnix";

	getSQLType(): string {
		return "timestamptz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimestampTZ.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = TimestampTZ.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineTimestampTZ<TName extends string, TMode extends PgTTimestampTZConfig["mode"] & {}>(
	name: TName,
	config?: PgTTimestampTZConfig<TMode>
): Equal<TMode, "TimestampTZ"> extends true
	? PgTTimestampTZBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTTimestampTZStringBuilderInitial<TName>
	: Equal<TMode, "luxon.DateTime"> extends true
	? PgTTimestampTZLuxonDateTimeBuilderInitial<TName>
	: Equal<TMode, "unix"> extends true
	? PgTTimestampTZUnixBuilderInitial<TName>
	: PgTTimestampTZGlobalThisDateBuilderInitial<TName>;

export function defineTimestampTZ(name: string, config: PgTTimestampTZConfig = {}) {
	if (config.mode === "TimestampTZ") return new PgTTimestampTZBuilder(name);
	if (config.mode === "string") return new PgTTimestampTZStringBuilder(name);
	if (config.mode === "luxon.DateTime") return new PgTTimestampTZLuxonDateTimeBuilder(name);
	if (config.mode === "unix") return new PgTTimestampTZUnixBuilder(name);
	return new PgTTimestampTZGlobalThisDateBuilder(name);
}
