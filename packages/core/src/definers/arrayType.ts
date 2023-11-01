import type { PgTArrayBuilder } from "../array.js";
import type { PgTColumnBuilder } from "../query-builders/common.js";

export type PgTArrayOfType<T> = T extends PgTColumnBuilder<infer TData>
	? PgTArrayBuilder<
			{
				name: TData["name"];
				dataType: "array";
				columnType: "PgTArray";
				data: TData["data"][];
				driverParam: TData["driverParam"][] | string;
				enumValues: TData["enumValues"];
				// eslint-disable-next-line @typescript-eslint/ban-types
			} & (T extends { notNull: true } ? { notNull: true } : {}) &
				// eslint-disable-next-line @typescript-eslint/ban-types
				(T extends { hasDefault: true } ? { hasDefault: true } : {}),
			TData
	  >
	: never;
