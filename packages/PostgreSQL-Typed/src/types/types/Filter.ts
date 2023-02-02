import type { RootFilterOperators } from "../interfaces/RootFilterOperators";
import type { Condition } from "../types/Condition";
import type { Join } from "../types/Join";
import type { NestedPaths } from "../types/NestedPaths";
import type { PropertyType } from "../types/PropertyType";

export type Filter<Table> =
	| Partial<Table>
	| ({
			[Property in Join<NestedPaths<Table>, ".">]?: Condition<PropertyType<Table, Property>>;
	  } & RootFilterOperators<Table>);
