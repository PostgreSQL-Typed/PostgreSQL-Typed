import { describe, expect, it } from "vitest";

import { defaultErrorMap, getErrorMap, setErrorMap } from "./errorMap.js";
import type { ErrorMap } from "./PgTPError.js";

describe("errorMap", () => {
	it("should return the default errorMap", () => {
		expect(getErrorMap()).toStrictEqual(defaultErrorMap);
	});

	it("should return the custom errorMap after setting it", () => {
		// eslint-disable-next-line unicorn/consistent-function-scoping
		const customErrorMap: ErrorMap = issue => {
			return issue.code === "invalid_date" ? { message: "Invalid date" } : { message: "Invalid input" };
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
