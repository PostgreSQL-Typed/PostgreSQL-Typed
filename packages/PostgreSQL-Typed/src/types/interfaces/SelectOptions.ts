import type { Filter } from "../types/Filter";
import type { OrderBy } from "../types/OrderBy";

export interface SelectOptions<Table> {
	$WHERE?: Filter<Table>;
	$ORDER_BY?: [keyof Table, OrderBy?];
	$LIMIT?: number | [number, number];
	$FETCH?: number | [number, number];
}
