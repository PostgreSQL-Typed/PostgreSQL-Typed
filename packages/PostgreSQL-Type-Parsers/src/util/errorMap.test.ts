import { describe, expect, it } from "vitest";

import { defaultErrorMap, getErrorMap, setErrorMap } from "./errorMap";
import type { ErrorMap } from "./PGTPError";

describe("errorMap", () => {
	it("should return the default errorMap", () => {
		expect(getErrorMap()).toStrictEqual(defaultErrorMap);
	});

	it("should return the custom errorMap after setting it", () => {
		const customErrorMap: ErrorMap = issue => {
			if (issue.code === "invalid_date") return { message: "Invalid date" };
			else return { message: "Invalid input" };
		};

		setErrorMap(customErrorMap);

		expect(getErrorMap()).toStrictEqual(customErrorMap);

		expect(
			getErrorMap()({
				code: "invalid_date",
			})
		).toStrictEqual({ message: "Invalid date" });
		expect(
			getErrorMap()({
				code: "invalid_luxon_date",
			})
		).toStrictEqual({ message: "Invalid input" });
	});
});
