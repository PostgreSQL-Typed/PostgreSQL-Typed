import type { ArrayDataType } from "../interfaces/ArrayDataType.js";
import type { BaseDataType } from "../interfaces/BaseDataType.js";
import type { CompositeDataType } from "../interfaces/CompositeDataType.js";
import type { DomainDataType } from "../interfaces/DomainDataType.js";
import type { EnumDataType } from "../interfaces/EnumDataType.js";
import type { PseudoDataType } from "../interfaces/PseudoDataType.js";

export type DataType = ArrayDataType | BaseDataType | CompositeDataType | DomainDataType | EnumDataType | PseudoDataType;
