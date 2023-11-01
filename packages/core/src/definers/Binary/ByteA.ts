import { ByteA } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTByteAType<
	TTableName extends string,
	TName extends string,
	TMode extends "ByteA" | "string" | "Buffer",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "ByteA" ? ByteA : TMode extends "string" ? string : Buffer,
	TDriverParameter = ByteA,
> = PgTByteA<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
	columnType: "PgTByteA";
	dataType: "custom";
	enumValues: undefined;
}>;

//#region ByteA
export type PgTByteABuilderInitial<TName extends string> = PgTByteABuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTByteA";
	data: ByteA;
	driverParam: ByteA;
	enumValues: undefined;
}>;

export class PgTByteABuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTByteA">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTByteABuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTByteA");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTByteA<MakeColumnConfig<T, TTableName>> {
		return new PgTByteA<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTByteA<T extends ColumnBaseConfig<"custom", "PgTByteA">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTByteA";

	getSQLType(): string {
		return "bytea";
	}

	override mapFromDriverValue(value: ByteA): ByteA {
		return ByteA.from(value);
	}

	override mapToDriverValue(value: ByteA): ByteA {
		const result = ByteA.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region Buffer
export type PgTByteABufferBuilderInitial<TName extends string> = PgTByteABufferBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTByteABuffer";
	data: Buffer;
	driverParam: ByteA;
	enumValues: undefined;
}>;

export class PgTByteABufferBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTByteABuffer">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTByteABufferBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTByteABuffer");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTByteABuffer<MakeColumnConfig<T, TTableName>> {
		return new PgTByteABuffer<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTByteABuffer<T extends ColumnBaseConfig<"custom", "PgTByteABuffer">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTByteABuffer";

	getSQLType(): string {
		return "bytea";
	}

	override mapFromDriverValue(value: ByteA): Buffer {
		return ByteA.from(value).bytea;
	}

	override mapToDriverValue(value: Buffer): ByteA {
		const result = ByteA.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTByteAStringBuilderInitial<TName extends string> = PgTByteAStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTByteAString";
	data: string;
	driverParam: ByteA;
	enumValues: undefined;
}>;

export class PgTByteAStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTByteAString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTByteAStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTByteAString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTByteAString<MakeColumnConfig<T, TTableName>> {
		return new PgTByteAString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTByteAString<T extends ColumnBaseConfig<"string", "PgTByteAString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTByteAString";

	getSQLType(): string {
		return "bytea";
	}

	override mapFromDriverValue(value: ByteA): string {
		return ByteA.from(value).postgres;
	}

	override mapToDriverValue(value: string): ByteA {
		const result = ByteA.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineByteA<TName extends string>(name: TName, config: { mode: "ByteA" }): PgTByteABuilderInitial<TName>;
export function defineByteA<TName extends string>(name: TName, config: { mode: "string" }): PgTByteAStringBuilderInitial<TName>;
export function defineByteA<TName extends string>(name: TName, config?: { mode: "Buffer" }): PgTByteABufferBuilderInitial<TName>;
export function defineByteA<TName extends string>(name: TName, config?: { mode: "ByteA" | "Buffer" | "string" }) {
	if (config?.mode === "ByteA") return new PgTByteABuilder(name) as PgTByteABuilderInitial<TName>;
	if (config?.mode === "string") return new PgTByteAStringBuilder(name) as PgTByteAStringBuilderInitial<TName>;
	return new PgTByteABufferBuilder(name) as PgTByteABufferBuilderInitial<TName>;
}
