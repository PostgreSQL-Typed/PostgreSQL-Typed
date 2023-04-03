/* eslint-disable @typescript-eslint/ban-types */
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
import type { Parsers } from "./Parsers.js";

export type ConstructorFromParser<T extends Parsers | null> =
	//* BitString
	T extends Bit<infer N>
		? BitConstructor<N>
		: T extends BitVarying<infer N>
		? BitVaryingConstructor<N>
		: //* Boolean
		T extends Boolean
		? BooleanConstructor
		: //* Character
		T extends Character<infer N>
		? CharacterConstructor<N>
		: T extends CharacterVarying<infer N>
		? CharacterVaryingConstructor<N>
		: T extends Name
		? NameConstructor
		: T extends Text
		? TextConstructor
		: //* DateTime
		T extends Date
		? DateConstructor
		: T extends DateMultiRange
		? DateMultiRangeConstructor
		: T extends DateRange
		? DateRangeConstructor
		: T extends Interval
		? IntervalConstructor
		: T extends Time
		? TimeConstructor
		: T extends Timestamp
		? TimestampConstructor
		: T extends TimestampMultiRange
		? TimestampMultiRangeConstructor
		: T extends TimestampRange
		? TimestampRangeConstructor
		: T extends TimestampTZ
		? TimestampTZConstructor
		: T extends TimestampTZMultiRange
		? TimestampTZMultiRangeConstructor
		: T extends TimestampTZRange
		? TimestampTZRangeConstructor
		: T extends TimeTZ
		? TimeTZConstructor
		: //* Geometric
		T extends Box
		? BoxConstructor
		: T extends Circle
		? CircleConstructor
		: T extends Line
		? LineConstructor
		: T extends LineSegment
		? LineSegmentConstructor
		: T extends Path
		? PathConstructor
		: T extends Point
		? PointConstructor
		: T extends Polygon
		? PolygonConstructor
		: //* Monetary
		T extends Money
		? MoneyConstructor
		: //* Numeric
		T extends Float4
		? Float4Constructor
		: T extends Float8
		? Float8Constructor
		: T extends Int2
		? Int2Constructor
		: T extends Int4
		? Int4Constructor
		: T extends Int4MultiRange
		? Int4MultiRangeConstructor
		: T extends Int4Range
		? Int4RangeConstructor
		: T extends Int8
		? Int8Constructor
		: T extends Int8MultiRange
		? Int8MultiRangeConstructor
		: T extends Int8Range
		? Int8RangeConstructor
		: //* ObjectIdentifier
		T extends OID
		? OIDConstructor
		: //* UUID
		T extends UUID
		? UUIDConstructor
		: T extends null
		? null
		: never;
