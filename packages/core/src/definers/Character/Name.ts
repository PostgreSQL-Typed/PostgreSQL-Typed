import { Name } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Name
export type PgTNameBuilderInitial<TName extends string> = PgTNameBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTName";
	data: Name;
	driverParam: Name;
	enumValues: undefined;
}>;

export class PgTNameBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTName">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTNameBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTName");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTName<MakeColumnConfig<T, TTableName>> {
		return new PgTName<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTName<T extends ColumnBaseConfig<"custom", "PgTName">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTName";

	getSQLType(): string {
		return "name";
	}

	override mapFromDriverValue(value: Name): Name {
		return Name.from(value);
	}

	override mapToDriverValue(value: Name): Name {
		const result = Name.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTNameStringBuilderInitial<TName extends string> = PgTNameStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTNameString";
	data: string;
	driverParam: Name;
	enumValues: undefined;
}>;

export class PgTNameStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTNameString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTNameStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTNameString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTNameString<MakeColumnConfig<T, TTableName>> {
		return new PgTNameString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTNameString<T extends ColumnBaseConfig<"string", "PgTNameString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTNameString";

	getSQLType(): string {
		return "name";
	}

	override mapFromDriverValue(value: Name): string {
		return Name.from(value).postgres;
	}

	override mapToDriverValue(value: string): Name {
		const result = Name.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineName<TName extends string>(name: TName, config: { mode: "Name" }): PgTNameBuilderInitial<TName>;
export function defineName<TName extends string>(name: TName, config?: { mode: "string" }): PgTNameStringBuilderInitial<TName>;
export function defineName<TName extends string>(name: TName, config?: { mode: "Name" | "string" }) {
	if (config?.mode === "Name") return new PgTNameBuilder(name) as PgTNameBuilderInitial<TName>;
	return new PgTNameStringBuilder(name) as PgTNameStringBuilderInitial<TName>;
}
