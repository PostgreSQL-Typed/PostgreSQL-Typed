/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable brace-style */
import {
	Column,
	ColumnBaseConfig,
	ColumnBuilder,
	ColumnBuilderBase,
	ColumnBuilderBaseConfig,
	ColumnBuilderExtraConfig,
	ColumnBuilderRuntimeConfig,
	ColumnDataType,
	entityKind,
	iife,
	MakeColumnConfig,
	Update,
} from "drizzle-orm";
import { AnyPgTable, ForeignKey, ForeignKeyBuilder, PgTable, uniqueKeyName, UpdateDeleteAction } from "drizzle-orm/pg-core";

import { PgTArrayBuilder } from "../array.js";

export interface ReferenceConfig {
	ref: () => PgTColumn;
	actions: {
		onUpdate?: UpdateDeleteAction;
		onDelete?: UpdateDeleteAction;
	};
}

export type PgTColumnBuilderBase<
	T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>,
	TTypeConfig extends object = object,
> = ColumnBuilderBase<T, TTypeConfig & { dialect: "pg" }>;

export abstract class PgTColumnBuilder<
		T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>,
		TRuntimeConfig extends object = object,
		TTypeConfig extends object = object,
		TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig,
	>
	extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & { dialect: "pg" }, TExtraConfig>
	implements PgTColumnBuilderBase<T, TTypeConfig>
{
	private foreignKeyConfigs: ReferenceConfig[] = [];

	static readonly [entityKind]: string = "PgColumnBuilder";

	array(size?: number): PgTArrayBuilder<
		{
			name: T["name"];
			dataType: "array";
			columnType: "PgTArray";
			data: T["data"][];
			driverParam: T["driverParam"][] | string;
			enumValues: T["enumValues"];
			// eslint-disable-next-line @typescript-eslint/ban-types
		} & (T extends { notNull: true } ? { notNull: true } : {}) &
			// eslint-disable-next-line @typescript-eslint/ban-types
			(T extends { hasDefault: true } ? { hasDefault: true } : {}),
		T
	> {
		return new PgTArrayBuilder(this.config.name, this as PgTColumnBuilder<any, any>, size);
	}

	/* c8 ignore next 4 */
	references(reference: ReferenceConfig["ref"], actions: ReferenceConfig["actions"] = {}): this {
		this.foreignKeyConfigs.push({ actions, ref: reference });
		return this;
	}

	/* c8 ignore next 6 */
	unique(name?: string, config?: { nulls: "distinct" | "not distinct" }): this {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		this.config.uniqueType = config?.nulls;
		return this;
	}

	/* c8 ignore next 24 */
	/** @internal */
	buildForeignKeys(column: PgTColumn, table: PgTable): ForeignKey[] {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return iife(
				(reference, actions) => {
					const builder = new ForeignKeyBuilder(() => {
						const foreignColumn = reference();
						return { columns: [column], foreignColumns: [foreignColumn] };
					});
					if (actions.onUpdate) builder.onUpdate(actions.onUpdate);

					if (actions.onDelete) builder.onDelete(actions.onDelete);

					return (
						builder as unknown as {
							build(table: PgTable): ForeignKey;
						}
					).build(table);
				},
				ref,
				actions
			);
		});
	}

	/** @internal */
	abstract build<TTableName extends string>(table: AnyPgTable<{ name: TTableName }>): PgTColumn<MakeColumnConfig<T, TTableName>>;
}

// To understand how to use `PgColumn` and `PgColumn`, see `Column` and `AnyColumn` documentation.
export abstract class PgTColumn<
	T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>,
	TRuntimeConfig extends object = {},
	TTypeConfig extends object = {},
> extends Column<T, TRuntimeConfig, TTypeConfig & { dialect: "pg" }> {
	static readonly [entityKind]: string = "PgColumn";

	constructor(
		override readonly table: PgTable,
		config: ColumnBuilderRuntimeConfig<T["data"], TRuntimeConfig>
	) {
		if (!config.uniqueName) config.uniqueName = uniqueKeyName(table, [config.name]);

		super(table, config);
	}
}

export type AnyPgColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = PgTColumn<
	Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>
>;
