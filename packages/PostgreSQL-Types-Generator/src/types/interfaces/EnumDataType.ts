import type { DataTypeKind } from "../enums/DataTypeKind.js";
import type { DataTypeBase } from "../interfaces/DataTypeBase.js";

export interface EnumDataType extends DataTypeBase {
	kind: DataTypeKind.Enum;
	values: string[];
}
