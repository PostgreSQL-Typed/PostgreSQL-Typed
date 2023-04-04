/* eslint-disable @typescript-eslint/ban-types */

//* BitString
import type { BitConstructor } from "../data/BitString/Bit.js";
import type { BitVaryingConstructor } from "../data/BitString/BitVarying.js";
//* Boolean
import type { BooleanConstructor } from "../data/Boolean/Boolean.js";
//* Character
import type { CharacterConstructor } from "../data/Character/Character.js";
import type { CharacterVaryingConstructor } from "../data/Character/CharacterVarying.js";
import type { NameConstructor } from "../data/Character/Name.js";
import type { TextConstructor } from "../data/Character/Text.js";
//* DateTime
import type { DateConstructor } from "../data/DateTime/Date.js";
import type { DateMultiRangeConstructor } from "../data/DateTime/DateMultiRange.js";
import type { DateRangeConstructor } from "../data/DateTime/DateRange.js";
import type { IntervalConstructor } from "../data/DateTime/Interval.js";
import type { TimeConstructor } from "../data/DateTime/Time.js";
import type { TimestampConstructor } from "../data/DateTime/Timestamp.js";
import type { TimestampMultiRangeConstructor } from "../data/DateTime/TimestampMultiRange.js";
import type { TimestampRangeConstructor } from "../data/DateTime/TimestampRange.js";
import type { TimestampTZConstructor } from "../data/DateTime/TimestampTZ.js";
import type { TimestampTZMultiRangeConstructor } from "../data/DateTime/TimestampTZMultiRange.js";
import type { TimestampTZRangeConstructor } from "../data/DateTime/TimestampTZRange.js";
import type { TimeTZConstructor } from "../data/DateTime/TimeTZ.js";
//* Geometric
import type { BoxConstructor } from "../data/Geometric/Box.js";
import type { CircleConstructor } from "../data/Geometric/Circle.js";
import type { LineConstructor } from "../data/Geometric/Line.js";
import type { LineSegmentConstructor } from "../data/Geometric/LineSegment.js";
import type { PathConstructor } from "../data/Geometric/Path.js";
import type { PointConstructor } from "../data/Geometric/Point.js";
import type { PolygonConstructor } from "../data/Geometric/Polygon.js";
//* Monetary
import type { MoneyConstructor } from "../data/Monetary/Money.js";
//* NetworkAddress
// import type { IPAddressConstructor } from "../data/NetworkAddress/IPAddress.js";
// import type { MACAddressConstructor } from "../data/NetworkAddress/MACAddress.js";
// import type { MACAddress8Constructor } from "../data/NetworkAddress/MACAddress8.js";
//* Numeric
import type { Float4Constructor } from "../data/Numeric/Float4.js";
import type { Float8Constructor } from "../data/Numeric/Float8.js";
import type { Int2Constructor } from "../data/Numeric/Int2.js";
import type { Int4Constructor } from "../data/Numeric/Int4.js";
import type { Int4MultiRangeConstructor } from "../data/Numeric/Int4MultiRange.js";
import type { Int4RangeConstructor } from "../data/Numeric/Int4Range.js";
import type { Int8Constructor } from "../data/Numeric/Int8.js";
import type { Int8MultiRangeConstructor } from "../data/Numeric/Int8MultiRange.js";
import type { Int8RangeConstructor } from "../data/Numeric/Int8Range.js";
//* ObjectIdentifier
import type { OIDConstructor } from "../data/ObjectIdentifier/OID.js";
//* UUID
import type { UUIDConstructor } from "../data/UUID/UUID.js";
import type { Constructors } from "./Constructors.js";

export type ValueFromConstructor<T extends Constructors | null> =
	//* BitString
	T extends BitConstructor<number>
		? string
		: T extends BitVaryingConstructor<number>
		? string
		: //* Boolean
		T extends BooleanConstructor
		? boolean
		: //* Character
		T extends CharacterConstructor<number>
		? string
		: T extends CharacterVaryingConstructor<number>
		? string
		: T extends NameConstructor
		? string
		: T extends TextConstructor
		? string
		: //* DateTime
		T extends DateConstructor
		? string
		: T extends DateMultiRangeConstructor
		? string
		: T extends DateRangeConstructor
		? string
		: T extends IntervalConstructor
		? string
		: T extends TimeConstructor
		? string
		: T extends TimestampConstructor
		? string
		: T extends TimestampMultiRangeConstructor
		? string
		: T extends TimestampRangeConstructor
		? string
		: T extends TimestampTZConstructor
		? string
		: T extends TimestampTZMultiRangeConstructor
		? string
		: T extends TimestampTZRangeConstructor
		? string
		: T extends TimeTZConstructor
		? string
		: //* Geometric
		T extends BoxConstructor
		? string
		: T extends CircleConstructor
		? string
		: T extends LineConstructor
		? string
		: T extends LineSegmentConstructor
		? string
		: T extends PathConstructor
		? string
		: T extends PointConstructor
		? string
		: T extends PolygonConstructor
		? string
		: //* Monetary
		T extends MoneyConstructor
		? string
		: //* NetworkAddress
		// T extends IPAddressConstructor ? string | IPAddress | IPAddressObject :
		// T extends MACAddressConstructor ? string | number | MACAddress | MACAddressObject :
		// T extends MACAddress8Constructor ? string | bigint | MACAddress8 | MACAddress8Object :
		//* Numeric
		T extends Float4Constructor
		? string
		: T extends Float8Constructor
		? string
		: T extends Int2Constructor
		? number
		: T extends Int4Constructor
		? number
		: T extends Int4MultiRangeConstructor
		? string
		: T extends Int4RangeConstructor
		? string
		: T extends Int8Constructor
		? string
		: T extends Int8MultiRangeConstructor
		? string
		: T extends Int8RangeConstructor
		? string
		: //* ObjectIdentifier
		T extends OIDConstructor
		? number
		: //* UUID
		T extends UUIDConstructor
		? string
		: T extends null
		? null
		: never;
