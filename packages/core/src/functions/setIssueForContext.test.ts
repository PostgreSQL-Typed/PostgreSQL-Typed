import { expect, test } from "vitest";

import { Context } from "../types/types/Context.js";
import { setIssueForContext } from "./setIssueForContext.js";

test("setIssueForContext", () => {
	const context: Context = {
		data: [],
		errorMap: () => ({ message: "Hello" }),
		issue: undefined,
	};

	setIssueForContext(context, {
		code: "invalid_type",
		expected: "string",
		received: "number",
	});

	expect(context.issue).toBeDefined();
	expect(context.issue?.code).toBe("invalid_type");
	expect(context.issue?.message).toBe("Hello");
});
