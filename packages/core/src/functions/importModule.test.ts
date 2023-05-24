import { expect, test } from "vitest";

import { importModule } from "./importModule";

test("importModule", async () => {
	const result = await importModule("../__mocks__/testImport.js");
	expect(result).toEqual({ test: "test" });
});
