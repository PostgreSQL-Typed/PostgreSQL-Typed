/* eslint-disable unicorn/filename-case */
import { Text } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTTextConfig<TMode extends "Text" | "string" = "Text" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Text
export type PgTTextBuilderInitial<TName extends string> = PgTTextBuilder<{
	name: TName;
	data: Text;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTextBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTextBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTText<MakeColumnConfig<T, TTableName>> {
		return new PgTText<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTText<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTText";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Text.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Text.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Text as string
export type PgTTextStringBuilderInitial<TName extends string> = PgTTextStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTTextStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTextStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTTextString<MakeColumnConfig<T, TTableName>> {
		return new PgTTextString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTTextString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTTextString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Text.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Text.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function defineText<TName extends string, TMode extends PgTTextConfig["mode"] & {}>(
	name: TName,
	config?: PgTTextConfig<TMode>
): Equal<TMode, "Text"> extends true ? PgTTextBuilderInitial<TName> : PgTTextStringBuilderInitial<TName>;
export function defineText(name: string, config: PgTTextConfig = {}) {
	if (config.mode === "Text") return new PgTTextBuilder(name, {});
	return new PgTTextStringBuilder(name, {});
}
