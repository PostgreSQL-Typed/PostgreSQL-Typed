import type { ArrayDataType } from "../interfaces/ArrayDataType";
import type { BaseDataType } from "../interfaces/BaseDataType";
import type { CompositeDataType } from "../interfaces/CompositeDataType";
import type { DomainDataType } from "../interfaces/DomainDataType";
import type { EnumDataType } from "../interfaces/EnumDataType";
import type { PseudoDataType } from "../interfaces/PseudoDataType";

export type DataType = ArrayDataType | BaseDataType | CompositeDataType | DomainDataType | EnumDataType | PseudoDataType;
