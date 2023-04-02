/* eslint-disable unicorn/filename-case */
import { describe, expectTypeOf, test } from "vitest";

//* BitString
import type { Bit, BitConstructor } from "../data/BitString/Bit.js";
import type { BitVarying, BitVaryingConstructor } from "../data/BitString/BitVarying.js";
//* Boolean
import type { Boolean, BooleanConstructor } from "../data/Boolean/Boolean.js";
//* Character
import type { Character, CharacterConstructor } from "../data/Character/Character.js";
import type { CharacterVarying, CharacterVaryingConstructor } from "../data/Character/CharacterVarying.js";
import type { Name, NameConstructor } from "../data/Character/Name.js";
import type { Text, TextConstructor } from "../data/Character/Text.js";
//* DateTime
import type { Date, DateConstructor } from "../data/DateTime/Date.js";
import type { DateMultiRange, DateMultiRangeConstructor } from "../data/DateTime/DateMultiRange.js";
import type { DateRange, DateRangeConstructor } from "../data/DateTime/DateRange.js";
import type { Interval, IntervalConstructor } from "../data/DateTime/Interval.js";
import type { Time, TimeConstructor } from "../data/DateTime/Time.js";
import type { Timestamp, TimestampConstructor } from "../data/DateTime/Timestamp.js";
import type { TimestampMultiRange, TimestampMultiRangeConstructor } from "../data/DateTime/TimestampMultiRange.js";
import type { TimestampRange, TimestampRangeConstructor } from "../data/DateTime/TimestampRange.js";
import type { TimestampTZ, TimestampTZConstructor } from "../data/DateTime/TimestampTZ.js";
import type { TimestampTZMultiRange, TimestampTZMultiRangeConstructor } from "../data/DateTime/TimestampTZMultiRange.js";
import type { TimestampTZRange, TimestampTZRangeConstructor } from "../data/DateTime/TimestampTZRange.js";
import type { TimeTZ, TimeTZConstructor } from "../data/DateTime/TimeTZ.js";
//* Geometric
import type { Box, BoxConstructor } from "../data/Geometric/Box.js";
import type { Circle, CircleConstructor } from "../data/Geometric/Circle.js";
import type { Line, LineConstructor } from "../data/Geometric/Line.js";
import type { LineSegment, LineSegmentConstructor } from "../data/Geometric/LineSegment.js";
import type { Path, PathConstructor } from "../data/Geometric/Path.js";
import type { Point, PointConstructor } from "../data/Geometric/Point.js";
import type { Polygon, PolygonConstructor } from "../data/Geometric/Polygon.js";
//* Monetary
import type { Money, MoneyConstructor } from "../data/Monetary/Money.js";
//* NetworkAddress
// import type { IPAddressConstructor } from "../data/NetworkAddress/IPAddress.js";
// import type { MACAddressConstructor } from "../data/NetworkAddress/MACAddress.js";
// import type { MACAddress8Constructor } from "../data/NetworkAddress/MACAddress8.js";
//* Numeric
import type { Float4, Float4Constructor } from "../data/Numeric/Float4.js";
import type { Float8, Float8Constructor } from "../data/Numeric/Float8.js";
import type { Int2, Int2Constructor } from "../data/Numeric/Int2.js";
import type { Int4, Int4Constructor } from "../data/Numeric/Int4.js";
import type { Int4MultiRange, Int4MultiRangeConstructor } from "../data/Numeric/Int4MultiRange.js";
import type { Int4Range, Int4RangeConstructor } from "../data/Numeric/Int4Range.js";
import type { Int8, Int8Constructor } from "../data/Numeric/Int8.js";
import type { Int8MultiRange, Int8MultiRangeConstructor } from "../data/Numeric/Int8MultiRange.js";
import type { Int8Range, Int8RangeConstructor } from "../data/Numeric/Int8Range.js";
//* ObjectIdentifier
import type { OID, OIDConstructor } from "../data/ObjectIdentifier/OID.js";
//* UUID
import type { UUID, UUIDConstructor } from "../data/UUID/UUID.js";
//* ConstructorFromParser
import type { ConstructorFromParser } from "./ConstructorFromParser.js";

describe("ConstructorFromParser", () => {
	test("ConstructorFromParser<Bit<...>>", () => {
		let a: ConstructorFromParser<Bit<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<BitConstructor<1> | undefined>();

		let b: ConstructorFromParser<Bit<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<BitConstructor<8> | undefined>();

		let c: ConstructorFromParser<Bit<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<BitConstructor<number> | undefined>();
	});

	test("ConstructorFromParser<BitVarying<...>>", () => {
		let a: ConstructorFromParser<BitVarying<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<BitVaryingConstructor<1> | undefined>();

		let b: ConstructorFromParser<BitVarying<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<BitVaryingConstructor<8> | undefined>();

		let c: ConstructorFromParser<BitVarying<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<BitVaryingConstructor<number> | undefined>();
	});

	test("ConstructorFromParser<Boolean>", () => {
		// eslint-disable-next-line @typescript-eslint/ban-types
		let a: ConstructorFromParser<Boolean> | undefined;
		expectTypeOf(a).toEqualTypeOf<BooleanConstructor | undefined>();
	});

	test("ConstructorFromParser<Character<...>>", () => {
		let a: ConstructorFromParser<Character<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<CharacterConstructor<1> | undefined>();

		let b: ConstructorFromParser<Character<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<CharacterConstructor<8> | undefined>();

		let c: ConstructorFromParser<Character<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<CharacterConstructor<number> | undefined>();
	});

	test("ConstructorFromParser<CharacterVarying<...>>", () => {
		let a: ConstructorFromParser<CharacterVarying<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<CharacterVaryingConstructor<1> | undefined>();

		let b: ConstructorFromParser<CharacterVarying<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<CharacterVaryingConstructor<8> | undefined>();

		let c: ConstructorFromParser<CharacterVarying<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<CharacterVaryingConstructor<number> | undefined>();
	});

	test("ConstructorFromParser<Name>", () => {
		let a: ConstructorFromParser<Name> | undefined;
		expectTypeOf(a).toEqualTypeOf<NameConstructor | undefined>();
	});

	test("ConstructorFromParser<Text>", () => {
		let a: ConstructorFromParser<Text> | undefined;
		expectTypeOf(a).toEqualTypeOf<TextConstructor | undefined>();
	});

	test("ConstructorFromParser<Date>", () => {
		let a: ConstructorFromParser<Date> | undefined;
		expectTypeOf(a).toEqualTypeOf<DateConstructor | undefined>();
	});

	test("ConstructorFromParser<DateMultiRange>", () => {
		let a: ConstructorFromParser<DateMultiRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<DateMultiRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<DateRange>", () => {
		let a: ConstructorFromParser<DateRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<DateRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<Interval>", () => {
		let a: ConstructorFromParser<Interval> | undefined;
		expectTypeOf(a).toEqualTypeOf<IntervalConstructor | undefined>();
	});

	test("ConstructorFromParser<Time>", () => {
		let a: ConstructorFromParser<Time> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimeConstructor | undefined>();
	});

	test("ConstructorFromParser<Timestamp>", () => {
		let a: ConstructorFromParser<Timestamp> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimestampConstructor | undefined>();
	});

	test("ConstructorFromParser<TimestampMultiRange>", () => {
		let a: ConstructorFromParser<TimestampMultiRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimestampMultiRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<TimestampRange>", () => {
		let a: ConstructorFromParser<TimestampRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimestampRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<TimestampTZ>", () => {
		let a: ConstructorFromParser<TimestampTZ> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimestampTZConstructor | undefined>();
	});

	test("ConstructorFromParser<TimestampTZMultiRange>", () => {
		let a: ConstructorFromParser<TimestampTZMultiRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimestampTZMultiRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<TimestampTZRange>", () => {
		let a: ConstructorFromParser<TimestampTZRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimestampTZRangeConstructor | undefined>();
	});

	test("TimeTZ", () => {
		let a: ConstructorFromParser<TimeTZ> | undefined;
		expectTypeOf(a).toEqualTypeOf<TimeTZConstructor | undefined>();
	});

	test("ConstructorFromParser<Box>", () => {
		let a: ConstructorFromParser<Box> | undefined;
		expectTypeOf(a).toEqualTypeOf<BoxConstructor | undefined>();
	});

	test("ConstructorFromParser<Circle>", () => {
		let a: ConstructorFromParser<Circle> | undefined;
		expectTypeOf(a).toEqualTypeOf<CircleConstructor | undefined>();
	});

	test("ConstructorFromParser<Line>", () => {
		let a: ConstructorFromParser<Line> | undefined;
		expectTypeOf(a).toEqualTypeOf<LineConstructor | undefined>();
	});

	test("ConstructorFromParser<LineSegment>", () => {
		let a: ConstructorFromParser<LineSegment> | undefined;
		expectTypeOf(a).toEqualTypeOf<LineSegmentConstructor | undefined>();
	});

	test("ConstructorFromParser<Path>", () => {
		let a: ConstructorFromParser<Path> | undefined;
		expectTypeOf(a).toEqualTypeOf<PathConstructor | undefined>();
	});

	test("ConstructorFromParser<Point>", () => {
		let a: ConstructorFromParser<Point> | undefined;
		expectTypeOf(a).toEqualTypeOf<PointConstructor | undefined>();
	});

	test("ConstructorFromParser<Polygon>", () => {
		let a: ConstructorFromParser<Polygon> | undefined;
		expectTypeOf(a).toEqualTypeOf<PolygonConstructor | undefined>();
	});

	test("ConstructorFromParser<Money>", () => {
		let a: ConstructorFromParser<Money> | undefined;
		expectTypeOf(a).toEqualTypeOf<MoneyConstructor | undefined>();
	});

	test("ConstructorFromParser<Float4>", () => {
		let a: ConstructorFromParser<Float4> | undefined;
		expectTypeOf(a).toEqualTypeOf<Float4Constructor | undefined>();
	});

	test("ConstructorFromParser<Float8>", () => {
		let a: ConstructorFromParser<Float8> | undefined;
		expectTypeOf(a).toEqualTypeOf<Float8Constructor | undefined>();
	});

	test("ConstructorFromParser<Int2>", () => {
		let a: ConstructorFromParser<Int2> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int2Constructor | undefined>();
	});

	test("ConstructorFromParser<Int4>", () => {
		let a: ConstructorFromParser<Int4> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int4Constructor | undefined>();
	});

	test("ConstructorFromParser<Int4MultiRange>", () => {
		let a: ConstructorFromParser<Int4MultiRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int4MultiRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<Int4Range>", () => {
		let a: ConstructorFromParser<Int4Range> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int4RangeConstructor | undefined>();
	});

	test("ConstructorFromParser<Int8>", () => {
		let a: ConstructorFromParser<Int8> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int8Constructor | undefined>();
	});

	test("ConstructorFromParser<Int8MultiRange>", () => {
		let a: ConstructorFromParser<Int8MultiRange> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int8MultiRangeConstructor | undefined>();
	});

	test("ConstructorFromParser<Int8Range>", () => {
		let a: ConstructorFromParser<Int8Range> | undefined;
		expectTypeOf(a).toEqualTypeOf<Int8RangeConstructor | undefined>();
	});

	test("ConstructorFromParser<OID>", () => {
		let a: ConstructorFromParser<OID> | undefined;
		expectTypeOf(a).toEqualTypeOf<OIDConstructor | undefined>();
	});

	test("ConstructorFromParser<UUID>", () => {
		let a: ConstructorFromParser<UUID> | undefined;
		expectTypeOf(a).toEqualTypeOf<UUIDConstructor | undefined>();
	});
});
