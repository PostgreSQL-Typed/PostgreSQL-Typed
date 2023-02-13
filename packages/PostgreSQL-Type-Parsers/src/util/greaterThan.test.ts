import { describe, expect, it } from "vitest";

import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";
import { greaterThan } from "./greaterThan.js";

describe("greaterThan", () => {
	it("should return true if value1 is greater than value2", () => {
		expect(greaterThan(2, 1)).toBe(true);
		expect(greaterThan("b", "a")).toBe(true);

		//Timestamp
		expect(greaterThan(Timestamp.from("2021-02-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(true);

		//TimestampTZ
		expect(greaterThan(TimestampTZ.from("2021-02-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(true);
	});

	it("should return false if value1 is less than or equal to value2", () => {
		expect(greaterThan(1, 2)).toBe(false);
		expect(greaterThan(1, 1)).toBe(false);
		expect(greaterThan("a", "b")).toBe(false);
		expect(greaterThan("a", "a")).toBe(false);

		//Timestamp
		expect(greaterThan(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-02-01T00:00:00.000Z"))).toBe(false);
		expect(greaterThan(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(false);

		//TimestampTZ
		expect(greaterThan(TimestampTZ.from("2021-01-01T02:00:00.000+02:00"), TimestampTZ.from("2021-02-01T00:00:00.000+02:00"))).toBe(false);
		expect(greaterThan(TimestampTZ.from("2021-01-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(false);
	});
});
