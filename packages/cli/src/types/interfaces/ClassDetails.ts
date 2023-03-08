import type { Attribute } from "../interfaces/Attribute.js";
import type { Class } from "../interfaces/Class.js";
import type { Constraint } from "../interfaces/Constraint.js";

export interface ClassDetails extends Class {
	attributes: Attribute[];
	constraints: Constraint[];
}
