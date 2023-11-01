/* eslint-disable unicorn/no-null */
import { ColumnBaseConfig, ColumnBuilderBaseConfig, ColumnBuilderRuntimeConfig, ColumnDataType, entityKind, MakeColumnConfig } from "drizzle-orm";
import { AnyPgTable, parsePgArray, PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core";

import { PgTColumnBuilder } from "./query-builders/common.js";

export class PgTArrayBuilder<
	T extends ColumnBuilderBaseConfig<"array", "PgTArray">,
	TBase extends ColumnBuilderBaseConfig<ColumnDataType, string>,
> extends PgColumnBuilder<
	T,
	{
		baseBuilder: PgTColumnBuilder<TBase>;
		size: number | undefined;
	},
	{
		baseBuilder: PgTColumnBuilder<TBase>;
	}
> {
	static override readonly [entityKind] = "PgTArrayBuilder";

	constructor(name: string, baseBuilder: PgTArrayBuilder<T, TBase>["config"]["baseBuilder"], size: number | undefined) {
		super(name, "array", "PgTArray");
		this.config.baseBuilder = baseBuilder;
		this.config.size = size;
	}

	build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTArray<MakeColumnConfig<T, TTableName>, TBase> {
		const baseColumn = (
			this.config.baseBuilder as unknown as {
				build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgColumn<MakeColumnConfig<T, TTableName>>;
			}
		).build(table);
		return new PgTArray<MakeColumnConfig<T, TTableName>, TBase>(
			table as AnyPgTable<{ name: MakeColumnConfig<T, TTableName>["tableName"] }>,
			this.config as ColumnBuilderRuntimeConfig<any, any>,
			baseColumn
		);
	}
}

export class PgTArray<T extends ColumnBaseConfig<"array", "PgTArray">, TBase extends ColumnBuilderBaseConfig<ColumnDataType, string>> extends PgColumn<T> {
	readonly size: number | undefined;

	static readonly [entityKind]: string = "PgArray";

	constructor(
		table: AnyPgTable<{ name: T["tableName"] }>,
		config: PgTArrayBuilder<T, TBase>["config"],
		readonly baseColumn: PgColumn,
		readonly range?: [number | undefined, number | undefined]
	) {
		super(table, config);
		this.size = config.size;
	}

	/* c8 ignore next 3 */
	getSQLType(): string {
		return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
	}

	override mapFromDriverValue(value: unknown[] | string): T["data"] {
		/* c8 ignore next 4 */
		if (typeof value === "string") {
			// Thank you node-postgres for not parsing enum arrays
			value = parsePgArray(value);
		}
		return value.map(v => this.baseColumn.mapFromDriverValue(v));
	}

	override mapToDriverValue(value: unknown[]): unknown[] | string {
		return value.map(v => this.baseColumn.mapToDriverValue(v));
	}
}
