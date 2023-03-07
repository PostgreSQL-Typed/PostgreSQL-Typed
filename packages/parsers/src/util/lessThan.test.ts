import { describe, expect, it } from "vitest";

import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";
import { lessThan } from "./lessThan.js";

describe("lessThan", () => {
	it("should return true if value1 is less than value2", () => {
		expect(lessThan(1, 2)).toBe(true);
		expect(lessThan("a", "b")).toBe(true);

		//Timestamp
		expect(lessThan(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-02-01T00:00:00.000Z"))).toBe(true);

		//TimestampTZ
		expect(lessThan(TimestampTZ.from("2021-01-01T00:00:00.000Z"), TimestampTZ.from("2021-02-01T02:00:00.000+02:00"))).toBe(true);
	});

	it("should return false if value1 is greater than or equal to value2", () => {
		expect(lessThan(2, 1)).toBe(false);
		expect(lessThan(1, 1)).toBe(false);
		expect(lessThan("b", "a")).toBe(false);
		expect(lessThan("a", "a")).toBe(false);

		//Timestamp
		expect(lessThan(Timestamp.from("2021-02-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(false);
		expect(lessThan(Timestamp.from("2021-01-01T00:00:00.000Z"), Timestamp.from("2021-01-01T00:00:00.000Z"))).toBe(false);

		//TimestampTZ
		expect(lessThan(TimestampTZ.from("2021-02-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(false);
		expect(lessThan(TimestampTZ.from("2021-01-01T02:00:00.000+02:00"), TimestampTZ.from("2021-01-01T00:00:00.000Z"))).toBe(false);
	});
});
