/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region OID
export type PgTOIDBuilderInitial<TName extends string> = PgTOIDBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTOID";
	data: OID;
	driverParam: OID;
	enumValues: undefined;
}>;

export class PgTOIDBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTOID">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTOIDBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTOID");
	}

	/** @internal */
	build<TTableOID extends string>(table: AnyPgTable<{ name: TTableOID }>): PgTOID<MakeColumnConfig<T, TTableOID>> {
		return new PgTOID<MakeColumnConfig<T, TTableOID>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTOID<T extends ColumnBaseConfig<"custom", "PgTOID">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTOID";

	getSQLType(): string {
		return "oid";
	}

	override mapFromDriverValue(value: OID): OID {
		return OID.from(value);
	}

	override mapToDriverValue(value: OID): OID {
		const result = OID.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTOIDStringBuilderInitial<TName extends string> = PgTOIDStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTOIDString";
	data: string;
	driverParam: OID;
	enumValues: undefined;
}>;

export class PgTOIDStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTOIDString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTOIDStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTOIDString");
	}

	/** @internal */
	build<TTableOID extends string>(table: AnyPgTable<{ name: TTableOID }>): PgTOIDString<MakeColumnConfig<T, TTableOID>> {
		return new PgTOIDString<MakeColumnConfig<T, TTableOID>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTOIDString<T extends ColumnBaseConfig<"string", "PgTOIDString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTOIDString";

	getSQLType(): string {
		return "oid";
	}

	override mapFromDriverValue(value: OID): string {
		return OID.from(value).postgres;
	}

	override mapToDriverValue(value: string): OID {
		const result = OID.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region number
export type PgTOIDNumberBuilderInitial<TName extends string> = PgTOIDNumberBuilder<{
	name: TName;
	dataType: "number";
	columnType: "PgTOIDNumber";
	data: number;
	driverParam: OID;
	enumValues: undefined;
}>;

export class PgTOIDNumberBuilder<T extends ColumnBuilderBaseConfig<"number", "PgTOIDNumber">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTOIDNumberBuilder";

	constructor(name: T["name"]) {
		super(name, "number", "PgTOIDNumber");
	}

	/** @internal */
	build<TTableOID extends string>(table: AnyPgTable<{ name: TTableOID }>): PgTOIDNumber<MakeColumnConfig<T, TTableOID>> {
		return new PgTOIDNumber<MakeColumnConfig<T, TTableOID>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTOIDNumber<T extends ColumnBaseConfig<"number", "PgTOIDNumber">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTOIDNumber";

	getSQLType(): string {
		return "oid";
	}

	override mapFromDriverValue(value: OID): number {
		return OID.from(value).toNumber();
	}

	override mapToDriverValue(value: number): OID {
		const result = OID.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineOID<TName extends string>(name: TName, config: { mode: "OID" }): PgTOIDBuilderInitial<TName>;
export function defineOID<TName extends string>(name: TName, config: { mode: "string" }): PgTOIDStringBuilderInitial<TName>;
export function defineOID<TName extends string>(name: TName, config?: { mode: "number" }): PgTOIDNumberBuilderInitial<TName>;
export function defineOID<TName extends string>(name: TName, config?: { mode: "OID" | "number" | "string" }) {
	if (config?.mode === "OID") return new PgTOIDBuilder(name) as PgTOIDBuilderInitial<TName>;
	if (config?.mode === "string") return new PgTOIDStringBuilder(name) as PgTOIDStringBuilderInitial<TName>;
	return new PgTOIDNumberBuilder(name) as PgTOIDNumberBuilderInitial<TName>;
}
