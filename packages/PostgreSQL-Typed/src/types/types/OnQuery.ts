import type { Table } from "../../index.js";
import type { OnFilter } from "./OnFilter.js";

export type OnQuery<Tables extends Table<any, any, any, any, any>, newTable extends Table<any, any, any, any, any>> = {
	$ON: OnFilter<Tables, newTable>;
};
