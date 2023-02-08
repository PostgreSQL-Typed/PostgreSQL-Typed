import type { RootFilterOperators } from "../interfaces/RootFilterOperators.js";
import type { Condition } from "../types/Condition.js";
import type { Join } from "../types/Join.js";
import type { NestedPaths } from "../types/NestedPaths.js";
import type { PropertyType } from "../types/PropertyType.js";

export type Filter<Table> =
	| Partial<Table>
	| ({
			[Property in Join<NestedPaths<Table>, ".">]?: Condition<PropertyType<Table, Property>>;
	  } & RootFilterOperators<Table>);
