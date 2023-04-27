/* eslint-disable unicorn/no-null */
import { OID } from "@postgresql-typed/oids";
import {
	arrayParser,
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
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Bit<number>>(Bit)(value)?.postgres ?? null,
		parse: parser<Bit<number>>(Bit),
	},
	_bit: {
		to: OID._bit,
		from: [OID._bit],
		serialize: (value: string | null) => value,
		parse: arrayParser<Bit<number>>(Bit, ","),
	},
	varbit: {
		to: OID.varbit,
		from: [OID.varbit],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<BitVarying<number>>(BitVarying)(value)?.postgres ?? null,
		parse: parser<BitVarying<number>>(BitVarying),
	},
	_varbit: {
		to: OID._varbit,
		from: [OID._varbit],
		serialize: (value: string | null) => value,
		parse: arrayParser<BitVarying<number>>(BitVarying, ","),
	},
	bool: {
		to: OID.bool,
		from: [OID.bool],
		/* c8 ignore next 2 */
		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: (value: string | null) => parser<Boolean>(Boolean)(value)?.postgres ?? null,
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: parser<Boolean>(Boolean),
	},
	_bool: {
		to: OID._bool,
		from: [OID._bool],
		// eslint-disable-next-line @typescript-eslint/ban-types
		serialize: (value: string | null) => value,
		// eslint-disable-next-line @typescript-eslint/ban-types
		parse: arrayParser<Boolean>(Boolean, ","),
	},
	char: {
		to: OID.char,
		from: [OID.char],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Character<number>>(Character)(value)?.postgres ?? null,
		parse: parser<Character<number>>(Character),
	},
	_char: {
		to: OID._char,
		from: [OID._char],
		serialize: (value: string | null) => value,
		parse: arrayParser<Character<number>>(Character, ","),
	},
	bpchar: {
		to: OID.bpchar,
		from: [OID.bpchar],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Character<number>>(Character)(value)?.postgres ?? null,
		parse: parser<Character<number>>(Character),
	},
	_bpchar: {
		to: OID._bpchar,
		from: [OID._bpchar],
		serialize: (value: string | null) => value,
		parse: arrayParser<Character<number>>(Character, ","),
	},
	varchar: {
		to: OID.varchar,
		from: [OID.varchar],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<CharacterVarying<number>>(CharacterVarying)(value)?.postgres ?? null,
		parse: parser<CharacterVarying<number>>(CharacterVarying),
	},
	_varchar: {
		to: OID._varchar,
		from: [OID._varchar],
		serialize: (value: string | null) => value,
		parse: arrayParser<CharacterVarying<number>>(CharacterVarying, ","),
	},
	namee: {
		to: OID.name,
		from: [OID.name],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Name>(Name)(value)?.postgres ?? null,
		parse: parser<Name>(Name),
	},
	_namee: {
		to: OID._name,
		from: [OID._name],
		serialize: (value: string | null) => value,
		parse: arrayParser<Name>(Name, ","),
	},
	text: {
		to: OID.text,
		from: [OID.text],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Text>(Text)(value)?.postgres ?? null,
		parse: parser<Text>(Text),
	},
	_text: {
		to: OID._text,
		from: [OID._text],
		serialize: (value: string | null) => value,
		parse: arrayParser<Text>(Text, ","),
	},
	date: {
		to: OID.date,
		from: [OID.date],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Date>(Date)(value)?.postgres ?? null,
		parse: parser<Date>(Date),
	},
	_date: {
		to: OID._date,
		from: [OID._date],
		serialize: (value: string | null) => value,
		parse: arrayParser<Date>(Date, ","),
	},
	datemultirange: {
		to: OID.datemultirange,
		from: [OID.datemultirange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<DateMultiRange>(DateMultiRange)(value)?.postgres ?? null,
		parse: parser<DateMultiRange>(DateMultiRange),
	},
	_datemultirange: {
		to: OID._datemultirange,
		from: [OID._datemultirange],
		serialize: (value: string | null) => value,
		parse: arrayParser<DateMultiRange>(DateMultiRange),
	},
	daterange: {
		to: OID.daterange,
		from: [OID.daterange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<DateRange>(DateRange)(value)?.postgres ?? null,
		parse: parser<DateRange>(DateRange),
	},
	_daterange: {
		to: OID._daterange,
		from: [OID._daterange],
		serialize: (value: string | null) => value,
		parse: arrayParser<DateRange>(DateRange),
	},
	interval: {
		to: OID.interval,
		from: [OID.interval],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Interval>(Interval)(value)?.postgres ?? null,
		parse: parser<Interval>(Interval),
	},
	_interval: {
		to: OID._interval,
		from: [OID._interval],
		serialize: (value: string | null) => value,
		parse: arrayParser<Interval>(Interval),
	},
	time: {
		to: OID.time,
		from: [OID.time],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Time>(Time)(value)?.postgres ?? null,
		parse: parser<Time>(Time),
	},
	_time: {
		to: OID._time,
		from: [OID._time],
		serialize: (value: string | null) => value,
		parse: arrayParser<Time>(Time, ","),
	},
	timestamp: {
		to: OID.timestamp,
		from: [OID.timestamp],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Timestamp>(Timestamp)(value)?.postgres ?? null,
		parse: parser<Timestamp>(Timestamp),
	},
	_timestamp: {
		to: OID._timestamp,
		from: [OID._timestamp],
		serialize: (value: string | null) => value,
		parse: arrayParser<Timestamp>(Timestamp),
	},
	tsmultirange: {
		to: OID.tsmultirange,
		from: [OID.tsmultirange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<TimestampMultiRange>(TimestampMultiRange)(value)?.postgres ?? null,
		parse: parser<TimestampMultiRange>(TimestampMultiRange),
	},
	_tsmultirange: {
		to: OID._tsmultirange,
		from: [OID._tsmultirange],
		serialize: (value: string | null) => value,
		parse: arrayParser<TimestampMultiRange>(TimestampMultiRange),
	},
	tsrange: {
		to: OID.tsrange,
		from: [OID.tsrange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<TimestampRange>(TimestampRange)(value)?.postgres ?? null,
		parse: parser<TimestampRange>(TimestampRange),
	},
	_tsrange: {
		to: OID._tsrange,
		from: [OID._tsrange],
		serialize: (value: string | null) => value,
		parse: arrayParser<TimestampRange>(TimestampRange),
	},
	timestamptz: {
		to: OID.timestamptz,
		from: [OID.timestamptz],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<TimestampTZ>(TimestampTZ)(value)?.postgres ?? null,
		parse: parser<TimestampTZ>(TimestampTZ),
	},
	_timestamptz: {
		to: OID._timestamptz,
		from: [OID._timestamptz],
		serialize: (value: string | null) => value,
		parse: arrayParser<TimestampTZ>(TimestampTZ),
	},
	tstzmultirange: {
		to: OID.tstzmultirange,
		from: [OID.tstzmultirange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<TimestampTZMultiRange>(TimestampTZMultiRange)(value)?.postgres ?? null,
		parse: parser<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	_tstzmultirange: {
		to: OID._tstzmultirange,
		from: [OID._tstzmultirange],
		serialize: (value: string | null) => value,
		parse: arrayParser<TimestampTZMultiRange>(TimestampTZMultiRange),
	},
	tstzrange: {
		to: OID.tstzrange,
		from: [OID.tstzrange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<TimestampTZRange>(TimestampTZRange)(value)?.postgres ?? null,
		parse: parser<TimestampTZRange>(TimestampTZRange),
	},
	_tstzrange: {
		to: OID._tstzrange,
		from: [OID._tstzrange],
		serialize: (value: string | null) => value,
		parse: arrayParser<TimestampTZRange>(TimestampTZRange),
	},
	timetz: {
		to: OID.timetz,
		from: [OID.timetz],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<TimeTZ>(TimeTZ)(value)?.postgres ?? null,
		parse: parser<TimeTZ>(TimeTZ),
	},
	_timetz: {
		to: OID._timetz,
		from: [OID._timetz],
		serialize: (value: string | null) => value,
		parse: arrayParser<TimeTZ>(TimeTZ, ","),
	},
	box: {
		to: OID.box,
		from: [OID.box],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Box>(Box)(value)?.postgres ?? null,
		parse: parser<Box>(Box),
	},
	_box: {
		to: OID._box,
		from: [OID._box],
		serialize: (value: string | null) => value,
		parse: arrayParser<Box>(Box, ";"),
	},
	circle: {
		to: OID.circle,
		from: [OID.circle],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Circle>(Circle)(value)?.postgres ?? null,
		parse: parser<Circle>(Circle),
	},
	_circle: {
		to: OID._circle,
		from: [OID._circle],
		serialize: (value: string | null) => value,
		parse: arrayParser<Circle>(Circle),
	},
	line: {
		to: OID.line,
		from: [OID.line],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Line>(Line)(value)?.postgres ?? null,
		parse: parser<Line>(Line),
	},
	_line: {
		to: OID._line,
		from: [OID._line],
		serialize: (value: string | null) => value,
		parse: arrayParser<Line>(Line),
	},
	lseg: {
		to: OID.lseg,
		from: [OID.lseg],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<LineSegment>(LineSegment)(value)?.postgres ?? null,
		parse: parser<LineSegment>(LineSegment),
	},
	_lseg: {
		to: OID._lseg,
		from: [OID._lseg],
		serialize: (value: string | null) => value,
		parse: arrayParser<LineSegment>(LineSegment),
	},
	path: {
		to: OID.path,
		from: [OID.path],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Path>(Path)(value)?.postgres ?? null,
		parse: parser<Path>(Path),
	},
	_path: {
		to: OID._path,
		from: [OID._path],
		serialize: (value: string | null) => value,
		parse: arrayParser<Path>(Path),
	},
	point: {
		to: OID.point,
		from: [OID.point],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Point>(Point)(value)?.postgres ?? null,
		parse: parser<Point>(Point),
	},
	_point: {
		to: OID._point,
		from: [OID._point],
		serialize: (value: string | null) => value,
		parse: arrayParser<Point>(Point),
	},
	polygon: {
		to: OID.polygon,
		from: [OID.polygon],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Polygon>(Polygon)(value)?.postgres ?? null,
		parse: parser<Polygon>(Polygon),
	},
	_polygon: {
		to: OID._polygon,
		from: [OID._polygon],
		serialize: (value: string | null) => value,
		parse: arrayParser<Polygon>(Polygon),
	},
	money: {
		to: OID.money,
		from: [OID.money],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Money>(Money)(value)?.postgres ?? null,
		parse: parser<Money>(Money),
	},
	_money: {
		to: OID._money,
		from: [OID._money],
		serialize: (value: string | null) => value,
		parse: arrayParser<Money>(Money, ","),
	},
	float4: {
		to: OID.float4,
		from: [OID.float4],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Float4>(Float4)(value)?.postgres ?? null,

		parse: parser<Float4>(Float4),
	},
	_float4: {
		to: OID._float4,
		from: [OID._float4],
		serialize: (value: string | null) => value,
		parse: arrayParser<Float4>(Float4, ","),
	},
	float8: {
		to: OID.float8,
		from: [OID.float8],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Float8>(Float8)(value)?.postgres ?? null,
		parse: parser<Float8>(Float8),
	},
	_float8: {
		to: OID._float8,
		from: [OID._float8],
		serialize: (value: string | null) => value,
		parse: arrayParser<Float8>(Float8, ","),
	},
	int2: {
		to: OID.int2,
		from: [OID.int2],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int2>(Int2)(value)?.postgres ?? null,
		parse: parser<Int2>(Int2),
	},
	_int2: {
		to: OID._int2,
		from: [OID._int2],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int2>(Int2, ","),
	},
	int4: {
		to: OID.int4,
		from: [OID.int4],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int4>(Int4)(value)?.postgres ?? null,
		parse: parser<Int4>(Int4),
	},
	_int4: {
		to: OID._int4,
		from: [OID._int4],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int4>(Int4, ","),
	},
	int4multirange: {
		to: OID.int4multirange,
		from: [OID.int4multirange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int4MultiRange>(Int4MultiRange)(value)?.postgres ?? null,
		parse: parser<Int4MultiRange>(Int4MultiRange),
	},
	_int4multirange: {
		to: OID._int4multirange,
		from: [OID._int4multirange],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int4MultiRange>(Int4MultiRange),
	},
	int4range: {
		to: OID.int4range,
		from: [OID.int4range],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int4Range>(Int4Range)(value)?.postgres ?? null,
		parse: parser<Int4Range>(Int4Range),
	},
	_int4range: {
		to: OID._int4range,
		from: [OID._int4range],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int4Range>(Int4Range),
	},
	int8: {
		to: OID.int8,
		from: [OID.int8],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int8>(Int8)(value)?.postgres ?? null,
		parse: parser<Int8>(Int8),
	},
	_int8: {
		to: OID._int8,
		from: [OID._int8],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int8>(Int8, ","),
	},
	int8multirange: {
		to: OID.int8multirange,
		from: [OID.int8multirange],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int8MultiRange>(Int8MultiRange)(value)?.postgres ?? null,
		parse: parser<Int8MultiRange>(Int8MultiRange),
	},
	_int8multirange: {
		to: OID._int8multirange,
		from: [OID._int8multirange],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int8MultiRange>(Int8MultiRange),
	},
	int8range: {
		to: OID.int8range,
		from: [OID.int8range],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<Int8Range>(Int8Range)(value)?.postgres ?? null,
		parse: parser<Int8Range>(Int8Range),
	},
	_int8range: {
		to: OID._int8range,
		from: [OID._int8range],
		serialize: (value: string | null) => value,
		parse: arrayParser<Int8Range>(Int8Range),
	},
	oid: {
		to: OID.oid,
		from: [OID.oid],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<OIDClass>(OIDClass)(value)?.postgres ?? null,
		parse: parser<OIDClass>(OIDClass),
	},
	_oid: {
		to: OID._oid,
		from: [OID._oid],
		serialize: (value: string | null) => value,
		parse: arrayParser<OIDClass>(OIDClass, ","),
	},
	uuid: {
		to: OID.uuid,
		from: [OID.uuid],
		/* c8 ignore next 1 */
		serialize: (value: string | null) => parser<UUID>(UUID)(value)?.postgres ?? null,
		parse: parser<UUID>(UUID),
	},
	_uuid: {
		to: OID._uuid,
		from: [OID._uuid],
		serialize: (value: string | null) => value,
		parse: arrayParser<UUID>(UUID, ","),
	},
};
