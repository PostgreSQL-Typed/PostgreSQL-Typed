import type { DataTypeKind } from "../enums/DataTypeKind.js";
import type { Attribute } from "../interfaces/Attribute.js";
import type { DataTypeBase } from "../interfaces/DataTypeBase.js";

export interface CompositeDataType extends DataTypeBase {
	kind: DataTypeKind.Composite;
	class_id: number;
	attributes: Attribute[];
}
