import type { Table } from "../../classes/Table.js";
import type { RootFilterOperators } from "../interfaces/RootFilterOperators.js";
import type { FilterByTableColumn } from "./FilterByTableColumn.js";

export type WhereQuery<Tables extends Table<any, any, any, any, any>, TablesColumns extends string> = {
	[Column in TablesColumns]?: Exclude<TablesColumns, Column> | FilterByTableColumn<Tables, Column>;
} & RootFilterOperators<WhereQuery<Tables, TablesColumns>>;
