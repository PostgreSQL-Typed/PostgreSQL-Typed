import { OID } from "@postgresql-typed/oids";

import {
	arrayParser,
	arraySerializer,
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
	[OID.bit]: {
		serialize: serializer<Bit<number>>(Bit),
		parse: parser<Bit<number>>(Bit),
	},
	[OID._bit]: {
		serialize: arraySerializer<Bit<number>>(Bit, ","),
		parse: arrayParser<Bit<number>>(Bit, ","),
	},
	[OID.varbit]: {
		serialize: serializer<BitVarying<number>>(BitVarying),
		parse: parser<BitVarying<number>>(BitVarying),
	},
	[OID._varbit]: {
		serialize: arraySerializer<BitVarying<number>>(BitVarying, ","),
		parse: arrayParser<BitVarying<number>>(BitVarying, ","),
	},
	[OID.bool]: {
		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: serializer<Boolean>(Boolean),
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: parser<Boolean>(Boolean),
	},
	[OID._bool]: {
		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: arraySerializer<Boolean>(Boolean, ","),
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: arrayParser<Boolean>(Boolean, ","),
	},
	[OID.char]: {
		serialize: serializer<Character<number>>(Character),
		parse: parser<Character<number>>(Character),
	},
	[OID._char]: {
		serialize: arraySerializer<Character<number>>(Character, ","),
		parse: arrayParser<Character<number>>(Character, ","),
	},
	[OID.bpchar]: {
		serialize: serializer<Character<number>>(Character),
		parse: parser<Character<number>>(Character),
	},
	[OID._bpchar]: {
		serialize: arraySerializer<Character<number>>(Character, ","),
		parse: arrayParser<Character<number>>(Character, ","),
	},
	[OID.varchar]: {
		serialize: serializer<CharacterVarying<number>>(CharacterVarying),
		parse: parser<CharacterVarying<number>>(CharacterVarying),
	},
	[OID._varchar]: {
		serialize: arraySerializer<CharacterVarying<number>>(CharacterVarying, ","),
		parse: arrayParser<CharacterVarying<number>>(CharacterVarying, ","),
	},
	[OID.name]: {
		serialize: serializer<Name>(Name),
		parse: parser<Name>(Name),
	},
	[OID._name]: {
		serialize: arraySerializer<Name>(Name, ","),
		parse: arrayParser<Name>(Name, ","),
	},
	[OID.text]: {
		serialize: serializer<Text>(Text),
		parse: parser<Text>(Text),
	},
	[OID._text]: {
		serialize: arraySerializer<Text>(Text, ","),
		parse: arrayParser<Text>(Text, ","),
	},
	[OID.date]: {
		serialize: serializer<Date>(Date),
		parse: parser<Date>(Date),
	},
	[OID._date]: {
		serialize: arraySerializer<Date>(Date, ","),
		parse: arrayParser<Date>(Date, ","),
	},
	[OID.datemultirange]: {
		serialize: serializer<DateMultiRange>(DateMultiRange),
		parse: parser<DateMultiRange>(DateMultiRange),
	},
	[OID._datemultirange]: {
		serialize: arraySerializer<DateMultiRange>(DateMultiRange),
		parse: arrayParser<DateMultiRange>(DateMultiRange),
	},
	[OID.daterange]: {
		serialize: serializer<DateRange>(DateRange),
		parse: parser<DateRange>(DateRange),
	},
	[OID._daterange]: {
		serialize: arraySerializer<DateRange>(DateRange),
		parse: arrayParser<DateRange>(DateRange),
	},
	[OID.interval]: {
		serialize: serializer<Interval>(Interval),
		parse: parser<Interval>(Interval),
	},
	[OID._interval]: {
		serialize: arraySerializer<Interval>(Interval),
		parse: arrayParser<Interval>(Interval),
	},
	[OID.time]: {
		serialize: serializer<Time>(Time),
		parse: parser<Time>(Time),
	},
	[OID._time]: {
		serialize: arraySerializer<Time>(Time, ","),
		parse: arrayParser<Time>(Time, ","),
	},
	[OID.timestamp]: {
		serialize: serializer<Timestamp>(Timestamp),
		parse: parser<Timestamp>(Timestamp),
	},
	[OID._timestamp]: {
		serialize: arraySerializer<Timestamp>(Timestamp),
		parse: arrayParser<Timestamp>(Timestamp),
	},
	[OID.tsmultirange]: {
		serialize: serializer<TimestampMultiRange>(TimestampMultiRange),
		parse: parser<TimestampMultiRange>(TimestampMultiRange),
	},
	[OID._tsmultirange]: {
		serialize: arraySerializer<TimestampMultiRange>(TimestampMultiRange),
		parse: arrayParser<TimestampMultiRange>(TimestampMultiRange),
	},
	[OID.tsrange]: {
		serialize: serializer<TimestampRange>(TimestampRange),
		parse: parser<TimestampRange>(TimestampRange),
	},
	[OID._tsrange]: {
		serialize: arraySerializer<TimestampRange>(TimestampRange),
		parse: arrayParser<TimestampRange>(TimestampRange),
	},
	[OID.timestamptz]: {
		serialize: serializer<TimestampTZ>(TimestampTZ),
		parse: parser<TimestampTZ>(TimestampTZ),
	},
	[OID._timestamptz]: {
		serialize: arraySerializer<TimestampTZ>(TimestampTZ),
		parse: arrayParser<TimestampTZ>(TimestampTZ),
	},
	[OID.tstzmultirange]: {
		serialize: serializer<TimestampTZMultiRange>(TimestampTZMultiRange),
		parse: parser<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	[OID._tstzmultirange]: {
		serialize: arraySerializer<TimestampTZMultiRange>(TimestampTZMultiRange),
		parse: arrayParser<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	[OID.tstzrange]: {
		serialize: serializer<TimestampTZRange>(TimestampTZRange),
		parse: parser<TimestampTZRange>(TimestampTZRange),
	},
	[OID._tstzrange]: {
		serialize: arraySerializer<TimestampTZRange>(TimestampTZRange),
		parse: arrayParser<TimestampTZRange>(TimestampTZRange),
	},
	[OID.timetz]: {
		serialize: serializer<TimeTZ>(TimeTZ),
		parse: parser<TimeTZ>(TimeTZ),
	},
	[OID._timetz]: {
		serialize: arraySerializer<TimeTZ>(TimeTZ, ","),
		parse: arrayParser<TimeTZ>(TimeTZ, ","),
	},
	[OID.box]: {
		serialize: serializer<Box>(Box),
		parse: parser<Box>(Box),
	},
	[OID._box]: {
		serialize: arraySerializer<Box>(Box, ";"),
		parse: arrayParser<Box>(Box, ";"),
	},
	[OID.circle]: {
		serialize: serializer<Circle>(Circle),
		parse: parser<Circle>(Circle),
	},
	[OID._circle]: {
		serialize: arraySerializer<Circle>(Circle),
		parse: arrayParser<Circle>(Circle),
	},
	[OID.line]: {
		serialize: serializer<Line>(Line),
		parse: parser<Line>(Line),
	},
	[OID._line]: {
		serialize: arraySerializer<Line>(Line),
		parse: arrayParser<Line>(Line),
	},
	[OID.lseg]: {
		serialize: serializer<LineSegment>(LineSegment),
		parse: parser<LineSegment>(LineSegment),
	},
	[OID._lseg]: {
		serialize: arraySerializer<LineSegment>(LineSegment),
		parse: arrayParser<LineSegment>(LineSegment),
	},
	[OID.path]: {
		serialize: serializer<Path>(Path),
		parse: parser<Path>(Path),
	},
	[OID._path]: {
		serialize: arraySerializer<Path>(Path),
		parse: arrayParser<Path>(Path),
	},
	[OID.point]: {
		serialize: serializer<Point>(Point),
		parse: parser<Point>(Point),
	},
	[OID._point]: {
		serialize: arraySerializer<Point>(Point),
		parse: arrayParser<Point>(Point),
	},
	[OID.polygon]: {
		serialize: serializer<Polygon>(Polygon),
		parse: parser<Polygon>(Polygon),
	},
	[OID._polygon]: {
		serialize: arraySerializer<Polygon>(Polygon),
		parse: arrayParser<Polygon>(Polygon),
	},
	[OID.json]: {
		serialize: serializer<JSON>(JSON),
		parse: parser<JSON>(JSON),
	},
	[OID._json]: {
		serialize: arraySerializer<JSON>(JSON),
		parse: arrayParser<JSON>(JSON, ","),
	},
	[OID.jsonb]: {
		serialize: serializer<JSON>(JSON),
		parse: parser<JSON>(JSON),
	},
	[OID._jsonb]: {
		serialize: arraySerializer<JSON>(JSON),
		parse: arrayParser<JSON>(JSON, ","),
	},
	[OID.money]: {
		serialize: serializer<Money>(Money),
		parse: parser<Money>(Money),
	},
	[OID._money]: {
		serialize: arraySerializer<Money>(Money, ","),
		parse: arrayParser<Money>(Money, ","),
	},
	[OID.float4]: {
		serialize: serializer<Float4>(Float4),
		parse: parser<Float4>(Float4),
	},
	[OID._float4]: {
		serialize: arraySerializer<Float4>(Float4, ","),
		parse: arrayParser<Float4>(Float4, ","),
	},
	[OID.float8]: {
		serialize: serializer<Float8>(Float8),
		parse: parser<Float8>(Float8),
	},
	[OID._float8]: {
		serialize: arraySerializer<Float8>(Float8, ","),
		parse: arrayParser<Float8>(Float8, ","),
	},
	[OID.int2]: {
		serialize: serializer<Int2>(Int2),
		parse: parser<Int2>(Int2),
	},
	[OID._int2]: {
		serialize: arraySerializer<Int2>(Int2, ","),
		parse: arrayParser<Int2>(Int2, ","),
	},
	[OID.int4]: {
		serialize: serializer<Int4>(Int4),
		parse: parser<Int4>(Int4),
	},
	[OID._int4]: {
		serialize: arraySerializer<Int4>(Int4, ","),
		parse: arrayParser<Int4>(Int4, ","),
	},
	[OID.int4multirange]: {
		serialize: serializer<Int4MultiRange>(Int4MultiRange),
		parse: parser<Int4MultiRange>(Int4MultiRange),
	},
	[OID._int4multirange]: {
		serialize: arraySerializer<Int4MultiRange>(Int4MultiRange),
		parse: arrayParser<Int4MultiRange>(Int4MultiRange),
	},
	[OID.int4range]: {
		serialize: serializer<Int4Range>(Int4Range),
		parse: parser<Int4Range>(Int4Range),
	},
	[OID._int4range]: {
		serialize: arraySerializer<Int4Range>(Int4Range),
		parse: arrayParser<Int4Range>(Int4Range),
	},
	[OID.int8]: {
		serialize: serializer<Int8>(Int8),
		parse: parser<Int8>(Int8),
	},
	[OID._int8]: {
		serialize: arraySerializer<Int8>(Int8, ","),
		parse: arrayParser<Int8>(Int8, ","),
	},
	[OID.int8multirange]: {
		serialize: serializer<Int8MultiRange>(Int8MultiRange),
		parse: parser<Int8MultiRange>(Int8MultiRange),
	},
	[OID._int8multirange]: {
		serialize: arraySerializer<Int8MultiRange>(Int8MultiRange),
		parse: arrayParser<Int8MultiRange>(Int8MultiRange),
	},
	[OID.int8range]: {
		serialize: serializer<Int8Range>(Int8Range),
		parse: parser<Int8Range>(Int8Range),
	},
	[OID._int8range]: {
		serialize: arraySerializer<Int8Range>(Int8Range),
		parse: arrayParser<Int8Range>(Int8Range),
	},
	[OID.oid]: {
		serialize: serializer<OIDClass>(OIDClass),
		parse: parser<OIDClass>(OIDClass),
	},
	[OID._oid]: {
		serialize: arraySerializer<OIDClass>(OIDClass, ","),
		parse: arrayParser<OIDClass>(OIDClass, ","),
	},
	[OID.uuid]: {
		serialize: serializer<UUID>(UUID),
		parse: parser<UUID>(UUID),
	},
	[OID._uuid]: {
		serialize: arraySerializer<UUID>(UUID, ","),
		parse: arrayParser<UUID>(UUID, ","),
	},
};
