/* eslint-disable unicorn/no-null */
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
	Line,
	LineSegment,
	Money,
	Name,
	OID as OIDClass,
	parser,
	Path,
	Point,
	Polygon,
	serializer,
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
import type postgres from "postgres";

export const types: Record<string, postgres.PostgresType<any>> = {
	bit: {
		to: OID.bit,
		from: [OID.bit],
		serialize: serializer<Bit<number>>(Bit),
		parse: parser<Bit<number>>(Bit),
	},
	_bit: {
		to: OID._bit,
		from: [OID._bit],
		serialize: arraySerializer<Bit<number>>(Bit, ","),
		parse: arrayParser<Bit<number>>(Bit, ","),
	},
	varbit: {
		to: OID.varbit,
		from: [OID.varbit],
		serialize: serializer<BitVarying<number>>(BitVarying),
		parse: parser<BitVarying<number>>(BitVarying),
	},
	_varbit: {
		to: OID._varbit,
		from: [OID._varbit],
		serialize: arraySerializer<BitVarying<number>>(BitVarying, ","),
		parse: arrayParser<BitVarying<number>>(BitVarying, ","),
	},
	bool: {
		to: OID.bool,
		from: [OID.bool],
		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: serializer<Boolean>(Boolean),
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: parser<Boolean>(Boolean),
	},
	_bool: {
		to: OID._bool,
		from: [OID._bool],
		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: arraySerializer<Boolean>(Boolean, ","),
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: arrayParser<Boolean>(Boolean, ","),
	},
	char: {
		to: OID.char,
		from: [OID.char],
		serialize: serializer<Character<number>>(Character),
		parse: parser<Character<number>>(Character),
	},
	_char: {
		to: OID._char,
		from: [OID._char],
		serialize: arraySerializer<Character<number>>(Character, ","),
		parse: arrayParser<Character<number>>(Character, ","),
	},
	bpchar: {
		to: OID.bpchar,
		from: [OID.bpchar],
		serialize: serializer<Character<number>>(Character),
		parse: parser<Character<number>>(Character),
	},
	_bpchar: {
		to: OID._bpchar,
		from: [OID._bpchar],
		serialize: arraySerializer<Character<number>>(Character, ","),
		parse: arrayParser<Character<number>>(Character, ","),
	},
	varchar: {
		to: OID.varchar,
		from: [OID.varchar],
		serialize: serializer<CharacterVarying<number>>(CharacterVarying),
		parse: parser<CharacterVarying<number>>(CharacterVarying),
	},
	_varchar: {
		to: OID._varchar,
		from: [OID._varchar],
		serialize: arraySerializer<CharacterVarying<number>>(CharacterVarying, ","),
		parse: arrayParser<CharacterVarying<number>>(CharacterVarying, ","),
	},
	namee: {
		to: OID.name,
		from: [OID.name],
		serialize: serializer<Name>(Name),
		parse: parser<Name>(Name),
	},
	_namee: {
		to: OID._name,
		from: [OID._name],
		serialize: arraySerializer<Name>(Name, ","),
		parse: arrayParser<Name>(Name, ","),
	},
	text: {
		to: OID.text,
		from: [OID.text],
		serialize: serializer<Text>(Text),
		parse: parser<Text>(Text),
	},
	_text: {
		to: OID._text,
		from: [OID._text],
		serialize: arraySerializer<Text>(Text, ","),
		parse: arrayParser<Text>(Text, ","),
	},
	date: {
		to: OID.date,
		from: [OID.date],
		serialize: serializer<Date>(Date),
		parse: parser<Date>(Date),
	},
	_date: {
		to: OID._date,
		from: [OID._date],
		serialize: arraySerializer<Date>(Date, ","),
		parse: arrayParser<Date>(Date, ","),
	},
	datemultirange: {
		to: OID.datemultirange,
		from: [OID.datemultirange],
		serialize: serializer<DateMultiRange>(DateMultiRange),
		parse: parser<DateMultiRange>(DateMultiRange),
	},
	_datemultirange: {
		to: OID._datemultirange,
		from: [OID._datemultirange],
		serialize: arraySerializer<DateMultiRange>(DateMultiRange),
		parse: arrayParser<DateMultiRange>(DateMultiRange),
	},
	daterange: {
		to: OID.daterange,
		from: [OID.daterange],
		serialize: serializer<DateRange>(DateRange),
		parse: parser<DateRange>(DateRange),
	},
	_daterange: {
		to: OID._daterange,
		from: [OID._daterange],
		serialize: arraySerializer<DateRange>(DateRange),
		parse: arrayParser<DateRange>(DateRange),
	},
	interval: {
		to: OID.interval,
		from: [OID.interval],
		serialize: serializer<Interval>(Interval),
		parse: parser<Interval>(Interval),
	},
	_interval: {
		to: OID._interval,
		from: [OID._interval],
		serialize: arraySerializer<Interval>(Interval),
		parse: arrayParser<Interval>(Interval),
	},
	time: {
		to: OID.time,
		from: [OID.time],
		serialize: serializer<Time>(Time),
		parse: parser<Time>(Time),
	},
	_time: {
		to: OID._time,
		from: [OID._time],
		serialize: arraySerializer<Time>(Time, ","),
		parse: arrayParser<Time>(Time, ","),
	},
	timestamp: {
		to: OID.timestamp,
		from: [OID.timestamp],
		serialize: serializer<Timestamp>(Timestamp),
		parse: parser<Timestamp>(Timestamp),
	},
	_timestamp: {
		to: OID._timestamp,
		from: [OID._timestamp],
		serialize: arraySerializer<Timestamp>(Timestamp),
		parse: arrayParser<Timestamp>(Timestamp),
	},
	tsmultirange: {
		to: OID.tsmultirange,
		from: [OID.tsmultirange],
		serialize: serializer<TimestampMultiRange>(TimestampMultiRange),
		parse: parser<TimestampMultiRange>(TimestampMultiRange),
	},
	_tsmultirange: {
		to: OID._tsmultirange,
		from: [OID._tsmultirange],
		serialize: arraySerializer<TimestampMultiRange>(TimestampMultiRange),
		parse: arrayParser<TimestampMultiRange>(TimestampMultiRange),
	},
	tsrange: {
		to: OID.tsrange,
		from: [OID.tsrange],
		serialize: serializer<TimestampRange>(TimestampRange),
		parse: parser<TimestampRange>(TimestampRange),
	},
	_tsrange: {
		to: OID._tsrange,
		from: [OID._tsrange],
		serialize: arraySerializer<TimestampRange>(TimestampRange),
		parse: arrayParser<TimestampRange>(TimestampRange),
	},
	timestamptz: {
		to: OID.timestamptz,
		from: [OID.timestamptz],
		serialize: serializer<TimestampTZ>(TimestampTZ),
		parse: parser<TimestampTZ>(TimestampTZ),
	},
	_timestamptz: {
		to: OID._timestamptz,
		from: [OID._timestamptz],
		serialize: arraySerializer<TimestampTZ>(TimestampTZ),
		parse: arrayParser<TimestampTZ>(TimestampTZ),
	},
	tstzmultirange: {
		to: OID.tstzmultirange,
		from: [OID.tstzmultirange],
		serialize: serializer<TimestampTZMultiRange>(TimestampTZMultiRange),
		parse: parser<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	_tstzmultirange: {
		to: OID._tstzmultirange,
		from: [OID._tstzmultirange],
		serialize: arraySerializer<TimestampTZMultiRange>(TimestampTZMultiRange),
		parse: arrayParser<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	tstzrange: {
		to: OID.tstzrange,
		from: [OID.tstzrange],
		serialize: serializer<TimestampTZRange>(TimestampTZRange),
		parse: parser<TimestampTZRange>(TimestampTZRange),
	},
	_tstzrange: {
		to: OID._tstzrange,
		from: [OID._tstzrange],
		serialize: arraySerializer<TimestampTZRange>(TimestampTZRange),
		parse: arrayParser<TimestampTZRange>(TimestampTZRange),
	},
	timetz: {
		to: OID.timetz,
		from: [OID.timetz],
		serialize: serializer<TimeTZ>(TimeTZ),
		parse: parser<TimeTZ>(TimeTZ),
	},
	_timetz: {
		to: OID._timetz,
		from: [OID._timetz],
		serialize: arraySerializer<TimeTZ>(TimeTZ, ","),
		parse: arrayParser<TimeTZ>(TimeTZ, ","),
	},
	box: {
		to: OID.box,
		from: [OID.box],
		serialize: serializer<Box>(Box),
		parse: parser<Box>(Box),
	},
	_box: {
		to: OID._box,
		from: [OID._box],
		serialize: arraySerializer<Box>(Box, ";"),
		parse: arrayParser<Box>(Box, ";"),
	},
	circle: {
		to: OID.circle,
		from: [OID.circle],
		serialize: serializer<Circle>(Circle),
		parse: parser<Circle>(Circle),
	},
	_circle: {
		to: OID._circle,
		from: [OID._circle],
		serialize: arraySerializer<Circle>(Circle),
		parse: arrayParser<Circle>(Circle),
	},
	line: {
		to: OID.line,
		from: [OID.line],
		serialize: serializer<Line>(Line),
		parse: parser<Line>(Line),
	},
	_line: {
		to: OID._line,
		from: [OID._line],
		serialize: arraySerializer<Line>(Line),
		parse: arrayParser<Line>(Line),
	},
	lseg: {
		to: OID.lseg,
		from: [OID.lseg],
		serialize: serializer<LineSegment>(LineSegment),
		parse: parser<LineSegment>(LineSegment),
	},
	_lseg: {
		to: OID._lseg,
		from: [OID._lseg],
		serialize: arraySerializer<LineSegment>(LineSegment),
		parse: arrayParser<LineSegment>(LineSegment),
	},
	path: {
		to: OID.path,
		from: [OID.path],
		serialize: serializer<Path>(Path),
		parse: parser<Path>(Path),
	},
	_path: {
		to: OID._path,
		from: [OID._path],
		serialize: arraySerializer<Path>(Path),
		parse: arrayParser<Path>(Path),
	},
	point: {
		to: OID.point,
		from: [OID.point],
		serialize: serializer<Point>(Point),
		parse: parser<Point>(Point),
	},
	_point: {
		to: OID._point,
		from: [OID._point],
		serialize: arraySerializer<Point>(Point),
		parse: arrayParser<Point>(Point),
	},
	polygon: {
		to: OID.polygon,
		from: [OID.polygon],
		serialize: serializer<Polygon>(Polygon),
		parse: parser<Polygon>(Polygon),
	},
	_polygon: {
		to: OID._polygon,
		from: [OID._polygon],
		serialize: arraySerializer<Polygon>(Polygon),
		parse: arrayParser<Polygon>(Polygon),
	},
	money: {
		to: OID.money,
		from: [OID.money],
		serialize: serializer<Money>(Money),
		parse: parser<Money>(Money),
	},
	_money: {
		to: OID._money,
		from: [OID._money],
		serialize: arraySerializer<Money>(Money, ","),
		parse: arrayParser<Money>(Money, ","),
	},
	float4: {
		to: OID.float4,
		from: [OID.float4],
		serialize: serializer<Float4>(Float4),
		parse: parser<Float4>(Float4),
	},
	_float4: {
		to: OID._float4,
		from: [OID._float4],
		serialize: arraySerializer<Float4>(Float4, ","),
		parse: arrayParser<Float4>(Float4, ","),
	},
	float8: {
		to: OID.float8,
		from: [OID.float8],
		serialize: serializer<Float8>(Float8),
		parse: parser<Float8>(Float8),
	},
	_float8: {
		to: OID._float8,
		from: [OID._float8],
		serialize: arraySerializer<Float8>(Float8, ","),
		parse: arrayParser<Float8>(Float8, ","),
	},
	int2: {
		to: OID.int2,
		from: [OID.int2],
		serialize: serializer<Int2>(Int2),
		parse: parser<Int2>(Int2),
	},
	_int2: {
		to: OID._int2,
		from: [OID._int2],
		serialize: arraySerializer<Int2>(Int2, ","),
		parse: arrayParser<Int2>(Int2, ","),
	},
	int4: {
		to: OID.int4,
		from: [OID.int4],
		serialize: serializer<Int4>(Int4),
		parse: parser<Int4>(Int4),
	},
	_int4: {
		to: OID._int4,
		from: [OID._int4],
		serialize: arraySerializer<Int4>(Int4, ","),
		parse: arrayParser<Int4>(Int4, ","),
	},
	int4multirange: {
		to: OID.int4multirange,
		from: [OID.int4multirange],
		serialize: serializer<Int4MultiRange>(Int4MultiRange),
		parse: parser<Int4MultiRange>(Int4MultiRange),
	},
	_int4multirange: {
		to: OID._int4multirange,
		from: [OID._int4multirange],
		serialize: arraySerializer<Int4MultiRange>(Int4MultiRange),
		parse: arrayParser<Int4MultiRange>(Int4MultiRange),
	},
	int4range: {
		to: OID.int4range,
		from: [OID.int4range],
		serialize: serializer<Int4Range>(Int4Range),
		parse: parser<Int4Range>(Int4Range),
	},
	_int4range: {
		to: OID._int4range,
		from: [OID._int4range],
		serialize: arraySerializer<Int4Range>(Int4Range),
		parse: arrayParser<Int4Range>(Int4Range),
	},
	int8: {
		to: OID.int8,
		from: [OID.int8],
		serialize: serializer<Int8>(Int8),
		parse: parser<Int8>(Int8),
	},
	_int8: {
		to: OID._int8,
		from: [OID._int8],
		serialize: arraySerializer<Int8>(Int8, ","),
		parse: arrayParser<Int8>(Int8, ","),
	},
	int8multirange: {
		to: OID.int8multirange,
		from: [OID.int8multirange],
		serialize: serializer<Int8MultiRange>(Int8MultiRange),
		parse: parser<Int8MultiRange>(Int8MultiRange),
	},
	_int8multirange: {
		to: OID._int8multirange,
		from: [OID._int8multirange],
		serialize: arraySerializer<Int8MultiRange>(Int8MultiRange),
		parse: arrayParser<Int8MultiRange>(Int8MultiRange),
	},
	int8range: {
		to: OID.int8range,
		from: [OID.int8range],
		serialize: serializer<Int8Range>(Int8Range),
		parse: parser<Int8Range>(Int8Range),
	},
	_int8range: {
		to: OID._int8range,
		from: [OID._int8range],
		serialize: arraySerializer<Int8Range>(Int8Range),
		parse: arrayParser<Int8Range>(Int8Range),
	},
	oid: {
		to: OID.oid,
		from: [OID.oid],
		serialize: serializer<OIDClass>(OIDClass),
		parse: parser<OIDClass>(OIDClass),
	},
	_oid: {
		to: OID._oid,
		from: [OID._oid],
		serialize: arraySerializer<OIDClass>(OIDClass, ","),
		parse: arrayParser<OIDClass>(OIDClass, ","),
	},
	uuid: {
		to: OID.uuid,
		from: [OID.uuid],
		serialize: serializer<UUID>(UUID),
		parse: parser<UUID>(UUID),
	},
	_uuid: {
		to: OID._uuid,
		from: [OID._uuid],
		serialize: arraySerializer<UUID>(UUID, ","),
		parse: arrayParser<UUID>(UUID, ","),
	},
};
