import type { DataTypeKind } from "../enums/DataTypeKind.js";
import type { DataTypeBase } from "../interfaces/DataTypeBase.js";

export interface BaseDataType extends DataTypeBase {
	kind: DataTypeKind.Base;
	subtype_id?: number;
	subtype_name?: string;
}
