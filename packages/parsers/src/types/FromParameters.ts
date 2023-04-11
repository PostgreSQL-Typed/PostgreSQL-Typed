/* eslint-disable @typescript-eslint/ban-types */
import type { BigNumber } from "bignumber.js";
import type { DateTime } from "luxon";

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
import type { Constructors } from "./Constructors.js";

export type FromParameters<T extends Constructors | null> =
	//* BitString
	T extends BitConstructor<infer N>
		? string | number | Bit<N> | BitObject
		: T extends BitVaryingConstructor<infer N>
		? string | number | BitVarying<N> | BitVaryingObject
		: //* Boolean
		T extends BooleanConstructor
		? string | number | boolean | Boolean | BooleanObject
		: //* Character
		T extends CharacterConstructor<infer N>
		? string | Character<N> | CharacterObject
		: T extends CharacterVaryingConstructor<infer N>
		? string | CharacterVarying<N> | CharacterVaryingObject
		: T extends NameConstructor
		? string | Name | NameObject
		: T extends TextConstructor
		? string | Text | TextObject
		: //* DateTime
		T extends DateConstructor
		? string | number | Date | globalThis.Date | DateTime | DateObject
		: T extends DateMultiRangeConstructor
		? string | DateMultiRange | DateMultiRangeObject | RawDateMultiRangeObject | DateRange[]
		: T extends DateRangeConstructor
		? string | DateRange | DateRangeObject | RawDateRangeObject | [Date, Date]
		: T extends IntervalConstructor
		? string | Interval | IntervalObject
		: T extends TimeConstructor
		? string | number | Time | globalThis.Date | DateTime | TimeObject
		: T extends TimestampConstructor
		? string | number | Timestamp | globalThis.Date | DateTime | TimestampObject
		: T extends TimestampMultiRangeConstructor
		? string | TimestampMultiRange | TimestampMultiRangeObject | RawTimestampMultiRangeObject | TimestampRange[]
		: T extends TimestampRangeConstructor
		? string | TimestampRange | TimestampRangeObject | RawTimestampRangeObject | [Timestamp, Timestamp]
		: T extends TimestampTZConstructor
		? string | number | TimestampTZ | globalThis.Date | DateTime | TimestampTZObject
		: T extends TimestampTZMultiRangeConstructor
		? string | TimestampTZMultiRange | TimestampTZMultiRangeObject | RawTimestampTZMultiRangeObject | TimestampTZRange[]
		: T extends TimestampTZRangeConstructor
		? string | TimestampTZRange | TimestampTZRangeObject | RawTimestampTZRangeObject | [TimestampTZ, TimestampTZ]
		: T extends TimeTZConstructor
		? string | number | TimeTZ | globalThis.Date | DateTime | TimeTZObject
		: //* Geometric
		T extends BoxConstructor
		? string | Box | BoxObject
		: T extends CircleConstructor
		? string | Circle | CircleObject
		: T extends LineConstructor
		? string | Line | LineObject
		: T extends LineSegmentConstructor
		? string | LineSegment | LineSegmentObject | RawLineSegmentObject | [Point, Point]
		: T extends PathConstructor
		? string | Path | PathObject | RawPathObject | Point[]
		: T extends PointConstructor
		? string | Point | PointObject
		: T extends PolygonConstructor
		? string | Polygon | PolygonObject | RawPolygonObject | Point[]
		: //* Monetary
		T extends MoneyConstructor
		? string | number | bigint | BigNumber | Money | MoneyObject
		: //* NetworkAddress
		// T extends IPAddressConstructor ? string | IPAddress | IPAddressObject :
		// T extends MACAddressConstructor ? string | number | MACAddress | MACAddressObject :
		// T extends MACAddress8Constructor ? string | bigint | MACAddress8 | MACAddress8Object :
		//* Numeric
		T extends Float4Constructor
		? string | number | bigint | BigNumber | Float4 | Float4Object
		: T extends Float8Constructor
		? string | number | bigint | BigNumber | Float8 | Float8Object
		: T extends Int2Constructor
		? string | number | Int2 | Int2Object
		: T extends Int4Constructor
		? string | number | Int4 | Int4Object
		: T extends Int4MultiRangeConstructor
		? string | Int4MultiRange | Int4MultiRangeObject | RawInt4MultiRangeObject | Int4Range[]
		: T extends Int4RangeConstructor
		? string | Int4Range | Int4RangeObject | RawInt4RangeObject | [Int4, Int4]
		: T extends Int8Constructor
		? string | number | bigint | Int8 | Int8Object
		: T extends Int8MultiRangeConstructor
		? string | Int8MultiRange | Int8MultiRangeObject | RawInt8MultiRangeObject | Int8Range[]
		: T extends Int8RangeConstructor
		? string | Int8Range | Int8RangeObject | RawInt8RangeObject | [Int8, Int8]
		: //* ObjectIdentifier
		T extends OIDConstructor
		? string | number | OID | OIDObject
		: //* UUID
		T extends UUIDConstructor
		? string | UUID | UUIDObject
		: T extends null
		? null
		: never;
