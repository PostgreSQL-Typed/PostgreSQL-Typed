import type { SafeFrom } from "./SafeFrom.js";

export type ObjectFunction<DataType, Value = unknown> = {
	from: (value: Value) => DataType;
	safeFrom: (value: Value) => SafeFrom<DataType>;
};
