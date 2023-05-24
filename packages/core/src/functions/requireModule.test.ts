import { expect, test } from "vitest";

import { requireModule } from "./requireModule";

test("requireModule", async () => {
	const result1 = await requireModule("./src/__mocks__/testImport.js");
	expect(result1).toEqual({ test: "test" });

	const result2 = await requireModule("./src/__mocks__/testImport.js", {
		paths: process.cwd(),
	});
	expect(result2).toEqual({ test: "test" });
});
