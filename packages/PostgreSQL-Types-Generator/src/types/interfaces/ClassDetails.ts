import type { Attribute } from "../interfaces/Attribute";
import type { Class } from "../interfaces/Class";
import type { Constraint } from "../interfaces/Constraint";

export interface ClassDetails extends Class {
	attributes: Attribute[];
	constraints: Constraint[];
}
