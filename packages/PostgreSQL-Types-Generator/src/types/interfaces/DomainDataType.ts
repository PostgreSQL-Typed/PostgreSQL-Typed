import type { DataTypeKind } from "../enums/DataTypeKind.js";
import type { DataTypeBase } from "../interfaces/DataTypeBase.js";

export interface DomainDataType extends DataTypeBase {
	kind: DataTypeKind.Domain;
	base_type_id: number;
	base_type_name: string;
}
