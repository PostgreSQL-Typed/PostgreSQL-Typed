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
import { type AnyPgTable, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

export interface PgTTextConfig<TMode extends "Text" | "string" = "Text" | "string"> {
	mode?: TMode;
}
export interface PgTTextBuilderHKT extends ColumnBuilderHKTBase {
	_type: PgTTextBuilder<Assume<this["config"], ColumnBuilderBaseConfig>>;
	_columnHKT: PgTTextHKT;
}
export interface PgTTextHKT extends ColumnHKTBase {
	_type: PgTText<Assume<this["config"], ColumnBaseConfig>>;
}

//#region @postgresql-typed/parsers Text
export type PgTTextBuilderInitial<TText extends string> = PgTTextBuilder<{
	name: TText;
	data: Text;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTextBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTextBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTextBuilder";

	build<TTableText extends string>(table: AnyPgTable<{ name: TTableText }>): PgTText<MakeColumnConfig<T, TTableText>> {
		return new PgTText<MakeColumnConfig<T, TTableText>>(table, this.config);
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
		return Text.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Text as string
export type PgTTextStringBuilderInitial<TText extends string> = PgTTextStringBuilder<{
	name: TText;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTextStringBuilder<T extends ColumnBuilderBaseConfig> extends PgColumnBuilder<PgTTextBuilderHKT, T> {
	static readonly [entityKind]: string = "PgTTextStringBuilder";

	build<TTableText extends string>(table: AnyPgTable<{ name: TTableText }>): PgTTextString<MakeColumnConfig<T, TTableText>> {
		return new PgTTextString<MakeColumnConfig<T, TTableText>>(table, this.config);
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
		return Text.from(value as string).postgres;
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
