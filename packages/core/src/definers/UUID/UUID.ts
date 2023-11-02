/* eslint-disable unicorn/filename-case */
import { UUID } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

export type PgTUUIDType<
	TTableName extends string,
	TName extends string,
	TMode extends "UUID" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "UUID" ? UUID : string,
	TDriverParameter = UUID,
	TColumnType extends "PgTUUID" = "PgTUUID",
	TDataType extends "custom" = "custom",
	TEnumValues extends undefined = undefined,
> = PgTUUID<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
	columnType: TColumnType;
	dataType: TDataType;
	enumValues: TEnumValues;
}>;

//#region UUID
export type PgTUUIDBuilderInitial<TName extends string> = PgTUUIDBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTUUID";
	data: UUID;
	driverParam: UUID;
	enumValues: undefined;
}>;

export class PgTUUIDBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTUUID">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTUUIDBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTUUID");
	}

	/** @internal */
	build<TTableUUID extends string>(table: AnyPgTable<{ name: TTableUUID }>): PgTUUID<MakeColumnConfig<T, TTableUUID>> {
		return new PgTUUID<MakeColumnConfig<T, TTableUUID>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTUUID<T extends ColumnBaseConfig<"custom", "PgTUUID">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTUUID";

	getSQLType(): string {
		return "uuid";
	}

	override mapFromDriverValue(value: UUID): UUID {
		return UUID.from(value);
	}

	override mapToDriverValue(value: UUID): UUID {
		const result = UUID.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTUUIDStringBuilderInitial<TName extends string> = PgTUUIDStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTUUIDString";
	data: string;
	driverParam: UUID;
	enumValues: undefined;
}>;

export class PgTUUIDStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTUUIDString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTUUIDStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTUUIDString");
	}

	/** @internal */
	build<TTableUUID extends string>(table: AnyPgTable<{ name: TTableUUID }>): PgTUUIDString<MakeColumnConfig<T, TTableUUID>> {
		return new PgTUUIDString<MakeColumnConfig<T, TTableUUID>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTUUIDString<T extends ColumnBaseConfig<"string", "PgTUUIDString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTUUIDString";

	getSQLType(): string {
		return "uuid";
	}

	override mapFromDriverValue(value: UUID): string {
		return UUID.from(value).postgres;
	}

	override mapToDriverValue(value: string): UUID {
		const result = UUID.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineUUID<TName extends string>(name: TName, config?: { mode: "string" }): PgTUUIDStringBuilderInitial<TName>;
export function defineUUID<TName extends string>(name: TName, config?: { mode: "UUID" }): PgTUUIDBuilderInitial<TName>;
export function defineUUID<TName extends string>(name: TName, config?: { mode: "UUID" | "string" }) {
	if (config?.mode === "UUID") return new PgTUUIDBuilder(name) as PgTUUIDBuilderInitial<TName>;
	return new PgTUUIDStringBuilder(name) as PgTUUIDStringBuilderInitial<TName>;
}
