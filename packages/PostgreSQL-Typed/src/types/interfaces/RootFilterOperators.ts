import type { Filter } from "../types/Filter.js";

export interface RootFilterOperators<TSchema> {
	$AND?: Filter<TSchema>[];
	$OR?: Filter<TSchema>[];
}
