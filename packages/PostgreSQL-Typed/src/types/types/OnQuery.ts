import type { Table } from "../../index.js";
import type { RootFilterOperators } from "../interfaces/RootFilterOperators.js";
import type { FilterByTableColumn } from "./FilterByTableColumn.js";
import type { TableColumnsFromSchemaOnwards } from "./TableColumnsFromSchemaOnwards.js";

export type OnQuery<
	Tables extends Table<any, any, any, any, any>,
	newTable extends Table<any, any, any, any, any>,
	TablesColumns extends TableColumnsFromSchemaOnwards<Tables> = TableColumnsFromSchemaOnwards<Tables>,
	TableColumns extends TableColumnsFromSchemaOnwards<newTable> = TableColumnsFromSchemaOnwards<newTable>
> = {
	[Column in TableColumns]?: TablesColumns | FilterByTableColumn<newTable, Column>;
} & RootFilterOperators<OnQuery<Tables, newTable>>;
