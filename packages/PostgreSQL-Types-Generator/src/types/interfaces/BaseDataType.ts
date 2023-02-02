import type { DataTypeKind } from "../enums/DataTypeKind";
import type { DataTypeBase } from "../interfaces/DataTypeBase";

export interface BaseDataType extends DataTypeBase {
	kind: DataTypeKind.Base;
	subtype_id?: number;
	subtype_name?: string;
}
