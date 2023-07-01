import { describe, expect, it } from "vitest";

//* Binary
import { ByteA } from "../data/Binary/ByteA.js";
//* BitString
import { Bit } from "../data/BitString/Bit.js";
import { BitVarying } from "../data/BitString/BitVarying.js";
//* Boolean
import { Boolean } from "../data/Boolean/Boolean.js";
//* Character
import { Character } from "../data/Character/Character.js";
import { CharacterVarying } from "../data/Character/CharacterVarying.js";
import { Name } from "../data/Character/Name.js";
import { Text } from "../data/Character/Text.js";
//* DateTime
import { Date } from "../data/DateTime/Date.js";
import { DateMultiRange } from "../data/DateTime/DateMultiRange.js";
import { DateRange } from "../data/DateTime/DateRange.js";
import { Interval } from "../data/DateTime/Interval.js";
import { Time } from "../data/DateTime/Time.js";
import { Timestamp } from "../data/DateTime/Timestamp.js";
import { TimestampMultiRange } from "../data/DateTime/TimestampMultiRange.js";
import { TimestampRange } from "../data/DateTime/TimestampRange.js";
import { TimestampTZ } from "../data/DateTime/TimestampTZ.js";
import { TimestampTZMultiRange } from "../data/DateTime/TimestampTZMultiRange.js";
import { TimestampTZRange } from "../data/DateTime/TimestampTZRange.js";
import { TimeTZ } from "../data/DateTime/TimeTZ.js";
//* Geometric
import { Box } from "../data/Geometric/Box.js";
import { Circle } from "../data/Geometric/Circle.js";
import { Line } from "../data/Geometric/Line.js";
import { LineSegment } from "../data/Geometric/LineSegment.js";
import { Path } from "../data/Geometric/Path.js";
import { Point } from "../data/Geometric/Point.js";
import { Polygon } from "../data/Geometric/Polygon.js";
//* JSON
import { JSON } from "../data/JSON/JSON.js";
//* Monetary
import { Money } from "../data/Monetary/Money.js";
//* Numeric
import { Float4 } from "../data/Numeric/Float4.js";
import { Float8 } from "../data/Numeric/Float8.js";
import { Int2 } from "../data/Numeric/Int2.js";
import { Int4 } from "../data/Numeric/Int4.js";
import { Int4MultiRange } from "../data/Numeric/Int4MultiRange.js";
import { Int4Range } from "../data/Numeric/Int4Range.js";
import { Int8 } from "../data/Numeric/Int8.js";
import { Int8MultiRange } from "../data/Numeric/Int8MultiRange.js";
import { Int8Range } from "../data/Numeric/Int8Range.js";
//* ObjectIdentifier
import { OID } from "../data/ObjectIdentifier/OID.js";
//* UUID
import { UUID } from "../data/UUID/UUID.js";
import { isAnyParser } from "./isAnyParser.js";

describe("isAnyParser", () => {
	it("should return true for any parser", () => {
		expect(isAnyParser(ByteA.from("\\x1234"))).toBe(true);
		expect(isAnyParser(Bit.from("1"))).toBe(true);
		expect(isAnyParser(BitVarying.from("1"))).toBe(true);
		expect(isAnyParser(Boolean.from(true))).toBe(true);
		expect(isAnyParser(Character.from("a"))).toBe(true);
		expect(isAnyParser(CharacterVarying.from("a"))).toBe(true);
		expect(isAnyParser(Name.from("a"))).toBe(true);
		expect(isAnyParser(Text.from("a"))).toBe(true);
		expect(isAnyParser(Date.from("2021-01-01"))).toBe(true);
		expect(
			isAnyParser(
				DateMultiRange.from([
					DateRange.from([Date.from("2021-01-01"), Date.from("2022-01-01")]),
					DateRange.from([Date.from("2023-01-01"), Date.from("2024-01-01")]),
				])
			)
		).toBe(true);
		expect(isAnyParser(DateRange.from([Date.from("2021-01-01"), Date.from("2022-01-01")]))).toBe(true);
		expect(isAnyParser(Interval.from("1 day"))).toBe(true);
		expect(isAnyParser(Time.from("00:00:00"))).toBe(true);
		expect(isAnyParser(Timestamp.from("2021-01-01 00:00:00"))).toBe(true);
		expect(
			isAnyParser(
				TimestampMultiRange.from([
					TimestampRange.from([Timestamp.from("2021-01-01 00:00:00"), Timestamp.from("2022-01-01 00:00:00")]),
					TimestampRange.from([Timestamp.from("2023-01-01 00:00:00"), Timestamp.from("2024-01-01 00:00:00")]),
				])
			)
		).toBe(true);
		expect(isAnyParser(TimestampRange.from([Timestamp.from("2021-01-01 00:00:00"), Timestamp.from("2022-01-01 00:00:00")]))).toBe(true);
		expect(isAnyParser(TimestampTZ.from("2021-01-01 00:00:00"))).toBe(true);
		expect(
			isAnyParser(
				TimestampTZMultiRange.from([
					TimestampTZRange.from([TimestampTZ.from("2021-01-01 00:00:00"), TimestampTZ.from("2022-01-01 00:00:00")]),
					TimestampTZRange.from([TimestampTZ.from("2023-01-01 00:00:00"), TimestampTZ.from("2024-01-01 00:00:00")]),
				])
			)
		).toBe(true);
		expect(isAnyParser(TimestampTZRange.from([TimestampTZ.from("2021-01-01 00:00:00"), TimestampTZ.from("2022-01-01 00:00:00")]))).toBe(true);
		expect(isAnyParser(TimeTZ.from("00:00:00"))).toBe(true);
		expect(isAnyParser(Box.from("(0,0),(1,1)"))).toBe(true);
		expect(isAnyParser(Circle.from("<(0,0),1>"))).toBe(true);
		expect(isAnyParser(Line.from("{0,1,2}"))).toBe(true);
		expect(isAnyParser(LineSegment.from("(0,0),(1,1)"))).toBe(true);
		expect(isAnyParser(Path.from("((0,0),(1,1))"))).toBe(true);
		expect(isAnyParser(Point.from("(0,0)"))).toBe(true);
		expect(isAnyParser(Polygon.from("(0,0),(1,1)"))).toBe(true);
		expect(isAnyParser(JSON.from({}))).toBe(true);
		expect(isAnyParser(Money.from("$1.00"))).toBe(true);
		expect(isAnyParser(Float4.from(1))).toBe(true);
		expect(isAnyParser(Float8.from(1))).toBe(true);
		expect(isAnyParser(Int2.from(1))).toBe(true);
		expect(isAnyParser(Int4.from(1))).toBe(true);
		expect(isAnyParser(Int4MultiRange.from([Int4Range.from([Int4.from(1), Int4.from(2)]), Int4Range.from([Int4.from(3), Int4.from(4)])]))).toBe(true);
		expect(isAnyParser(Int4Range.from([Int4.from(1), Int4.from(2)]))).toBe(true);
		expect(isAnyParser(Int8.from(1))).toBe(true);
		expect(isAnyParser(Int8MultiRange.from([Int8Range.from([Int8.from(1), Int8.from(2)]), Int8Range.from([Int8.from(3), Int8.from(4)])]))).toBe(true);
		expect(isAnyParser(Int8Range.from([Int8.from(1), Int8.from(2)]))).toBe(true);
		expect(isAnyParser(OID.from(1))).toBe(true);
		expect(isAnyParser(UUID.from("00000000-0000-0000-0000-000000000000"))).toBe(true);
	});

	it("should return false for non-parsers", () => {
		expect(isAnyParser("1")).toBe(false);
		expect(isAnyParser(1)).toBe(false);
		expect(isAnyParser(true)).toBe(false);
		expect(isAnyParser(false)).toBe(false);
		expect(isAnyParser({})).toBe(false);
		expect(isAnyParser([])).toBe(false);
		expect(isAnyParser(null)).toBe(false);
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(isAnyParser(undefined)).toBe(false);
	});
});
