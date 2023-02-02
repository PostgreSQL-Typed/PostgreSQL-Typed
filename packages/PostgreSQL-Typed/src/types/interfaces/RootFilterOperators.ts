import type { Filter } from "../types/Filter";

export interface RootFilterOperators<TSchema> {
	$AND?: Filter<TSchema>[];
	$OR?: Filter<TSchema>[];
}
