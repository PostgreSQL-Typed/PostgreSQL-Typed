import type { DataTypeKind } from "../enums/DataTypeKind.js";
import type { DataTypeBase } from "../interfaces/DataTypeBase.js";

export interface ArrayDataType extends DataTypeBase {
	kind: DataTypeKind.Array;
	subtype_id: number;
	subtype_name: string;
}
