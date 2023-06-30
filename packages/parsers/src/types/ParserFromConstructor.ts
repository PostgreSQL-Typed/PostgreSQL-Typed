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
//* JSON
import type { JSON, JSONConstructor } from "../data/JSON/JSON.js";
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
import type { Constructors } from "./Constructors.js";
import { ObjectFunction } from "./ObjectFunction.js";

export type ParserFromConstructor<T extends Constructors | ObjectFunction<any> | "unknown" | null> =
	//* BitString
	T extends BitConstructor<infer N>
		? Bit<N>
		: T extends BitVaryingConstructor<infer N>
		? BitVarying<N>
		: //* Boolean
		T extends BooleanConstructor
		? Boolean
		: //* Character
		T extends CharacterConstructor<infer N>
		? Character<N>
		: T extends CharacterVaryingConstructor<infer N>
		? CharacterVarying<N>
		: T extends NameConstructor
		? Name
		: T extends TextConstructor
		? Text
		: //* DateTime
		T extends DateConstructor
		? Date
		: T extends DateMultiRangeConstructor
		? DateMultiRange
		: T extends DateRangeConstructor
		? DateRange
		: T extends IntervalConstructor
		? Interval
		: T extends TimeConstructor
		? Time
		: T extends TimestampConstructor
		? Timestamp
		: T extends TimestampMultiRangeConstructor
		? TimestampMultiRange
		: T extends TimestampRangeConstructor
		? TimestampRange
		: T extends TimestampTZConstructor
		? TimestampTZ
		: T extends TimestampTZMultiRangeConstructor
		? TimestampTZMultiRange
		: T extends TimestampTZRangeConstructor
		? TimestampTZRange
		: T extends TimeTZConstructor
		? TimeTZ
		: //* Geometric
		T extends BoxConstructor
		? Box
		: T extends CircleConstructor
		? Circle
		: T extends LineConstructor
		? Line
		: T extends LineSegmentConstructor
		? LineSegment
		: T extends PathConstructor
		? Path
		: T extends PointConstructor
		? Point
		: T extends PolygonConstructor
		? Polygon
		: //* JSON
		T extends JSONConstructor
		? JSON
		: //* Monetary
		T extends MoneyConstructor
		? Money
		: //* Numeric
		T extends Float4Constructor
		? Float4
		: T extends Float8Constructor
		? Float8
		: T extends Int2Constructor
		? Int2
		: T extends Int4Constructor
		? Int4
		: T extends Int4MultiRangeConstructor
		? Int4MultiRange
		: T extends Int4RangeConstructor
		? Int4Range
		: T extends Int8Constructor
		? Int8
		: T extends Int8MultiRangeConstructor
		? Int8MultiRange
		: T extends Int8RangeConstructor
		? Int8Range
		: //* ObjectIdentifier
		T extends OIDConstructor
		? OID
		: //* UUID
		T extends UUIDConstructor
		? UUID
		: T extends null
		? null
		: T extends "unknown"
		? unknown
		: T extends ObjectFunction<infer R>
		? R
		: never;
