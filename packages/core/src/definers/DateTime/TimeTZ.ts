/* eslint-disable unicorn/filename-case */
import { TimeTZ } from "@postgresql-typed/parsers";
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

export interface PgTTimeTZConfig<
	TMode extends "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
}

export type PgTTimeTZType<
	TTableName extends string,
	TName extends string,
	TMode extends "TimeTZ" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "TimeTZ"
		? TimeTZ
		: TMode extends "globalThis.Date"
		? globalThis.Date
		: TMode extends "luxon.DateTime"
		? luxon.DateTime
		: TMode extends "unix"
		? number
		: string,
	TDriverParameter = TimeTZ
> = PgTTimeTZ<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTimeTZBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimeTZBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimeTZHKT;
}
export interface PgTTimeTZHKT extends ColumnHKTBase {
	_type: PgTTimeTZ<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Time
export type PgTTimeTZBuilderInitial<TName extends string> = PgTTimeTZBuilder<{
	name: TName;
	data: TimeTZ;
	driverParam: TimeTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZ<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZ<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeTZ<T extends ColumnBaseConfig> extends PgColumn<PgTTimeTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZ";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as string
export type PgTTimeTZStringBuilderInitial<TName extends string> = PgTTimeTZStringBuilder<{
	name: TName;
	data: string;
	driverParam: TimeTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeTZString<T extends ColumnBaseConfig> extends PgColumn<PgTTimeTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZString";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as globalThis.Date
export type PgTTimeTZGlobalThisDateBuilderInitial<TName extends string> = PgTTimeTZGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: TimeTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZGlobalThisDateBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeTZGlobalThisDate<T extends ColumnBaseConfig> extends PgColumn<PgTTimeTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZGlobalThisDate";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as luxon.DateTime
export type PgTTimeTZLuxonDateTimeBuilderInitial<TName extends string> = PgTTimeTZLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: TimeTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZLuxonDateTimeBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeTZLuxonDateTime<T extends ColumnBaseConfig> extends PgColumn<PgTTimeTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZLuxonDateTime";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string);
	}
}

//#region @postgresql-typed/parsers Time as unix
export type PgTTimeTZUnixBuilderInitial<TName extends string> = PgTTimeTZUnixBuilder<{
	name: TName;
	data: number;
	driverParam: TimeTZ;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeTZUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeTZBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZUnixBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeTZUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeTZUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeTZUnix<T extends ColumnBaseConfig> extends PgColumn<PgTTimeTZHKT, T> {
	static readonly [entityKind]: string = "PgTTimeTZUnix";

	getSQLType(): string {
		return "timetz";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return TimeTZ.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return TimeTZ.from(value as string);
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
	if (config.mode === "TimeTZ") return new PgTTimeTZBuilder(name);
	if (config.mode === "string") return new PgTTimeTZStringBuilder(name);
	if (config.mode === "luxon.DateTime") return new PgTTimeTZLuxonDateTimeBuilder(name);
	if (config.mode === "unix") return new PgTTimeTZUnixBuilder(name);
	return new PgTTimeTZGlobalThisDateBuilder(name);
}
