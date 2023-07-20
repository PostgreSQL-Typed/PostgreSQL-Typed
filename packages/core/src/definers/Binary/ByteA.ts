import { ByteA } from "@postgresql-typed/parsers";
import {
	type Assume,
	type ColumnBaseConfig,
	type ColumnBuilderBaseConfig,
	type ColumnBuilderHKTBase,
	type ColumnHKTBase,
	entityKind,
	type Equal,
	type MakeColumnConfig,
} from "drizzle-orm";
import { type AnyPgTable, type PgArrayBuilder, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../../array.js";
import { PgTError } from "../../PgTError.js";

export interface PgTByteAConfig<TMode extends "ByteA" | "string" | "Buffer" = "ByteA" | "string" | "Buffer"> {
	mode?: TMode;
}

export type PgTByteAType<
	TTableName extends string,
	TName extends string,
	TMode extends "ByteA" | "string" | "Buffer",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "ByteA" ? ByteA : TMode extends "string" ? string : Buffer,
	TDriverParameter = ByteA
> = PgTByteA<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTByteABuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTByteABuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTByteAHKT;
}
export interface PgTByteAHKT extends ColumnHKTBase {
	_type: PgTByteA<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers ByteA
export type PgTByteABuilderInitial<TName extends string> = PgTByteABuilder<{
	name: TName;
	data: ByteA;
	driverParam: ByteA;
	notNull: false;
	hasDefault: false;
}>;

export class PgTByteABuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTByteABuilderHKT, T> {
	static readonly [entityKind]: string = "PgTByteABuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTByteA<MakeColumnConfig<T, TTableName>> {
		return new PgTByteA<MakeColumnConfig<T, TTableName>>(table, this.config);
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
}

export class PgTByteA<T extends ColumnBaseConfig> extends PgColumn<PgTByteAHKT, T> {
	static readonly [entityKind]: string = "PgTByteA";

	getSQLType(): string {
		return "bytea";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return ByteA.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = ByteA.safeFrom(value as Buffer);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers ByteA as string
export type PgTByteAStringBuilderInitial<TName extends string> = PgTByteAStringBuilder<{
	name: TName;
	data: string;
	driverParam: ByteA;
	notNull: false;
	hasDefault: false;
}>;

export class PgTByteAStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTByteABuilderHKT, T> {
	static readonly [entityKind]: string = "PgTByteAStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTByteAString<MakeColumnConfig<T, TTableName>> {
		return new PgTByteAString<MakeColumnConfig<T, TTableName>>(table, this.config);
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
}

export class PgTByteAString<T extends ColumnBaseConfig> extends PgColumn<PgTByteAHKT, T> {
	static readonly [entityKind]: string = "PgTByteAString";

	getSQLType(): string {
		return "bytea";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return ByteA.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = ByteA.safeFrom(value as Buffer);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers ByteA as Buffer
export type PgTByteABufferBuilderInitial<TName extends string> = PgTByteABufferBuilder<{
	name: TName;
	data: Buffer;
	driverParam: ByteA;
	notNull: false;
	hasDefault: false;
}>;

export class PgTByteABufferBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTByteABuilderHKT, T> {
	static readonly [entityKind]: string = "PgTByteABufferBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTByteABuffer<MakeColumnConfig<T, TTableName>> {
		return new PgTByteABuffer<MakeColumnConfig<T, TTableName>>(table, this.config);
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
}

export class PgTByteABuffer<T extends ColumnBaseConfig> extends PgColumn<PgTByteAHKT, T> {
	static readonly [entityKind]: string = "PgTByteABuffer";

	getSQLType(): string {
		return "bytea";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return ByteA.from(value as string).toBuffer();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = ByteA.safeFrom(value as Buffer);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineByteA<TName extends string, TMode extends PgTByteAConfig["mode"] & {}>(
	name: TName,
	config?: PgTByteAConfig<TMode>
): Equal<TMode, "ByteA"> extends true
	? PgTByteABuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTByteAStringBuilderInitial<TName>
	: PgTByteABufferBuilderInitial<TName>;
export function defineByteA(name: string, config: PgTByteAConfig = {}) {
	if (config.mode === "ByteA") return new PgTByteABuilder(name);
	if (config.mode === "string") return new PgTByteAStringBuilder(name);
	return new PgTByteABufferBuilder(name);
}
