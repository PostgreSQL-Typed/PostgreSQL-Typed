/* eslint-disable unicorn/filename-case */
import type { BigNumber } from "bignumber.js";
import type { DateTime } from "luxon";
import { describe, expectTypeOf, test } from "vitest";

//* BitString
import type { Bit, BitConstructor, BitObject } from "../data/BitString/Bit.js";
import type { BitVarying, BitVaryingConstructor, BitVaryingObject } from "../data/BitString/BitVarying.js";
//* Boolean
import type { BooleanConstructor, BooleanObject } from "../data/Boolean/Boolean.js";
//* Character
import type { Character, CharacterConstructor, CharacterObject } from "../data/Character/Character.js";
import type { CharacterVarying, CharacterVaryingConstructor, CharacterVaryingObject } from "../data/Character/CharacterVarying.js";
import type { Name, NameConstructor, NameObject } from "../data/Character/Name.js";
import type { Text, TextConstructor, TextObject } from "../data/Character/Text.js";
//* DateTime
import type { Date, DateConstructor, DateObject } from "../data/DateTime/Date.js";
import type { DateMultiRange, DateMultiRangeConstructor, DateMultiRangeObject, RawDateMultiRangeObject } from "../data/DateTime/DateMultiRange.js";
import type { DateRange, DateRangeConstructor, DateRangeObject, RawDateRangeObject } from "../data/DateTime/DateRange.js";
import type { Interval, IntervalConstructor, IntervalObject } from "../data/DateTime/Interval.js";
import type { Time, TimeConstructor, TimeObject } from "../data/DateTime/Time.js";
import type { Timestamp, TimestampConstructor, TimestampObject } from "../data/DateTime/Timestamp.js";
import type {
	RawTimestampMultiRangeObject,
	TimestampMultiRange,
	TimestampMultiRangeConstructor,
	TimestampMultiRangeObject,
} from "../data/DateTime/TimestampMultiRange.js";
import type { RawTimestampRangeObject, TimestampRange, TimestampRangeConstructor, TimestampRangeObject } from "../data/DateTime/TimestampRange.js";
import type { TimestampTZ, TimestampTZConstructor, TimestampTZObject } from "../data/DateTime/TimestampTZ.js";
import type {
	RawTimestampTZMultiRangeObject,
	TimestampTZMultiRange,
	TimestampTZMultiRangeConstructor,
	TimestampTZMultiRangeObject,
} from "../data/DateTime/TimestampTZMultiRange.js";
import type { RawTimestampTZRangeObject, TimestampTZRange, TimestampTZRangeConstructor, TimestampTZRangeObject } from "../data/DateTime/TimestampTZRange.js";
import type { TimeTZ, TimeTZConstructor, TimeTZObject } from "../data/DateTime/TimeTZ.js";
//* Geometric
import type { Box, BoxConstructor, BoxObject } from "../data/Geometric/Box.js";
import type { Circle, CircleConstructor, CircleObject } from "../data/Geometric/Circle.js";
import type { Line, LineConstructor, LineObject } from "../data/Geometric/Line.js";
import type { LineSegment, LineSegmentConstructor, LineSegmentObject, RawLineSegmentObject } from "../data/Geometric/LineSegment.js";
import type { Path, PathConstructor, PathObject, RawPathObject } from "../data/Geometric/Path.js";
import type { Point, PointConstructor, PointObject } from "../data/Geometric/Point.js";
import type { Polygon, PolygonConstructor, PolygonObject, RawPolygonObject } from "../data/Geometric/Polygon.js";
//* Monetary
import type { Money, MoneyConstructor, MoneyObject } from "../data/Monetary/Money.js";
//* NetworkAddress
// import type { IPAddressConstructor } from "../data/NetworkAddress/IPAddress.js";
// import type { MACAddressConstructor } from "../data/NetworkAddress/MACAddress.js";
// import type { MACAddress8Constructor } from "../data/NetworkAddress/MACAddress8.js";
//* Numeric
import type { Float4, Float4Constructor, Float4Object } from "../data/Numeric/Float4.js";
import type { Float8, Float8Constructor, Float8Object } from "../data/Numeric/Float8.js";
import type { Int2, Int2Constructor, Int2Object } from "../data/Numeric/Int2.js";
import type { Int4, Int4Constructor, Int4Object } from "../data/Numeric/Int4.js";
import type { Int4MultiRange, Int4MultiRangeConstructor, Int4MultiRangeObject, RawInt4MultiRangeObject } from "../data/Numeric/Int4MultiRange.js";
import type { Int4Range, Int4RangeConstructor, Int4RangeObject, RawInt4RangeObject } from "../data/Numeric/Int4Range.js";
import type { Int8, Int8Constructor, Int8Object } from "../data/Numeric/Int8.js";
import type { Int8MultiRange, Int8MultiRangeConstructor, Int8MultiRangeObject, RawInt8MultiRangeObject } from "../data/Numeric/Int8MultiRange.js";
import type { Int8Range, Int8RangeConstructor, Int8RangeObject, RawInt8RangeObject } from "../data/Numeric/Int8Range.js";
//* ObjectIdentifier
import type { OID, OIDConstructor, OIDObject } from "../data/ObjectIdentifier/OID.js";
//* UUID
import type { UUID, UUIDConstructor, UUIDObject } from "../data/UUID/UUID.js";
//* FromParameters
import type { FromParameters } from "./FromParameters.js";

describe("FromParameters", () => {
	test("FromParameters<Bit<...>>", () => {
		let a: FromParameters<BitConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | BitObject | Bit<1> | undefined>();

		let b: FromParameters<BitConstructor<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<string | number | BitObject | Bit<8> | undefined>();

		let c: FromParameters<BitConstructor<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<string | number | BitObject | Bit<number> | undefined>();
	});

	test("FromParameters<BitVarying<...>>", () => {
		let a: FromParameters<BitVaryingConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | BitVaryingObject | BitVarying<1> | undefined>();

		let b: FromParameters<BitVaryingConstructor<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<string | number | BitVaryingObject | BitVarying<8> | undefined>();

		let c: FromParameters<BitVaryingConstructor<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<string | number | BitVaryingObject | BitVarying<number> | undefined>();
	});

	test("FromParameters<Boolean>", () => {
		let a: FromParameters<BooleanConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | boolean | BooleanObject | undefined>();
	});

	test("FromParameters<Character<...>>", () => {
		let a: FromParameters<CharacterConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | CharacterObject | Character<1> | undefined>();

		let b: FromParameters<CharacterConstructor<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<string | CharacterObject | Character<8> | undefined>();

		let c: FromParameters<CharacterConstructor<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<string | CharacterObject | Character<number> | undefined>();
	});

	test("FromParameters<CharacterVarying<...>>", () => {
		let a: FromParameters<CharacterVaryingConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | CharacterVaryingObject | CharacterVarying<1> | undefined>();

		let b: FromParameters<CharacterVaryingConstructor<8>> | undefined;
		expectTypeOf(b).toEqualTypeOf<string | CharacterVaryingObject | CharacterVarying<8> | undefined>();

		let c: FromParameters<CharacterVaryingConstructor<number>> | undefined;
		expectTypeOf(c).toEqualTypeOf<string | CharacterVaryingObject | CharacterVarying<number> | undefined>();
	});

	test("FromParameters<Name>", () => {
		let a: FromParameters<NameConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Name | NameObject | undefined>();
	});

	test("FromParameters<Text>", () => {
		let a: FromParameters<TextConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Text | TextObject | undefined>();
	});

	test("FromParameters<Date>", () => {
		let a: FromParameters<DateConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Date | globalThis.Date | DateTime | DateObject | undefined>();
	});

	test("FromParameters<DateMultiRange>", () => {
		let a: FromParameters<DateMultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | DateMultiRange | DateMultiRangeObject | RawDateMultiRangeObject | DateRange[] | undefined>();
	});

	test("FromParameters<DateRange>", () => {
		let a: FromParameters<DateRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | DateRange | DateRangeObject | RawDateRangeObject | [Date, Date] | undefined>();
	});

	test("FromParameters<Interval>", () => {
		let a: FromParameters<IntervalConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Interval | IntervalObject | undefined>();
	});

	test("FromParameters<Time>", () => {
		let a: FromParameters<TimeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Time | globalThis.Date | DateTime | TimeObject | undefined>();
	});

	test("FromParameters<Timestamp>", () => {
		let a: FromParameters<TimestampConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Timestamp | globalThis.Date | DateTime | TimestampObject | undefined>();
	});

	test("FromParameters<TimestampMultiRange>", () => {
		let a: FromParameters<TimestampMultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampMultiRange | TimestampMultiRangeObject | RawTimestampMultiRangeObject | TimestampRange[] | undefined>();
	});

	test("FromParameters<TimestampRange>", () => {
		let a: FromParameters<TimestampRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampRange | TimestampRangeObject | RawTimestampRangeObject | [Timestamp, Timestamp] | undefined>();
	});

	test("FromParameters<TimestampTZ>", () => {
		let a: FromParameters<TimestampTZConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampTZ | globalThis.Date | DateTime | TimestampTZObject | undefined>();
	});

	test("FromParameters<TimestampTZMultiRange>", () => {
		let a: FromParameters<TimestampTZMultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			string | TimestampTZMultiRange | TimestampTZMultiRangeObject | RawTimestampTZMultiRangeObject | TimestampTZRange[] | undefined
		>();
	});

	test("FromParameters<TimestampTZRange>", () => {
		let a: FromParameters<TimestampTZRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampTZRange | TimestampTZRangeObject | RawTimestampTZRangeObject | [TimestampTZ, TimestampTZ] | undefined>();
	});

	test("TimeTZ", () => {
		let a: FromParameters<TimeTZConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimeTZ | globalThis.Date | DateTime | TimeTZObject | undefined>();
	});

	test("FromParameters<Box>", () => {
		let a: FromParameters<BoxConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Box | BoxObject | undefined>();
	});

	test("FromParameters<Circle>", () => {
		let a: FromParameters<CircleConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Circle | CircleObject | undefined>();
	});

	test("FromParameters<Line>", () => {
		let a: FromParameters<LineConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Line | LineObject | undefined>();
	});

	test("FromParameters<LineSegment>", () => {
		let a: FromParameters<LineSegmentConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | LineSegment | LineSegmentObject | RawLineSegmentObject | [Point, Point] | undefined>();
	});

	test("FromParameters<Path>", () => {
		let a: FromParameters<PathConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Point[] | Path | PathObject | RawPathObject | undefined>();
	});

	test("FromParameters<Point>", () => {
		let a: FromParameters<PointConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Point | PointObject | undefined>();
	});

	test("FromParameters<Polygon>", () => {
		let a: FromParameters<PolygonConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Point[] | Polygon | PolygonObject | RawPolygonObject | undefined>();
	});

	test("FromParameters<Money>", () => {
		let a: FromParameters<MoneyConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | BigNumber | Money | MoneyObject | undefined>();
	});

	test("FromParameters<Float4>", () => {
		let a: FromParameters<Float4Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | BigNumber | Float4 | Float4Object | undefined>();
	});

	test("FromParameters<Float8>", () => {
		let a: FromParameters<Float8Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | BigNumber | Float8 | Float8Object | undefined>();
	});

	test("FromParameters<Int2>", () => {
		let a: FromParameters<Int2Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Int2 | Int2Object | undefined>();
	});

	test("FromParameters<Int4>", () => {
		let a: FromParameters<Int4Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Int4 | Int4Object | undefined>();
	});

	test("FromParameters<Int4MultiRange>", () => {
		let a: FromParameters<Int4MultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int4MultiRange | Int4MultiRangeObject | RawInt4MultiRangeObject | Int4Range[] | undefined>();
	});

	test("FromParameters<Int4Range>", () => {
		let a: FromParameters<Int4RangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int4Range | Int4RangeObject | RawInt4RangeObject | [Int4, Int4] | undefined>();
	});

	test("FromParameters<Int8>", () => {
		let a: FromParameters<Int8Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | Int8 | Int8Object | undefined>();
	});

	test("FromParameters<Int8MultiRange>", () => {
		let a: FromParameters<Int8MultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int8MultiRange | Int8MultiRangeObject | RawInt8MultiRangeObject | Int8Range[] | undefined>();
	});

	test("FromParameters<Int8Range>", () => {
		let a: FromParameters<Int8RangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int8Range | Int8RangeObject | RawInt8RangeObject | [Int8, Int8] | undefined>();
	});

	test("FromParameters<OID>", () => {
		let a: FromParameters<OIDConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | OID | OIDObject | undefined>();
	});

	test("FromParameters<UUID>", () => {
		let a: FromParameters<UUIDConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | UUID | UUIDObject | undefined>();
	});
});
