import { describe, expect, it } from "vitest";

import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";
import { greaterThanOrEqual } from "./greaterThanOrEqual.js";

describe("greaterThanOrEqual", () => {
	it("should return true if value1 is greater than or equal to value2", () => {
		expect(greaterThanOrEqual(2, 1)).toBe(true);
		expect(greaterThanOrEqual(1, 1)).toBe(true);
		expect(greaterThanOrEqual("b", "a")).toBe(true);
		expect(greaterThanOrEqual("a", "a")).toBe(true);

		//Timestamp
		expect(greaterThanOrEqual(Timestamp.from("2021-02-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(true);
		expect(greaterThanOrEqual(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(true);

		//TimestampTZ
		expect(greaterThanOrEqual(TimestampTZ.from("2021-02-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(true);
		expect(greaterThanOrEqual(TimestampTZ.from("2021-01-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(true);
	});

	it("should return false if value1 is less than value2", () => {
		expect(greaterThanOrEqual(1, 2)).toBe(false);
		expect(greaterThanOrEqual("a", "b")).toBe(false);

		//Timestamp
		expect(greaterThanOrEqual(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-02-01T00:00:00.000Z"))).toBe(false);

		//TimestampTZ
		expect(greaterThanOrEqual(TimestampTZ.from("2021-01-01T00:00:00.000+02:00"), TimestampTZ.from("2021-02-01T00:00:00.000+02:00"))).toBe(false);
	});
});
