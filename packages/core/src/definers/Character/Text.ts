import { Text } from "@postgresql-typed/parsers";
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

export interface PgTTextConfig<TMode extends "Text" | "string" = "Text" | "string"> {
	mode?: TMode;
}

export type PgTTextType<
	TTableName extends string,
	TName extends string,
	TMode extends "Text" | "string",
	TNotNull extends boolean,
	THasDefault extends boolean,
	TData = TMode extends "Text" ? Text : string,
	TDriverParameter = Text
> = PgTText<{
	tableName: TTableName;
	name: TName;
	data: TData;
	driverParam: TDriverParameter;
	notNull: TNotNull;
	hasDefault: THasDefault;
}>;

export interface PgTTextBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTextBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTextHKT;
}
export interface PgTTextHKT extends ColumnHKTBase {
	_type: PgTText<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Text
export type PgTTextBuilderInitial<TName extends string> = PgTTextBuilder<{
	name: TName;
	data: Text;
	driverParam: Text;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTextBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTextBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTextBuilder";

	build<TTableText extends string>(table: AnyPgTable<{ name: TTableText }>): PgTText<MakeColumnConfig<T, TTableText>> {
		return new PgTText<MakeColumnConfig<T, TTableText>>(table, this.config);
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

export class PgTText<T extends ColumnBaseConfig> extends PgColumn<PgTTextHKT, T> {
	static readonly [entityKind]: string = "PgTText";

	getSQLType(): string {
		return "text";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Text.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Text.from(value as string);
	}
}
//#endregion

//#region @postgresql-typed/parsers Text as string
export type PgTTextStringBuilderInitial<TName extends string> = PgTTextStringBuilder<{
	name: TName;
	data: string;
	driverParam: Text;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTextStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTextBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTextStringBuilder";

	build<TTableText extends string>(table: AnyPgTable<{ name: TTableText }>): PgTTextString<MakeColumnConfig<T, TTableText>> {
		return new PgTTextString<MakeColumnConfig<T, TTableText>>(table, this.config);
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

export class PgTTextString<T extends ColumnBaseConfig> extends PgColumn<PgTTextHKT, T> {
	static readonly [entityKind]: string = "PgTTextString";

	getSQLType(): string {
		return "text";
	}

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Text.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Text.from(value as string);
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineText<TText extends string, TMode extends PgTTextConfig["mode"] & {}>(
	name: TText,
	config?: PgTTextConfig<TMode>
): Equal<TMode, "Text"> extends true ? PgTTextBuilderInitial<TText> : PgTTextStringBuilderInitial<TText>;
export function defineText(text: string, config: PgTTextConfig = {}) {
	if (config.mode === "Text") return new PgTTextBuilder(text);
	return new PgTTextStringBuilder(text);
}
