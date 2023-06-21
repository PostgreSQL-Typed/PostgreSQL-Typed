/* eslint-disable unicorn/filename-case */
import { Path } from "@postgresql-typed/parsers";
import { type ColumnBaseConfig, type ColumnBuilderBaseConfig, entityKind, Equal, type MakeColumnConfig, WithEnum } from "drizzle-orm";
import { type AnyPgTable, PgText, PgTextBuilder } from "drizzle-orm/pg-core";

export interface PgTPathConfig<TMode extends "Path" | "string" = "Path" | "string"> {
	mode?: TMode;
}

//#region @postgresql-typed/parsers Path
export type PgTPathBuilderInitial<TName extends string> = PgTPathBuilder<{
	name: TName;
	data: Path;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPathBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPathBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTPath<MakeColumnConfig<T, TTableName>> {
		return new PgTPath<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTPath<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPath";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Path.from(value as string);
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Path.from(value as string).postgres;
	}
}
//#endregion

//#region @postgresql-typed/parsers Path as string
export type PgTPathStringBuilderInitial<TName extends string> = PgTPathStringBuilder<{
	name: TName;
	data: string;
	driverParam: string;
	notNull: false;
	hasDefault: false;
}>;

export class PgTPathStringBuilder<T extends ColumnBuilderBaseConfig> extends PgTextBuilder<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPathStringBuilder";

	//@ts-expect-error - override
	override build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTPathString<MakeColumnConfig<T, TTableName>> {
		return new PgTPathString<MakeColumnConfig<T, TTableName>>(table, this.config);
	}
}

export class PgTPathString<T extends ColumnBaseConfig> extends PgText<T & WithEnum> {
	static readonly [entityKind]: string = "PgTPathString";

	override mapFromDriverValue(value: T["driverParam"]): T["data"] {
		return Path.from(value as string).postgres;
	}

	override mapToDriverValue(value: T["data"]): T["driverParam"] {
		return Path.from(value as string).postgres;
	}
}
//#endregion

// eslint-disable-next-line @typescript-eslint/ban-types
export function definePath<TName extends string, TMode extends PgTPathConfig["mode"] & {}>(
	name: TName,
	config?: PgTPathConfig<TMode>
): Equal<TMode, "Path"> extends true ? PgTPathBuilderInitial<TName> : PgTPathStringBuilderInitial<TName>;
export function definePath(name: string, config: PgTPathConfig = {}) {
	if (config.mode === "Path") return new PgTPathBuilder(name, {});
	return new PgTPathStringBuilder(name, {});
}
