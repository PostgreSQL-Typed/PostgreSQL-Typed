import { Constructors } from "../index.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";

export const parser =
	<DataType>(constructor: Constructors | ObjectFunction<DataType>) =>
	(value: string | null) => {
		if (value === null) return null;
		try {
			if ("setN" in constructor) constructor = constructor.setN(Number.POSITIVE_INFINITY);
			return constructor.from(value);
		} catch {
			return null;
		}
	};
