import { OID as OIDEnum } from "@postgresql-typed/oids";

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
import type { Constructors } from "../types/Constructors.js";
import type { ParserFromConstructor } from "../types/ParserFromConstructor.js";

export function parserToOid(parser: ParserFromConstructor<Constructors>, array = false) {
	if (ByteA.isByteA(parser)) return array ? OIDEnum._bytea : OIDEnum.bytea;
	if (Bit.isAnyBit(parser)) return array ? OIDEnum._bit : OIDEnum.bit;
	if (BitVarying.isAnyBitVarying(parser)) return array ? OIDEnum._varbit : OIDEnum.varbit;
	if (Boolean.isBoolean(parser)) return array ? OIDEnum._bool : OIDEnum.bool;
	if (Character.isAnyCharacter(parser)) return array ? OIDEnum._char : OIDEnum.char;
	if (CharacterVarying.isAnyCharacterVarying(parser)) return array ? OIDEnum._varchar : OIDEnum.varchar;
	if (Name.isName(parser)) return array ? OIDEnum._name : OIDEnum.name;
	if (Text.isText(parser)) return array ? OIDEnum._text : OIDEnum.text;
	if (Date.isDate(parser)) return array ? OIDEnum._date : OIDEnum.date;
	if (DateMultiRange.isMultiRange(parser)) return array ? OIDEnum._datemultirange : OIDEnum.datemultirange;
	if (DateRange.isRange(parser)) return array ? OIDEnum._daterange : OIDEnum.daterange;
	if (Interval.isInterval(parser)) return array ? OIDEnum._interval : OIDEnum.interval;
	if (Time.isTime(parser)) return array ? OIDEnum._time : OIDEnum.time;
	if (Timestamp.isTimestamp(parser)) return array ? OIDEnum._timestamp : OIDEnum.timestamp;
	if (TimestampMultiRange.isMultiRange(parser)) return array ? OIDEnum._tsmultirange : OIDEnum.tsmultirange;
	if (TimestampRange.isRange(parser)) return array ? OIDEnum._tsrange : OIDEnum.tsrange;
	if (TimestampTZ.isTimestampTZ(parser)) return array ? OIDEnum._timestamptz : OIDEnum.timestamptz;
	if (TimestampTZMultiRange.isMultiRange(parser)) return array ? OIDEnum._tstzmultirange : OIDEnum.tstzmultirange;
	if (TimestampTZRange.isRange(parser)) return array ? OIDEnum._tstzrange : OIDEnum.tstzrange;
	if (TimeTZ.isTimeTZ(parser)) return array ? OIDEnum._timetz : OIDEnum.timetz;
	if (Box.isBox(parser)) return array ? OIDEnum._box : OIDEnum.box;
	if (Circle.isCircle(parser)) return array ? OIDEnum._circle : OIDEnum.circle;
	if (Line.isLine(parser)) return array ? OIDEnum._line : OIDEnum.line;
	if (LineSegment.isLineSegment(parser)) return array ? OIDEnum._lseg : OIDEnum.lseg;
	if (Path.isPath(parser)) return array ? OIDEnum._path : OIDEnum.path;
	if (Point.isPoint(parser)) return array ? OIDEnum._point : OIDEnum.point;
	if (Polygon.isPolygon(parser)) return array ? OIDEnum._polygon : OIDEnum.polygon;
	if (JSON.isJSON(parser)) return array ? OIDEnum._json : OIDEnum.json;
	if (Money.isMoney(parser)) return array ? OIDEnum._money : OIDEnum.money;
	if (Float4.isFloat4(parser)) return array ? OIDEnum._float4 : OIDEnum.float4;
	if (Float8.isFloat8(parser)) return array ? OIDEnum._float8 : OIDEnum.float8;
	if (Int2.isInt2(parser)) return array ? OIDEnum._int2 : OIDEnum.int2;
	if (Int4.isInt4(parser)) return array ? OIDEnum._int4 : OIDEnum.int4;
	if (Int4MultiRange.isMultiRange(parser)) return array ? OIDEnum._int4multirange : OIDEnum.int4multirange;
	if (Int4Range.isRange(parser)) return array ? OIDEnum._int4range : OIDEnum.int4range;
	if (Int8.isInt8(parser)) return array ? OIDEnum._int8 : OIDEnum.int8;
	if (Int8MultiRange.isMultiRange(parser)) return array ? OIDEnum._int8multirange : OIDEnum.int8multirange;
	if (Int8Range.isRange(parser)) return array ? OIDEnum._int8range : OIDEnum.int8range;
	if (OID.isOID(parser)) return array ? OIDEnum._oid : OIDEnum.oid;
	if (UUID.isUUID(parser)) return array ? OIDEnum._uuid : OIDEnum.uuid;
	return OIDEnum.unknown;
}
