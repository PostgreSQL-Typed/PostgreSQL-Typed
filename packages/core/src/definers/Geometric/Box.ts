import { Box } from "@postgresql-typed/parsers";
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable } from "drizzle-orm/pg-core";

import { PgTError } from "../../PgTError.js";
import { PgTColumn, PgTColumnBuilder } from "../../query-builders/common.js";

//#region Box
export type PgTBoxBuilderInitial<TName extends string> = PgTBoxBuilder<{
	name: TName;
	dataType: "custom";
	columnType: "PgTBox";
	data: Box;
	driverParam: Box;
	enumValues: undefined;
}>;

export class PgTBoxBuilder<T extends ColumnBuilderBaseConfig<"custom", "PgTBox">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTBoxBuilder";

	constructor(name: T["name"]) {
		super(name, "custom", "PgTBox");
	}

	/** @internal */
	build<TTableBox extends string>(table: AnyPgTable<{ name: TTableBox }>): PgTBox<MakeColumnConfig<T, TTableBox>> {
		return new PgTBox<MakeColumnConfig<T, TTableBox>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBox<T extends ColumnBaseConfig<"custom", "PgTBox">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTBox";

	getSQLType(): string {
		return "box";
	}

	override mapFromDriverValue(value: Box): Box {
		return Box.from(value);
	}

	override mapToDriverValue(value: Box): Box {
		const result = Box.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

//#region string
export type PgTBoxStringBuilderInitial<TName extends string> = PgTBoxStringBuilder<{
	name: TName;
	dataType: "string";
	columnType: "PgTBoxString";
	data: string;
	driverParam: Box;
	enumValues: undefined;
}>;

export class PgTBoxStringBuilder<T extends ColumnBuilderBaseConfig<"string", "PgTBoxString">> extends PgTColumnBuilder<T> {
	static readonly [entityKind]: string = "PgTBoxStringBuilder";

	constructor(name: T["name"]) {
		super(name, "string", "PgTBoxString");
	}

	/** @internal */
	build<TTableBox extends string>(table: AnyPgTable<{ name: TTableBox }>): PgTBoxString<MakeColumnConfig<T, TTableBox>> {
		return new PgTBoxString<MakeColumnConfig<T, TTableBox>>(table, this.config as ColumnBuilderRuntimeConfig<any, any>);
	}
}

export class PgTBoxString<T extends ColumnBaseConfig<"string", "PgTBoxString">> extends PgTColumn<T> {
	static readonly [entityKind]: string = "PgTBoxString";

	getSQLType(): string {
		return "box";
	}

	override mapFromDriverValue(value: Box): string {
		return Box.from(value).postgres;
	}

	override mapToDriverValue(value: string): Box {
		const result = Box.safeFrom(value);
		if (result.success) return result.data;
		throw new PgTError(this, result.error);
	}
}
//#endregion

export function defineBox<TName extends string>(name: TName, config: { mode: "Box" }): PgTBoxBuilderInitial<TName>;
export function defineBox<TName extends string>(name: TName, config?: { mode: "string" }): PgTBoxStringBuilderInitial<TName>;
export function defineBox<TName extends string>(name: TName, config?: { mode: "Box" | "string" }) {
	if (config?.mode === "Box") return new PgTBoxBuilder(name) as PgTBoxBuilderInitial<TName>;
	return new PgTBoxStringBuilder(name) as PgTBoxStringBuilderInitial<TName>;
}
