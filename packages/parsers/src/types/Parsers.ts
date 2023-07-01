/* eslint-disable @typescript-eslint/ban-types */
//* Binary
import type { ByteA } from "../data/Binary/ByteA.js";
//* BitString
import type { Bit } from "../data/BitString/Bit.js";
import type { BitVarying } from "../data/BitString/BitVarying.js";
//* Boolean
import type { Boolean } from "../data/Boolean/Boolean.js";
//* Character
import type { Character } from "../data/Character/Character.js";
import type { CharacterVarying } from "../data/Character/CharacterVarying.js";
import type { Name } from "../data/Character/Name.js";
import type { Text } from "../data/Character/Text.js";
//* DateTime
import type { Date } from "../data/DateTime/Date.js";
import type { DateMultiRange } from "../data/DateTime/DateMultiRange.js";
import type { DateRange } from "../data/DateTime/DateRange.js";
import type { Interval } from "../data/DateTime/Interval.js";
import type { Time } from "../data/DateTime/Time.js";
import type { Timestamp } from "../data/DateTime/Timestamp.js";
import type { TimestampMultiRange } from "../data/DateTime/TimestampMultiRange.js";
import type { TimestampRange } from "../data/DateTime/TimestampRange.js";
import type { TimestampTZ } from "../data/DateTime/TimestampTZ.js";
import type { TimestampTZMultiRange } from "../data/DateTime/TimestampTZMultiRange.js";
import type { TimestampTZRange } from "../data/DateTime/TimestampTZRange.js";
import type { TimeTZ } from "../data/DateTime/TimeTZ.js";
//* Geometric
import type { Box } from "../data/Geometric/Box.js";
import type { Circle } from "../data/Geometric/Circle.js";
import type { Line } from "../data/Geometric/Line.js";
import type { LineSegment } from "../data/Geometric/LineSegment.js";
import type { Path } from "../data/Geometric/Path.js";
import type { Point } from "../data/Geometric/Point.js";
import type { Polygon } from "../data/Geometric/Polygon.js";
//* JSON
import type { JSON } from "../data/JSON/JSON.js";
//* Monetary
import type { Money } from "../data/Monetary/Money.js";
//* NetworkAddress
// import type { IPAddressConstructor } from "../data/NetworkAddress/IPAddress.js";
// import type { MACAddressConstructor } from "../data/NetworkAddress/MACAddress.js";
// import type { MACAddress8Constructor } from "../data/NetworkAddress/MACAddress8.js";
//* Numeric
import type { Float4 } from "../data/Numeric/Float4.js";
import type { Float8 } from "../data/Numeric/Float8.js";
import type { Int2 } from "../data/Numeric/Int2.js";
import type { Int4 } from "../data/Numeric/Int4.js";
import type { Int4MultiRange } from "../data/Numeric/Int4MultiRange.js";
import type { Int4Range } from "../data/Numeric/Int4Range.js";
import type { Int8 } from "../data/Numeric/Int8.js";
import type { Int8MultiRange } from "../data/Numeric/Int8MultiRange.js";
import type { Int8Range } from "../data/Numeric/Int8Range.js";
//* ObjectIdentifier
import type { OID } from "../data/ObjectIdentifier/OID.js";
//* UUID
import type { UUID } from "../data/UUID/UUID.js";

export type Parsers =
	//* Binary
	| ByteA
	//* BitString
	| Bit<number>
	| BitVarying<number>
	//* Boolean
	| Boolean
	//* Character
	| Character<number>
	| CharacterVarying<number>
	| Name
	| Text
	//* DateTime
	| Date
	| DateMultiRange
	| DateRange
	| Interval
	| Time
	| Timestamp
	| TimestampMultiRange
	| TimestampRange
	| TimestampTZ
	| TimestampTZMultiRange
	| TimestampTZRange
	| TimeTZ
	//* Geometric
	| Box
	| Circle
	| Line
	| LineSegment
	| Path
	| Point
	| Polygon
	//* JSON
	| JSON
	//* Monetary
	| Money
	//* NetworkAddress
	// | IPAddressConstructor
	// | IPAddress
	// | MACAddressConstructor
	// | MACAddress
	// | MACAddress8Constructor
	// | MACAddress8
	//* Numeric
	| Float4
	| Float8
	| Int2
	| Int4
	| Int4MultiRange
	| Int4Range
	| Int8
	| Int8MultiRange
	| Int8Range
	//* ObjectIdentifier
	| OID
	//* UUID
	| UUID;
