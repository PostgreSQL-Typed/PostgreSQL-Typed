import type { INVALID, OK } from "../util/validation.js";

export type ParseReturnType<DataType> = OK<DataType> | INVALID;
