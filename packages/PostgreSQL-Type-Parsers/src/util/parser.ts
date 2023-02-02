import type { ObjectFunction } from "../types/ObjectFunction";

export const parser =
	<DataType>(object: any) =>
	(value: string | null) => {
		const Object = object as ObjectFunction<DataType>;

		if (value === null) return null;
		try {
			return Object.from(value);
		} catch {
			return null;
		}
	};
