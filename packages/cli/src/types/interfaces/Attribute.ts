export interface Attribute {
	database_name: string;
	schema_id: number;
	schema_name: string;
	class_id: number;
	class_name: string;
	attribute_number: number;
	attribute_name: string;
	type_id: number;
	type_length: number;
	type_name: string;
	not_null: boolean;
	has_default: boolean;
	default: string;
	comment: string;
}
