import type { Table } from "../../classes/Table.js";
import type { RootFilterOperators } from "../interfaces/RootFilterOperators.js";
import type { FilterByTableColumn } from "./FilterByTableColumn.js";
import type { TableColumnsFromSchemaOnwards } from "./TableColumnsFromSchemaOnwards.js";

export type WhereQuery<
	Tables extends Table<any, any, any, any, any>,
	TablesColumns extends TableColumnsFromSchemaOnwards<Tables> = TableColumnsFromSchemaOnwards<Tables>
> = {
	[Column in TablesColumns]?: FilterByTableColumn<Tables, Column>;
} & RootFilterOperators<WhereQuery<Tables>>;
