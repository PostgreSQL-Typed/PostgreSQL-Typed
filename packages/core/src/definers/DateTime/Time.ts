import { Time } from "@postgresql-typed/parsers";
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

export interface PgTTimeConfig<
	TMode extends "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string" = "Time" | "globalThis.Date" | "luxon.DateTime" | "unix" | "string"
> {
	mode?: TMode;
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
	TDriverParameter = Time
> = PgTTime<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;
export interface PgTTimeBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTimeBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTimeHKT;
}
export interface PgTTimeHKT extends ColumnHKTBase {
	_type: PgTTime<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Time
export type PgTTimeBuilderInitial<TName extends string> = PgTTimeBuilder<{
	name: TName;
	data: Time;
	driverParam: Time;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTime<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTime<T extends ColumnBaseConfig> extends PgColumn<PgTTimeHKT, T> {
	static readonly [entityKind]: string = "PgTTime";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Time.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as string
export type PgTTimeStringBuilderInitial<TName extends string> = PgTTimeStringBuilder<{
	name: TName;
	data: string;
	driverParam: Time;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeString<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeString<T extends ColumnBaseConfig> extends PgColumn<PgTTimeHKT, T> {
	static readonly [entityKind]: string = "PgTTimeString";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Time.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as globalThis.Date
export type PgTTimeGlobalThisDateBuilderInitial<TName extends string> = PgTTimeGlobalThisDateBuilder<{
	name: TName;
	data: globalThis.Date;
	driverParam: Time;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeGlobalThisDateBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeGlobalThisDateBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeGlobalThisDate<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeGlobalThisDate<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeGlobalThisDate<T extends ColumnBaseConfig> extends PgColumn<PgTTimeHKT, T> {
	static readonly [entityKind]: string = "PgTTimeGlobalThisDate";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).toJSDate();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Time.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers Time as luxon.DateTime
export type PgTTimeLuxonDateTimeBuilderInitial<TName extends string> = PgTTimeLuxonDateTimeBuilder<{
	name: TName;
	data: luxon.DateTime;
	driverParam: Time;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeLuxonDateTimeBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeLuxonDateTimeBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeLuxonDateTime<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeLuxonDateTime<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeLuxonDateTime<T extends ColumnBaseConfig> extends PgColumn<PgTTimeHKT, T> {
	static readonly [entityKind]: string = "PgTTimeLuxonDateTime";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).toDateTime();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Time.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

//#region @postgresql-typed/parsers Time as unix
export type PgTTimeUnixBuilderInitial<TName extends string> = PgTTimeUnixBuilder<{
	name: TName;
	data: number;
	driverParam: Time;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTimeUnixBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTimeBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTimeUnixBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTimeUnix<MakeColumnConfig<T, TTableName>> {
		return new PgTTimeUnix<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTTimeUnix<T extends ColumnBaseConfig> extends PgColumn<PgTTimeHKT, T> {
	static readonly [entityKind]: string = "PgTTimeUnix";

	getSQLType(): string {
		return "time";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Time.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = Time.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
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
	if (config.mode === "Time") return new PgTTimeBuilder(name);
	if (config.mode === "string") return new PgTTimeStringBuilder(name);
	if (config.mode === "luxon.DateTime") return new PgTTimeLuxonDateTimeBuilder(name);
	if (config.mode === "unix") return new PgTTimeUnixBuilder(name);
	return new PgTTimeGlobalThisDateBuilder(name);
}
