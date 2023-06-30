import { Date } from "@postgresql-typed/parsers";
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

export interface PgTDateConfig<
	TMode extends "Date" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "Date" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
}
export interface PgTDateBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTDateBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTDateHKT;
}
export interface PgTDateHKT extends ColumnHKTBase {
	_type: PgTDate<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Date
export type PgTDateBuilderInitial<TName extends string> = PgTDateBuilder<{
	name: TName;
	data: Date;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDate<MakeColumnConfig<T, TTableName>> {
		return new PgTDate<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTDate<T extends ColumnBaseConfig> extends PgColumn<PgTDateHKT, T> {
	static readonly [entityKind]: string = "PgTDate";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Date.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Date.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as string
export type PgTDateStringBuilderInitial<TName extends string> = PgTDateStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateString<MakeColumnConfig<T, TTableName>> {
		return new PgTDateString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTDateString<T extends ColumnBaseConfig> extends PgColumn<PgTDateHKT, T> {
	static readonly [entityKind]: string = "PgTDateString";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Date.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Date.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as globalThis.Date
export type PgTDateGlobalThisDateBuilderInitial<TName extends string> = PgTDateGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateGlobalThisDateBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTDateGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTDateGlobalThisDate<T extends ColumnBaseConfig> extends PgColumn<PgTDateHKT, T> {
	static readonly [entityKind]: string = "PgTDateGlobalThisDate";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Date.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Date.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Date as luxon.DateTime
export type PgTDateLuxonDateTimeBuilderInitial<TName extends string> = PgTDateLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateLuxonDateTimeBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTDateLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTDateLuxonDateTime<T extends ColumnBaseConfig> extends PgColumn<PgTDateHKT, T> {
	static readonly [entityKind]: string = "PgTDateLuxonDateTime";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Date.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Date.from(value as string);
	}
}

//#region @postgresql-typed/parsers Date as unix
export type PgTDateUnixBuilderInitial<TName extends string> = PgTDateUnixBuilder<{
	name: TName;
	data: number;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTDateUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTDateBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTDateUnixBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTDateUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTDateUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTDateUnix<T extends ColumnBaseConfig> extends PgColumn<PgTDateHKT, T> {
	static readonly [entityKind]: string = "PgTDateUnix";

	getSQLType(): string {
		return "date";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Date.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Date.from(value as string);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineDate<TName extends string, TMode extends PgTDateConfig["mode"] & {}>(
	name: TName,
	config?: PgTDateConfig<TMode>
): Equal<TMode, "Date"> extends true
	? PgTDateBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTDateStringBuilderInitial<TName>
	: Equal<TMode, "luxon.DateTime"> extends true
	? PgTDateLuxonDateTimeBuilderInitial<TName>
	: Equal<TMode, "unix"> extends true
	? PgTDateUnixBuilderInitial<TName>
	: PgTDateGlobalThisDateBuilderInitial<TName>;

export function defineDate(name: string, config: PgTDateConfig = {}) {
	if (config.mode === "Date") return new PgTDateBuilder(name);
	if (config.mode === "string") return new PgTDateStringBuilder(name);
	if (config.mode === "luxon.DateTime") return new PgTDateLuxonDateTimeBuilder(name);
	if (config.mode === "unix") return new PgTDateUnixBuilder(name);
	return new PgTDateGlobalThisDateBuilder(name);
}
