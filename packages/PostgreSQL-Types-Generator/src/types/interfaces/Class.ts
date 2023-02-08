import type { ClassKind } from "../../types/enums/ClassKind.js";

export interface Class {
	database_name: string;
	schema_id: number;
	schema_name: string;
	class_id: number;
	class_name: string;
	kind: ClassKind;
	comment: string | null;
}
