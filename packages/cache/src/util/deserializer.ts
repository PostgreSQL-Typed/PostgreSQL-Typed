import {
	Bit,
	BitVarying,
	Boolean,
	Box,
	ByteA,
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
	JSON,
	Line,
	LineSegment,
	Money,
	Name,
	OID,
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

export function deserializer<T>(object: Record<string, any> | Record<string, any>[]): T {
	if (typeof object !== "object" || object === null) return object;

	if (Array.isArray(object)) return object.map(element => deserializer(element)) as T;

	if (!("__pgtParserType" in object)) return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, deserializer(value)])) as T;

	const { __pgtParserType, __pgtParserExtraData, ...rest } = object as {
		__pgtParserType: string;
		__pgtParserExtraData?: any;
		[key: string]: any;
	};

	switch (__pgtParserType) {
		case "bytea":
			return ByteA.from(rest as any) as T;
		case "bit":
			return Bit.setN(Number(__pgtParserExtraData)).from(rest as any) as T;
		case "bitVarying":
			return BitVarying.setN(Number(__pgtParserExtraData)).from(rest as any) as T;
		case "boolean":
			return Boolean.from(rest as any) as T;
		case "box":
			return Box.from(rest as any) as T;
		case "character":
			return Character.setN(Number(__pgtParserExtraData)).from(rest as any) as T;
		case "characterVarying":
			return CharacterVarying.setN(Number(__pgtParserExtraData)).from(rest as any) as T;
		case "circle":
			return Circle.from(rest as any) as T;
		case "date":
			return Date.from(rest as any) as T;
		/* c8 ignore next 5 */
		// Not all postgres versions support this type, it is tested in higher versions.
		case "dateMultiRange":
			return DateMultiRange.from(rest as any) as T;
		case "dateRange":
			return DateRange.from(rest as any) as T;
		case "float4":
			return Float4.from(rest as any) as T;
		case "float8":
			return Float8.from(rest as any) as T;
		case "int2":
			return Int2.from(rest as any) as T;
		case "int4":
			return Int4.from(rest as any) as T;
		/* c8 ignore next 5 */
		// Not all postgres versions support this type, it is tested in higher versions.
		case "int4MultiRange":
			return Int4MultiRange.from(rest as any) as T;
		case "int4Range":
			return Int4Range.from(rest as any) as T;
		case "int8":
			return Int8.from(rest as any) as T;
		/* c8 ignore next 5 */
		// Not all postgres versions support this type, it is tested in higher versions.
		case "int8MultiRange":
			return Int8MultiRange.from(rest as any) as T;
		case "int8Range":
			return Int8Range.from(rest as any) as T;
		case "interval":
			return Interval.from(rest as any) as T;
		case "line":
			return Line.from(rest as any) as T;
		case "lineSegment":
			return LineSegment.from(rest as any) as T;
		case "money":
			return Money.from(rest as any) as T;
		case "name":
			return Name.from(rest as any) as T;
		case "oid":
			return OID.from(rest as any) as T;
		case "path":
			return Path.from(rest as any) as T;
		case "point":
			return Point.from(rest as any) as T;
		case "polygon":
			return Polygon.from(rest as any) as T;
		case "json":
			return JSON.from(rest as any) as T;
		case "text":
			return Text.from(rest as any) as T;
		case "time":
			return Time.from(rest as any) as T;
		case "timestamp":
			return Timestamp.from(rest as any) as T;
		/* c8 ignore next 5 */
		// Not all postgres versions support this type, it is tested in higher versions.
		case "timestampMultiRange":
			return TimestampMultiRange.from(rest as any) as T;
		case "timestampRange":
			return TimestampRange.from(rest as any) as T;
		case "timestampTZ":
			return TimestampTZ.from(rest as any) as T;
		/* c8 ignore next 5 */
		// Not all postgres versions support this type, it is tested in higher versions.
		case "timestampTZMultiRange":
			return TimestampTZMultiRange.from(rest as any) as T;
		case "timestampTZRange":
			return TimestampTZRange.from(rest as any) as T;
		case "timeTZ":
			return TimeTZ.from(rest as any) as T;
		case "uuid":
			return UUID.from(rest as any) as T;
		/* c8 ignore next 5 */
		//! It should be impossible to reach this point, but we need to handle it to satisfy TypeScript.
		default:
			delete object.__pgtParserType;
			delete object.__pgtParserExtraData;
			return object as T;
	}
}
