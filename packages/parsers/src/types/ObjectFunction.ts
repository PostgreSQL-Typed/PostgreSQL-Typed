import { SafeFrom } from "./SafeFrom.js";

export type ObjectFunction<DataType, Value = string> = {
	from: (value: Value) => DataType;
	safeFrom: (value: Value) => SafeFrom<DataType>;
};
