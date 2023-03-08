import type { ConstraintType } from "../enums/ConstraintType.js";
import type { ForeignKeyAction } from "../enums/ForeignKeyAction.js";
import type { ForeignKeyMatchType } from "../enums/ForeignKeyMatchType.js";

export interface Constraint {
	/**
	 * N.B. the name of the constraint is not necessarily unique
	 */
	constraint_name: string;
	constraint_type: ConstraintType;
	/**
	 * 0 if not a table constraint
	 */
	class_id: number;
	/**
	 * 0 if not a foreign key
	 */
	referenced_class_id: number;

	foreign_key_update_action: ForeignKeyAction;
	foreign_key_deletion_action: ForeignKeyAction;
	foreign_key_match_type: ForeignKeyMatchType;

	constraint_description: string;

	// 	pg_attribute.attnum
	table_attribute_numbers: number[];
	// 	pg_attribute.attnum
	referenced_attribute_numbers: number[];
}
