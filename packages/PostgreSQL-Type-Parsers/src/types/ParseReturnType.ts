import type { INVALID, OK } from "../util/validation";

export type ParseReturnType<DataType> = OK<DataType> | INVALID;
