import { describe, expect, test } from "vitest";

import { getTableIdentifier } from "./getTableIdentifier";

describe("getTableIdentifier", () => {
	test("getTableIdentifier(...)", () => {
		const table = "schema.users",
			usedIdentifiers: string[] = [];

		expect(getTableIdentifier(table, usedIdentifiers)).toBe("u");
		usedIdentifiers.push("u");

		expect(getTableIdentifier(table, usedIdentifiers)).toBe("u1");
		usedIdentifiers.push("u1");

		const table2 = "schema.user_names";
		expect(getTableIdentifier(table2, usedIdentifiers)).toBe("un");
		usedIdentifiers.push("un");

		expect(getTableIdentifier(table2, usedIdentifiers)).toBe("un1");
		usedIdentifiers.push("un1");

		const table3 = "schema.unavailable_user_names";
		expect(getTableIdentifier(table3, usedIdentifiers)).toBe("uun");
		usedIdentifiers.push("uun");

		expect(getTableIdentifier(table3, usedIdentifiers)).toBe("uun1");
		usedIdentifiers.push("uun1");

		const table4 = "schema.user_notifications";
		expect(getTableIdentifier(table4, usedIdentifiers)).toBe("un2");

		//* Test invalid table names
		expect(getTableIdentifier("schema.", usedIdentifiers)).toBe("unknown");
		expect(getTableIdentifier("", usedIdentifiers)).toBe("unknown");
	});
});
