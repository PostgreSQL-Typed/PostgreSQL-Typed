import { describe, expect, it } from "vitest";

import { pad } from "./pad";

describe("pad", () => {
	it("should pad a number", () => {
		expect(pad(1)).toBe("01");
		expect(pad(10, 2)).toBe("10");
		expect(pad(100, 2)).toBe("100");
		expect(pad(10, 4)).toBe("0010");
	});
});
