/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/parsers";
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

export interface PgTOIDConfig<TMode extends "OID" | "string" | "number" = "OID" | "string" | "number"> {
	mode?: TMode;
}

export type PgTOIDType<
	TTableName extends string,
	TName extends string,
	TMode extends "OID" | "string" | "number",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "OID" ? OID : TMode extends "string" ? string : number,
	TDriverParameter = OID
> = PgTOID<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTOIDBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTOIDBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTOIDHKT;
}
export interface PgTOIDHKT extends ColumnHKTBase {
	_type: PgTOID<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers OID
export type PgTOIDBuilderInitial<TName extends string> = PgTOIDBuilder<{
	name: TName;
	data: OID;
	driverParam: OID;
	notNull: false;
	hasDefault: false;
}>;

export class PgTOIDBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTOIDBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTOIDBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTOID<MakeColumnConfig<T, TTableName>> {
		return new PgTOID<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTOID<T extends ColumnBaseConfig> extends PgColumn<PgTOIDHKT, T> {
	static readonly [entityKind]: string = "PgTOID";

	getSQLType(): string {
		return "oid";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return OID.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = OID.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers OID as string
export type PgTOIDStringBuilderInitial<TName extends string> = PgTOIDStringBuilder<{
	name: TName;
	data: string;
	driverParam: OID;
	notNull: false;
	hasDefault: false;
}>;

export class PgTOIDStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTOIDBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTOIDStringBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTOIDString<MakeColumnConfig<T, TTableName>> {
		return new PgTOIDString<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTOIDString<T extends ColumnBaseConfig> extends PgColumn<PgTOIDHKT, T> {
	static readonly [entityKind]: string = "PgTOIDString";

	getSQLType(): string {
		return "oid";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return OID.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = OID.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region @postgresql-typed/parsers OID as number
export type PgTOIDNumberBuilderInitial<TName extends string> = PgTOIDNumberBuilder<{
	name: TName;
	data: number;
	driverParam: OID;
	notNull: false;
	hasDefault: false;
}>;

export class PgTOIDNumberBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTOIDBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTOIDNumberBuilder";

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTOIDNumber<MakeColumnConfig<T, TTableName>> {
		return new PgTOIDNumber<MakeColumnConfig<T, TTableName>>(table, this.config);
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

export class PgTOIDNumber<T extends ColumnBaseConfig> extends PgColumn<PgTOIDHKT, T> {
	static readonly [entityKind]: string = "PgTOIDNumber";

	getSQLType(): string {
		return "oid";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return OID.from(value as string).toNumber();
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		const result = OID.safeFrom(value as string);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineOID<TName extends string, TMode extends PgTOIDConfig["mode"] & {}>(
	name: TName,
	config?: PgTOIDConfig<TMode>
): Equal<TMode, "OID"> extends true
	? PgTOIDBuilderInitial<TName>
	: Equal<TMode, "string"> extends true
	? PgTOIDStringBuilderInitial<TName>
	: PgTOIDNumberBuilderInitial<TName>;
export function defineOID(name: string, config: PgTOIDConfig = {}) {
	if (config.mode === "OID") return new PgTOIDBuilder(name);
	if (config.mode === "string") return new PgTOIDStringBuilder(name);
	return new PgTOIDNumberBuilder(name);
}
