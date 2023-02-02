import type { DataTypeKind } from "../enums/DataTypeKind";
import type { DataTypeBase } from "../interfaces/DataTypeBase";

export interface DomainDataType extends DataTypeBase {
	kind: DataTypeKind.Domain;
	base_type_id: number;
	base_type_name: string;
}
