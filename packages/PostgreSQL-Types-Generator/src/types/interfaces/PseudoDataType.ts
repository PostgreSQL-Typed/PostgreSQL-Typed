import type { DataTypeKind } from "../enums/DataTypeKind";
import type { DataTypeBase } from "../interfaces/DataTypeBase";

export interface PseudoDataType extends DataTypeBase {
	kind: DataTypeKind.Pseudo;
}
