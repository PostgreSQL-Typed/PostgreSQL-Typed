import type { ErrorMap } from "@postgresql-typed/util";
import { describe, expect, it } from "vitest";

import { defaultErrorMap, getErrorMap, setErrorMap } from "./errorMap.js";

describe("errorMap", () => {
	it("should return the default errorMap", () => {
		expect(getErrorMap()).toStrictEqual(defaultErrorMap);
	});

	it("should return the custom errorMap after setting it", () => {
		// eslint-disable-next-line unicorn/consistent-function-scoping
		const customErrorMap: ErrorMap = issue => {
			return issue.code === "invalid_type" ? { message: "Invalid type" } : { message: "Invalid input" };
		};

		setErrorMap(customErrorMap);

		expect(getErrorMap()).toStrictEqual(customErrorMap);

		expect(
			getErrorMap()({
				code: "invalid_type",
				expected: "string",
				received: "number",
			})
		).toStrictEqual({ message: "Invalid type" });
		expect(
			getErrorMap()({
				code: "missing_keys",
				keys: ["foo", "bar"],
			})
		).toStrictEqual({ message: "Invalid input" });
	});
});
