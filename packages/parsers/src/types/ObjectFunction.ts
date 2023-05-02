import type { PGTPBase } from "../util/PGTPBase.js";
import type { SafeFrom } from "./SafeFrom.js";

export type ObjectFunction<DataType, Value = unknown> = {
	from: (value: Value) => PGTPBase<DataType>;
	safeFrom: (value: Value) => SafeFrom<PGTPBase<DataType>>;
};
