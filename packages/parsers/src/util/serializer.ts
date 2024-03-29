import type { Constructors } from "../types/Constructors.js";
import type { FromParameters } from "../types/FromParameters.js";
import type { ObjectFunction } from "../types/ObjectFunction.js";
import type { PgTPBase } from "./PgTPBase.js";

export const serializer =
	<DataType>(constructor: Constructors | ObjectFunction<PgTPBase<DataType>>) =>
	(value: FromParameters<Constructors> | null) => {
		if (value === null) return "NULL";
		try {
			if ("setN" in constructor) constructor = constructor.setN(Number.POSITIVE_INFINITY);
			return constructor.from(value as string).postgres;
		} catch {
			return "NULL";
		}
	};
