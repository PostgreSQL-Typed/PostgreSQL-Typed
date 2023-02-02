import type { DataTypeKind } from "../enums/DataTypeKind";
import type { DataTypeBase } from "../interfaces/DataTypeBase";

export interface EnumDataType extends DataTypeBase {
	kind: DataTypeKind.Enum;
	values: string[];
}
