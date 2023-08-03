/* eslint-disable unicorn/filename-case */

import type { BigNumber } from "bignumber.js";
import type { DateTime } from "luxon";
import { describe, expectTypeOf, test } from "vitest";

//* Binary
import type { ByteA, ByteAConstructor, ByteAObject } from "../data/Binary/ByteA.js";
//* BitString
import type { Bit, BitConstructor, BitObject } from "../data/BitString/Bit.js";
import type { BitVarying, BitVaryingConstructor, BitVaryingObject } from "../data/BitString/BitVarying.js";
//* Boolean
import type { Boolean, BooleanConstructor, BooleanObject } from "../data/Boolean/Boolean.js";
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
//* Enumerated
import type { Enum, EnumConstructor, EnumObject } from "../data/Enumerated/Enum.js";
//* Geometric
import type { Box, BoxConstructor, BoxObject } from "../data/Geometric/Box.js";
import type { Circle, CircleConstructor, CircleObject } from "../data/Geometric/Circle.js";
import type { Line, LineConstructor, LineObject } from "../data/Geometric/Line.js";
import type { LineSegment, LineSegmentConstructor, LineSegmentObject, RawLineSegmentObject } from "../data/Geometric/LineSegment.js";
import type { Path, PathConstructor, PathObject, RawPathObject } from "../data/Geometric/Path.js";
import type { Point, PointConstructor, PointObject } from "../data/Geometric/Point.js";
import type { Polygon, PolygonConstructor, PolygonObject, RawPolygonObject } from "../data/Geometric/Polygon.js";
//* JSON
import type { JSON, JSONConstructor, JSONObject } from "../data/JSON/JSON.js";
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
	test("FromParameters<ByteAConstructor>", () => {
		let a: FromParameters<ByteAConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | ByteA | Buffer | ByteAObject | undefined>();
	});

	test("FromParameters<BitConstructor<...>>", () => {
		let a: FromParameters<BitConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			| string
			| number
			| BitObject
			| Bit<number>
			| BitVarying<number>
			| Character<number>
			| CharacterVarying<number>
			| Name
			| Text
			| Int2
			| Int4
			| Int8
			| OID
			| undefined
		>();
	});

	test("FromParameters<BitVaryingConstructor<...>>", () => {
		let a: FromParameters<BitVaryingConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			| string
			| number
			| BitVaryingObject
			| Bit<number>
			| BitVarying<number>
			| Character<number>
			| CharacterVarying<number>
			| Name
			| Text
			| Int2
			| Int4
			| Int8
			| OID
			| undefined
		>();
	});

	test("FromParameters<BooleanConstructor>", () => {
		let a: FromParameters<BooleanConstructor> | undefined;
		// eslint-disable-next-line @typescript-eslint/ban-types
		expectTypeOf(a).toEqualTypeOf<string | number | boolean | Boolean | BooleanObject | undefined>();
	});

	test("FromParameters<CharacterConstructor<...>>", () => {
		let a: FromParameters<CharacterConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			| string
			| CharacterObject
			| Bit<number>
			| BitVarying<number>
			| Character<number>
			| CharacterVarying<number>
			| Name
			| Text
			| Int2
			| Int4
			| Int8
			| OID
			| UUID
			| undefined
		>();
	});

	test("FromParameters<CharacterVaryingConstructor<...>>", () => {
		let a: FromParameters<CharacterVaryingConstructor<1>> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			| string
			| CharacterVaryingObject
			| Bit<number>
			| BitVarying<number>
			| Character<number>
			| CharacterVarying<number>
			| Name
			| Text
			| Int2
			| Int4
			| Int8
			| OID
			| UUID
			| undefined
		>();
	});

	test("FromParameters<NameConstructor>", () => {
		let a: FromParameters<NameConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Character<number> | CharacterVarying<number> | Name | Text | UUID | NameObject | undefined>();
	});

	test("FromParameters<TextConstructor>", () => {
		let a: FromParameters<TextConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Character<number> | CharacterVarying<number> | Name | Text | UUID | TextObject | undefined>();
	});

	test("FromParameters<DateConstructor>", () => {
		let a: FromParameters<DateConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Date | globalThis.Date | DateTime | DateObject | undefined>();
	});

	test("FromParameters<DateMultiRangeConstructor>", () => {
		let a: FromParameters<DateMultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | DateMultiRange | DateMultiRangeObject | RawDateMultiRangeObject | DateRange[] | undefined>();
	});

	test("FromParameters<DateRangeConstructor>", () => {
		let a: FromParameters<DateRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | DateRange | DateRangeObject | RawDateRangeObject | [Date, Date] | undefined>();
	});

	test("FromParameters<IntervalConstructor>", () => {
		let a: FromParameters<IntervalConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Interval | IntervalObject | undefined>();
	});

	test("FromParameters<TimeConstructor>", () => {
		let a: FromParameters<TimeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Time | globalThis.Date | DateTime | TimeObject | undefined>();
	});

	test("FromParameters<TimestampConstructor>", () => {
		let a: FromParameters<TimestampConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Timestamp | globalThis.Date | DateTime | TimestampObject | undefined>();
	});

	test("FromParameters<TimestampMultiRangeConstructor>", () => {
		let a: FromParameters<TimestampMultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampMultiRange | TimestampMultiRangeObject | RawTimestampMultiRangeObject | TimestampRange[] | undefined>();
	});

	test("FromParameters<TimestampRangeConstructor>", () => {
		let a: FromParameters<TimestampRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampRange | TimestampRangeObject | RawTimestampRangeObject | [Timestamp, Timestamp] | undefined>();
	});

	test("FromParameters<TimestampTZConstructor>", () => {
		let a: FromParameters<TimestampTZConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | TimestampTZ | globalThis.Date | DateTime | TimestampTZObject | undefined>();
	});

	test("FromParameters<TimestampTZMultiRangeConstructor>", () => {
		let a: FromParameters<TimestampTZMultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			string | TimestampTZMultiRange | TimestampTZMultiRangeObject | RawTimestampTZMultiRangeObject | TimestampTZRange[] | undefined
		>();
	});

	test("FromParameters<TimestampTZRangeConstructor>", () => {
		let a: FromParameters<TimestampTZRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | TimestampTZRange | TimestampTZRangeObject | RawTimestampTZRangeObject | [TimestampTZ, TimestampTZ] | undefined>();
	});

	test("TimeTZ", () => {
		let a: FromParameters<TimeTZConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | TimeTZ | globalThis.Date | DateTime | TimeTZObject | undefined>();
	});

	test("Enum", () => {
		let a: FromParameters<EnumConstructor<string, ["foo"]>> | undefined;
		expectTypeOf(a).toEqualTypeOf<
			string | Character<number> | CharacterVarying<number> | Enum<string, [string, ...string[]]> | Name | Text | UUID | EnumObject | undefined
		>();
	});

	test("FromParameters<BoxConstructor>", () => {
		let a: FromParameters<BoxConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Box | BoxObject | undefined>();
	});

	test("FromParameters<CircleConstructor>", () => {
		let a: FromParameters<CircleConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Circle | CircleObject | undefined>();
	});

	test("FromParameters<LineConstructor>", () => {
		let a: FromParameters<LineConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Line | LineObject | undefined>();
	});

	test("FromParameters<LineSegmentConstructor>", () => {
		let a: FromParameters<LineSegmentConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | LineSegment | LineSegmentObject | RawLineSegmentObject | [Point, Point] | undefined>();
	});

	test("FromParameters<PathConstructor>", () => {
		let a: FromParameters<PathConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Point[] | Path | PathObject | RawPathObject | undefined>();
	});

	test("FromParameters<PointConstructor>", () => {
		let a: FromParameters<PointConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Point | PointObject | undefined>();
	});

	test("FromParameters<PolygonConstructor>", () => {
		let a: FromParameters<PolygonConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Point[] | Polygon | PolygonObject | RawPolygonObject | undefined>();
	});

	test("FromParameters<JSONConstructor>", () => {
		let a: FromParameters<JSONConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | boolean | Record<string, unknown> | unknown[] | JSON | JSONObject | null | undefined>();
	});

	test("FromParameters<MoneyConstructor>", () => {
		let a: FromParameters<MoneyConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | BigNumber | Money | MoneyObject | undefined>();
	});

	test("FromParameters<Float4Constructor>", () => {
		let a: FromParameters<Float4Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | BigNumber | Float4 | Float4Object | undefined>();
	});

	test("FromParameters<Float8Constructor>", () => {
		let a: FromParameters<Float8Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | BigNumber | Float8 | Float8Object | undefined>();
	});

	test("FromParameters<Int2Constructor>", () => {
		let a: FromParameters<Int2Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Int2 | Int2Object | undefined>();
	});

	test("FromParameters<Int4Constructor>", () => {
		let a: FromParameters<Int4Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | Int4 | Int4Object | undefined>();
	});

	test("FromParameters<Int4MultiRangeConstructor>", () => {
		let a: FromParameters<Int4MultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int4MultiRange | Int4MultiRangeObject | RawInt4MultiRangeObject | Int4Range[] | undefined>();
	});

	test("FromParameters<Int4RangeConstructor>", () => {
		let a: FromParameters<Int4RangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int4Range | Int4RangeObject | RawInt4RangeObject | [Int4, Int4] | undefined>();
	});

	test("FromParameters<Int8Constructor>", () => {
		let a: FromParameters<Int8Constructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | bigint | Int8 | Int8Object | undefined>();
	});

	test("FromParameters<Int8MultiRangeConstructor>", () => {
		let a: FromParameters<Int8MultiRangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int8MultiRange | Int8MultiRangeObject | RawInt8MultiRangeObject | Int8Range[] | undefined>();
	});

	test("FromParameters<Int8RangeConstructor>", () => {
		let a: FromParameters<Int8RangeConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Int8Range | Int8RangeObject | RawInt8RangeObject | [Int8, Int8] | undefined>();
	});

	test("FromParameters<OIDConstructor>", () => {
		let a: FromParameters<OIDConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | number | OID | OIDObject | undefined>();
	});

	test("FromParameters<UUIDConstructor>", () => {
		let a: FromParameters<UUIDConstructor> | undefined;
		expectTypeOf(a).toEqualTypeOf<string | Character<number> | CharacterVarying<number> | Name | Text | UUID | UUIDObject | undefined>();
	});

	test("FromParameters<null>", () => {
		let a: FromParameters<null> | undefined;
		expectTypeOf(a).toEqualTypeOf<null | undefined>();
	});
});
