import { OID } from "@postgresql-typed/oids";

import {
	arrayParser,
	arraySerializer,
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
	OID as OIDClass,
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
} from "../index.js";
import { parser } from "./parser.js";
import { serializer } from "./serializer.js";

export const defaultParserMappings = {
	[OID.bytea]: {
		parse: parser<ByteA>(ByteA),
		serialize: serializer<ByteA>(ByteA),
	},
	[OID._bytea]: {
		parse: arrayParser<ByteA>(ByteA, undefined, "\\"),
		serialize: arraySerializer<ByteA>(ByteA, undefined, "\\"),
	},
	[OID.bit]: {
		parse: parser<Bit<number>>(Bit),
		serialize: serializer<Bit<number>>(Bit),
	},
	[OID._bit]: {
		parse: arrayParser<Bit<number>>(Bit, ","),
		serialize: arraySerializer<Bit<number>>(Bit, ","),
	},
	[OID.varbit]: {
		parse: parser<BitVarying<number>>(BitVarying),
		serialize: serializer<BitVarying<number>>(BitVarying),
	},
	[OID._varbit]: {
		parse: arrayParser<BitVarying<number>>(BitVarying, ","),
		serialize: arraySerializer<BitVarying<number>>(BitVarying, ","),
	},
	[OID.bool]: {
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: parser<Boolean>(Boolean),

		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: serializer<Boolean>(Boolean),
	},
	[OID._bool]: {
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: arrayParser<Boolean>(Boolean, ","),

		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: arraySerializer<Boolean>(Boolean, ","),
	},
	[OID.char]: {
		parse: parser<Character<number>>(Character),
		serialize: serializer<Character<number>>(Character),
	},
	[OID._char]: {
		parse: arrayParser<Character<number>>(Character, ","),
		serialize: arraySerializer<Character<number>>(Character, ","),
	},
	[OID.bpchar]: {
		parse: parser<Character<number>>(Character),
		serialize: serializer<Character<number>>(Character),
	},
	[OID._bpchar]: {
		parse: arrayParser<Character<number>>(Character, ","),
		serialize: arraySerializer<Character<number>>(Character, ","),
	},
	[OID.varchar]: {
		parse: parser<CharacterVarying<number>>(CharacterVarying),
		serialize: serializer<CharacterVarying<number>>(CharacterVarying),
	},
	[OID._varchar]: {
		parse: arrayParser<CharacterVarying<number>>(CharacterVarying, ","),
		serialize: arraySerializer<CharacterVarying<number>>(CharacterVarying, ","),
	},
	[OID.name]: {
		parse: parser<Name>(Name),
		serialize: serializer<Name>(Name),
	},
	[OID._name]: {
		parse: arrayParser<Name>(Name, ","),
		serialize: arraySerializer<Name>(Name, ","),
	},
	[OID.text]: {
		parse: parser<Text>(Text),
		serialize: serializer<Text>(Text),
	},
	[OID._text]: {
		parse: arrayParser<Text>(Text, ","),
		serialize: arraySerializer<Text>(Text, ","),
	},
	[OID.date]: {
		parse: parser<Date>(Date),
		serialize: serializer<Date>(Date),
	},
	[OID._date]: {
		parse: arrayParser<Date>(Date, ","),
		serialize: arraySerializer<Date>(Date, ","),
	},
	[OID.datemultirange]: {
		parse: parser<DateMultiRange>(DateMultiRange),
		serialize: serializer<DateMultiRange>(DateMultiRange),
	},
	[OID._datemultirange]: {
		parse: arrayParser<DateMultiRange>(DateMultiRange),
		serialize: arraySerializer<DateMultiRange>(DateMultiRange),
	},
	[OID.daterange]: {
		parse: parser<DateRange>(DateRange),
		serialize: serializer<DateRange>(DateRange),
	},
	[OID._daterange]: {
		parse: arrayParser<DateRange>(DateRange),
		serialize: arraySerializer<DateRange>(DateRange),
	},
	[OID.interval]: {
		parse: parser<Interval>(Interval),
		serialize: serializer<Interval>(Interval),
	},
	[OID._interval]: {
		parse: arrayParser<Interval>(Interval),
		serialize: arraySerializer<Interval>(Interval),
	},
	[OID.time]: {
		parse: parser<Time>(Time),
		serialize: serializer<Time>(Time),
	},
	[OID._time]: {
		parse: arrayParser<Time>(Time, ","),
		serialize: arraySerializer<Time>(Time, ","),
	},
	[OID.timestamp]: {
		parse: parser<Timestamp>(Timestamp),
		serialize: serializer<Timestamp>(Timestamp),
	},
	[OID._timestamp]: {
		parse: arrayParser<Timestamp>(Timestamp),
		serialize: arraySerializer<Timestamp>(Timestamp),
	},
	[OID.tsmultirange]: {
		parse: parser<TimestampMultiRange>(TimestampMultiRange),
		serialize: serializer<TimestampMultiRange>(TimestampMultiRange),
	},
	[OID._tsmultirange]: {
		parse: arrayParser<TimestampMultiRange>(TimestampMultiRange),
		serialize: arraySerializer<TimestampMultiRange>(TimestampMultiRange),
	},
	[OID.tsrange]: {
		parse: parser<TimestampRange>(TimestampRange),
		serialize: serializer<TimestampRange>(TimestampRange),
	},
	[OID._tsrange]: {
		parse: arrayParser<TimestampRange>(TimestampRange),
		serialize: arraySerializer<TimestampRange>(TimestampRange),
	},
	[OID.timestamptz]: {
		parse: parser<TimestampTZ>(TimestampTZ),
		serialize: serializer<TimestampTZ>(TimestampTZ),
	},
	[OID._timestamptz]: {
		parse: arrayParser<TimestampTZ>(TimestampTZ),
		serialize: arraySerializer<TimestampTZ>(TimestampTZ),
	},
	[OID.tstzmultirange]: {
		parse: parser<TimestampTZMultiRange>(TimestampTZMultiRange),
		serialize: serializer<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	[OID._tstzmultirange]: {
		parse: arrayParser<TimestampTZMultiRange>(TimestampTZMultiRange),
		serialize: arraySerializer<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	[OID.tstzrange]: {
		parse: parser<TimestampTZRange>(TimestampTZRange),
		serialize: serializer<TimestampTZRange>(TimestampTZRange),
	},
	[OID._tstzrange]: {
		parse: arrayParser<TimestampTZRange>(TimestampTZRange),
		serialize: arraySerializer<TimestampTZRange>(TimestampTZRange),
	},
	[OID.timetz]: {
		parse: parser<TimeTZ>(TimeTZ),
		serialize: serializer<TimeTZ>(TimeTZ),
	},
	[OID._timetz]: {
		parse: arrayParser<TimeTZ>(TimeTZ, ","),
		serialize: arraySerializer<TimeTZ>(TimeTZ, ","),
	},
	[OID.box]: {
		parse: parser<Box>(Box),
		serialize: serializer<Box>(Box),
	},
	[OID._box]: {
		parse: arrayParser<Box>(Box, ";"),
		serialize: arraySerializer<Box>(Box, ";"),
	},
	[OID.circle]: {
		parse: parser<Circle>(Circle),
		serialize: serializer<Circle>(Circle),
	},
	[OID._circle]: {
		parse: arrayParser<Circle>(Circle),
		serialize: arraySerializer<Circle>(Circle),
	},
	[OID.line]: {
		parse: parser<Line>(Line),
		serialize: serializer<Line>(Line),
	},
	[OID._line]: {
		parse: arrayParser<Line>(Line),
		serialize: arraySerializer<Line>(Line),
	},
	[OID.lseg]: {
		parse: parser<LineSegment>(LineSegment),
		serialize: serializer<LineSegment>(LineSegment),
	},
	[OID._lseg]: {
		parse: arrayParser<LineSegment>(LineSegment),
		serialize: arraySerializer<LineSegment>(LineSegment),
	},
	[OID.path]: {
		parse: parser<Path>(Path),
		serialize: serializer<Path>(Path),
	},
	[OID._path]: {
		parse: arrayParser<Path>(Path),
		serialize: arraySerializer<Path>(Path),
	},
	[OID.point]: {
		parse: parser<Point>(Point),
		serialize: serializer<Point>(Point),
	},
	[OID._point]: {
		parse: arrayParser<Point>(Point),
		serialize: arraySerializer<Point>(Point),
	},
	[OID.polygon]: {
		parse: parser<Polygon>(Polygon),
		serialize: serializer<Polygon>(Polygon),
	},
	[OID._polygon]: {
		parse: arrayParser<Polygon>(Polygon),
		serialize: arraySerializer<Polygon>(Polygon),
	},
	[OID.json]: {
		parse: parser<JSON>(JSON),
		serialize: serializer<JSON>(JSON),
	},
	[OID._json]: {
		parse: arrayParser<JSON>(JSON, ","),
		serialize: arraySerializer<JSON>(JSON),
	},
	[OID.jsonb]: {
		parse: parser<JSON>(JSON),
		serialize: serializer<JSON>(JSON),
	},
	[OID._jsonb]: {
		parse: arrayParser<JSON>(JSON, ","),
		serialize: arraySerializer<JSON>(JSON),
	},
	[OID.money]: {
		parse: parser<Money>(Money),
		serialize: serializer<Money>(Money),
	},
	[OID._money]: {
		parse: arrayParser<Money>(Money, ","),
		serialize: arraySerializer<Money>(Money, ","),
	},
	[OID.float4]: {
		parse: parser<Float4>(Float4),
		serialize: serializer<Float4>(Float4),
	},
	[OID._float4]: {
		parse: arrayParser<Float4>(Float4, ","),
		serialize: arraySerializer<Float4>(Float4, ","),
	},
	[OID.float8]: {
		parse: parser<Float8>(Float8),
		serialize: serializer<Float8>(Float8),
	},
	[OID._float8]: {
		parse: arrayParser<Float8>(Float8, ","),
		serialize: arraySerializer<Float8>(Float8, ","),
	},
	[OID.int2]: {
		parse: parser<Int2>(Int2),
		serialize: serializer<Int2>(Int2),
	},
	[OID._int2]: {
		parse: arrayParser<Int2>(Int2, ","),
		serialize: arraySerializer<Int2>(Int2, ","),
	},
	[OID.int4]: {
		parse: parser<Int4>(Int4),
		serialize: serializer<Int4>(Int4),
	},
	[OID._int4]: {
		parse: arrayParser<Int4>(Int4, ","),
		serialize: arraySerializer<Int4>(Int4, ","),
	},
	[OID.int4multirange]: {
		parse: parser<Int4MultiRange>(Int4MultiRange),
		serialize: serializer<Int4MultiRange>(Int4MultiRange),
	},
	[OID._int4multirange]: {
		parse: arrayParser<Int4MultiRange>(Int4MultiRange),
		serialize: arraySerializer<Int4MultiRange>(Int4MultiRange),
	},
	[OID.int4range]: {
		parse: parser<Int4Range>(Int4Range),
		serialize: serializer<Int4Range>(Int4Range),
	},
	[OID._int4range]: {
		parse: arrayParser<Int4Range>(Int4Range),
		serialize: arraySerializer<Int4Range>(Int4Range),
	},
	[OID.int8]: {
		parse: parser<Int8>(Int8),
		serialize: serializer<Int8>(Int8),
	},
	[OID._int8]: {
		parse: arrayParser<Int8>(Int8, ","),
		serialize: arraySerializer<Int8>(Int8, ","),
	},
	[OID.int8multirange]: {
		parse: parser<Int8MultiRange>(Int8MultiRange),
		serialize: serializer<Int8MultiRange>(Int8MultiRange),
	},
	[OID._int8multirange]: {
		parse: arrayParser<Int8MultiRange>(Int8MultiRange),
		serialize: arraySerializer<Int8MultiRange>(Int8MultiRange),
	},
	[OID.int8range]: {
		parse: parser<Int8Range>(Int8Range),
		serialize: serializer<Int8Range>(Int8Range),
	},
	[OID._int8range]: {
		parse: arrayParser<Int8Range>(Int8Range),
		serialize: arraySerializer<Int8Range>(Int8Range),
	},
	[OID.oid]: {
		parse: parser<OIDClass>(OIDClass),
		serialize: serializer<OIDClass>(OIDClass),
	},
	[OID._oid]: {
		parse: arrayParser<OIDClass>(OIDClass, ","),
		serialize: arraySerializer<OIDClass>(OIDClass, ","),
	},
	[OID.uuid]: {
		parse: parser<UUID>(UUID),
		serialize: serializer<UUID>(UUID),
	},
	[OID._uuid]: {
		parse: arrayParser<UUID>(UUID, ","),
		serialize: arraySerializer<UUID>(UUID, ","),
	},
};
