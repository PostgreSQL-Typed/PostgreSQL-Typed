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

export function isAnyParser(parser: any) {
	if (typeof parser !== "object") return false;
	if (parser === null) return false;

	if (Bit.isAnyBit(parser)) return true;
	if (BitVarying.isAnyBitVarying(parser)) return true;
	if (Boolean.isBoolean(parser)) return true;
	if (Character.isAnyCharacter(parser)) return true;
	if (CharacterVarying.isAnyCharacterVarying(parser)) return true;
	if (Name.isName(parser)) return true;
	if (Text.isText(parser)) return true;
	if (Date.isDate(parser)) return true;
	if (DateMultiRange.isMultiRange(parser)) return true;
	if (DateRange.isRange(parser)) return true;
	if (Interval.isInterval(parser)) return true;
	if (Time.isTime(parser)) return true;
	if (Timestamp.isTimestamp(parser)) return true;
	if (TimestampMultiRange.isMultiRange(parser)) return true;
	if (TimestampRange.isRange(parser)) return true;
	if (TimestampTZ.isTimestampTZ(parser)) return true;
	if (TimestampTZMultiRange.isMultiRange(parser)) return true;
	if (TimestampTZRange.isRange(parser)) return true;
	if (TimeTZ.isTimeTZ(parser)) return true;
	if (Box.isBox(parser)) return true;
	if (Circle.isCircle(parser)) return true;
	if (Line.isLine(parser)) return true;
	if (LineSegment.isLineSegment(parser)) return true;
	if (Path.isPath(parser)) return true;
	if (Point.isPoint(parser)) return true;
	if (Polygon.isPolygon(parser)) return true;
	if (Money.isMoney(parser)) return true;
	if (Float4.isFloat4(parser)) return true;
	if (Float8.isFloat8(parser)) return true;
	if (Int2.isInt2(parser)) return true;
	if (Int4.isInt4(parser)) return true;
	if (Int4MultiRange.isMultiRange(parser)) return true;
	if (Int4Range.isRange(parser)) return true;
	if (Int8.isInt8(parser)) return true;
	if (Int8MultiRange.isMultiRange(parser)) return true;
	if (Int8Range.isRange(parser)) return true;
	if (OID.isOID(parser)) return true;
	if (UUID.isUUID(parser)) return true;

	return false;
}
