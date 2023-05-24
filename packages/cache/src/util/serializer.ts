import {
	Bit,
	BitVarying,
	Boolean,
	Box,
	Character,
	CharacterVarying,
	Circle,
	Date,
	DateMultiRange,
	DateRange,
	Float4,
	Float8,
	Int2,
	Int4,
	Int4MultiRange,
	Int4Range,
	Int8,
	Int8MultiRange,
	Int8Range,
	Interval,
	Line,
	LineSegment,
	Money,
	Name,
	OID,
	Parsers,
	Path,
	Point,
	Polygon,
	Text,
	Time,
	Timestamp,
	TimestampMultiRange,
	TimestampRange,
	TimestampTZ,
	TimestampTZMultiRange,
	TimestampTZRange,
	TimeTZ,
	UUID,
} from "@postgresql-typed/parsers";

export function serializer(object: any): Record<string, any> | Record<string, any>[] {
	if (typeof object !== "object" || object === null) return object;

	if (Array.isArray(object)) return object.map(element => serializer(element));

	if (Bit.isAnyBit(object)) return toJSON("bit", object);
	if (BitVarying.isAnyBitVarying(object)) return toJSON("bitVarying", object);
	if (Boolean.isBoolean(object)) return toJSON("boolean", object);
	if (Box.isBox(object)) return toJSON("box", object);
	if (Character.isAnyCharacter(object)) return toJSON("character", object);
	if (CharacterVarying.isAnyCharacterVarying(object)) return toJSON("characterVarying", object);
	if (Circle.isCircle(object)) return toJSON("circle", object);
	if (Date.isDate(object)) return toJSON("date", object);
	/* c8 ignore next 2 */
	// Not all postgres versions support this type, it is tested in higher versions.
	if (DateMultiRange.isMultiRange(object)) return toJSON("dateMultiRange", object);
	if (DateRange.isRange(object)) return toJSON("dateRange", object);
	if (Float4.isFloat4(object)) return toJSON("float4", object);
	if (Float8.isFloat8(object)) return toJSON("float8", object);
	if (Int2.isInt2(object)) return toJSON("int2", object);
	if (Int4.isInt4(object)) return toJSON("int4", object);
	/* c8 ignore next 2 */
	// Not all postgres versions support this type, it is tested in higher versions.
	if (Int4MultiRange.isMultiRange(object)) return toJSON("int4MultiRange", object);
	if (Int4Range.isRange(object)) return toJSON("int4Range", object);
	if (Int8.isInt8(object)) return toJSON("int8", object);
	/* c8 ignore next 2 */
	// Not all postgres versions support this type, it is tested in higher versions.
	if (Int8MultiRange.isMultiRange(object)) return toJSON("int8MultiRange", object);
	if (Int8Range.isRange(object)) return toJSON("int8Range", object);
	if (Interval.isInterval(object)) return toJSON("interval", object);
	if (Line.isLine(object)) return toJSON("line", object);
	if (LineSegment.isLineSegment(object)) return toJSON("lineSegment", object);
	if (Money.isMoney(object)) return toJSON("money", object);
	if (Name.isName(object)) return toJSON("name", object);
	if (OID.isOID(object)) return toJSON("oid", object);
	if (Path.isPath(object)) return toJSON("path", object);
	if (Point.isPoint(object)) return toJSON("point", object);
	if (Polygon.isPolygon(object)) return toJSON("polygon", object);
	if (Text.isText(object)) return toJSON("text", object);
	if (Time.isTime(object)) return toJSON("time", object);
	if (Timestamp.isTimestamp(object)) return toJSON("timestamp", object);
	/* c8 ignore next 2 */
	// Not all postgres versions support this type, it is tested in higher versions.
	if (TimestampMultiRange.isMultiRange(object)) return toJSON("timestampMultiRange", object);
	if (TimestampRange.isRange(object)) return toJSON("timestampRange", object);
	if (TimestampTZ.isTimestampTZ(object)) return toJSON("timestampTZ", object);
	/* c8 ignore next 2 */
	// Not all postgres versions support this type, it is tested in higher versions.
	if (TimestampTZMultiRange.isMultiRange(object)) return toJSON("timestampTZMultiRange", object);
	if (TimestampTZRange.isRange(object)) return toJSON("timestampTZRange", object);
	if (TimeTZ.isTimeTZ(object)) return toJSON("timeTZ", object);
	if (UUID.isUUID(object)) return toJSON("uuid", object);
	return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, serializer(value)]));
}

function toJSON(
	parserType: string,
	parser: Parsers
): {
	__pgtParserType: string;
	[key: string]: any;
} {
	return {
		__pgtParserType: parserType,
		...parser.toJSON(),
	};
}
