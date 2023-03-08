import type { DataTypeKind } from "../enums/DataTypeKind.js";
import type { DataTypeBase } from "../interfaces/DataTypeBase.js";

export interface PseudoDataType extends DataTypeBase {
	kind: DataTypeKind.Pseudo;
}
