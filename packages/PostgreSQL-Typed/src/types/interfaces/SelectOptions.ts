import type { Filter } from "../types/Filter.js";
import type { OrderBy } from "../types/OrderBy.js";

export interface SelectOptions<Table> {
	$WHERE?: Filter<Table>;
	$ORDER_BY?: [keyof Table, OrderBy?];
	$LIMIT?: number | [number, number];
	$FETCH?: number | [number, number];
}
