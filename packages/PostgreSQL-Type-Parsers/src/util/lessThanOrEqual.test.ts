import { describe, expect, it } from "vitest";

import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";
import { lessThanOrEqual } from "./lessThanOrEqual.js";

describe("lessThanOrEqual", () => {
	it("should return true if value1 is less than or equal to value2", () => {
		expect(lessThanOrEqual(1, 2)).toBe(true);
		expect(lessThanOrEqual(1, 1)).toBe(true);
		expect(lessThanOrEqual("a", "b")).toBe(true);
		expect(lessThanOrEqual("a", "a")).toBe(true);

		//Timestamp
		expect(lessThanOrEqual(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-02-01T00:00:00.000Z"))).toBe(true);
		expect(lessThanOrEqual(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(true);

		//TimestampTZ
		expect(lessThanOrEqual(TimestampTZ.from("2021-01-01T00:00:00.000+02:00"), TimestampTZ.from("2021-02-01T00:00:00.000+02:00"))).toBe(true);
		expect(lessThanOrEqual(TimestampTZ.from("2021-01-01T00:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000+02:00"))).toBe(true);
	});

	it("should return false if value1 is greater than value2", () => {
		expect(lessThanOrEqual(2, 1)).toBe(false);
		expect(lessThanOrEqual("b", "a")).toBe(false);

		//Timestamp
		expect(lessThanOrEqual(Timestamp.from("2021-02-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(false);

		//TimestampTZ
		expect(lessThanOrEqual(TimestampTZ.from("2021-02-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(false);
	});
});
