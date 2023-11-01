import { Text } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Text
export type PgTTextBuilderInitial<TName extends string> = PgTTextBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTText";
	data: Text;
	driverParam: Text;
	enumValues: undefined;
}>;

export class PgTTextBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTText">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTextBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTText");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTText<MakeColumnConfig<T, TTableName>> {
		return new PgTText<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTText<T extends ColumnBaseConfig<"custom", "PgTText">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTText";

	getSQLType(): string {
		return "text";
	}

	override mapFromDriverValue(value: Text): Text {
		return Text.from(value);
	}

	override mapToDriverValue(value: Text): Text {
		const result = Text.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTTextStringBuilderInitial<TName extends string> = PgTTextStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTTextString";
	data: string;
	driverParam: Text;
	enumValues: undefined;
}>;

export class PgTTextStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTTextString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTTextStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTTextString");
	}

	/** @internal */
	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTextString<MakeColumnConfig<T, TTableName>> {
		return new PgTTextString<MakeColumnConfig<T, TTableName>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTTextString<T extends ColumnBaseConfig<"string", "PgTTextString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTTextString";

	getSQLType(): string {
		return "text";
	}

	override mapFromDriverValue(value: Text): string {
		return Text.from(value).postgres;
	}

	override mapToDriverValue(value: string): Text {
		const result = Text.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineText<TName extends string>(name: TName, config: { mode: "Text" }): PgTTextBuilderInitial<TName>;
export function defineText<TName extends string>(name: TName, config?: { mode: "string" }): PgTTextStringBuilderInitial<TName>;
export function defineText<TName extends string>(name: TName, config?: { mode: "Text" | "string" }) {
	if (config?.mode === "Text") return new PgTTextBuilder(name) as PgTTextBuilderInitial<TName>;
	return new PgTTextStringBuilder(name) as PgTTextStringBuilderInitial<TName>;
}
