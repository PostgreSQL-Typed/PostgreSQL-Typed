import type { DataTypeCategory } from "../enums/DataTypeCategory.js";
import type { DataTypeKind } from "../enums/DataTypeKind.js";

export interface DataTypeRecord {
	database_name: string;
	schema_id: number;
	schema_name: string;
	type_id: number;
	type_name: string;
	kind: DataTypeKind;
	category: DataTypeCategory;
	class_id?: number;
	subtype_id?: number;
	subtype_name?: string;
	base_type_id?: number;
	base_type_name?: string;
	comment: string | null;
}
