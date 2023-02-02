import type { DataTypeKind } from "../enums/DataTypeKind";
import type { DataTypeBase } from "../interfaces/DataTypeBase";

export interface ArrayDataType extends DataTypeBase {
	kind: DataTypeKind.Array;
	subtype_id: number;
	subtype_name: string;
}
