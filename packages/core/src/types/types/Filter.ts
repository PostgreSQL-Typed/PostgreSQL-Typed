import type { RootFilterOperators } from "../interfaces/RootFilterOperators.js";
import type { Condition } from "./Condition.js";
import type { Join } from "./Join.js";
import type { NestedPaths } from "./NestedPaths.js";
import type { PropertyType } from "./PropertyType.js";

export type Filter<Table> =
	| Partial<Table>
	| ({
			[Property in Join<NestedPaths<Table>, ".">]?: Condition<PropertyType<Table, Property>>;
	  } & RootFilterOperators<Filter<Table>>);
