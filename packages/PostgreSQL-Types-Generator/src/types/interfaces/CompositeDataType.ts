import type { DataTypeKind } from "../enums/DataTypeKind";
import type { Attribute } from "../interfaces/Attribute";
import type { DataTypeBase } from "../interfaces/DataTypeBase";

export interface CompositeDataType extends DataTypeBase {
	kind: DataTypeKind.Composite;
	class_id: number;
	attributes: Attribute[];
}
