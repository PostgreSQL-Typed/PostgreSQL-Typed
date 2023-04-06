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
import pg from "pg";
const { types } = pg;

types.setTypeParser(OID.bit as any, parser<Bit<number>>(Bit));
types.setTypeParser(OID._bit as any, arrayParser<Bit<number>>(Bit, ","));

types.setTypeParser(OID.varbit as any, parser<BitVarying<number>>(BitVarying));
types.setTypeParser(OID._varbit as any, arrayParser<BitVarying<number>>(BitVarying, ","));

types.setTypeParser(OID.bool as any, parser<boolean>(Boolean));
types.setTypeParser(OID._bool as any, arrayParser<boolean>(Boolean, ","));

types.setTypeParser(OID.char as any, parser<Character<number>>(Character));
types.setTypeParser(OID.bpchar as any, parser<Character<number>>(Character));
types.setTypeParser(OID._char as any, arrayParser<Character<number>>(Character, ","));
types.setTypeParser(OID._bpchar as any, arrayParser<Character<number>>(Character, ","));

types.setTypeParser(OID.varchar as any, parser<CharacterVarying<number>>(CharacterVarying));
types.setTypeParser(OID._varchar as any, arrayParser<CharacterVarying<number>>(CharacterVarying, ","));

types.setTypeParser(OID.name as any, parser<Name>(Name));
types.setTypeParser(OID._name as any, arrayParser<Name>(Name, ","));

types.setTypeParser(OID.text as any, parser(Text));
types.setTypeParser(OID._text as any, arrayParser(Text, ","));

types.setTypeParser(OID.date as any, parser(Date));
types.setTypeParser(OID._date as any, arrayParser(Date, ","));

types.setTypeParser(OID.datemultirange as any, parser(DateMultiRange));
types.setTypeParser(OID._datemultirange as any, arrayParser(DateMultiRange));

types.setTypeParser(OID.daterange as any, parser(DateRange));
types.setTypeParser(OID._daterange as any, arrayParser(DateRange));

types.setTypeParser(OID.interval as any, parser(Interval));
types.setTypeParser(OID._interval as any, arrayParser(Interval));

types.setTypeParser(OID.time as any, parser(Time));
types.setTypeParser(OID._time as any, arrayParser(Time, ","));

types.setTypeParser(OID.timestamp as any, parser(Timestamp));
types.setTypeParser(OID._timestamp as any, arrayParser(Timestamp));

types.setTypeParser(OID.tsmultirange as any, parser(TimestampMultiRange));
types.setTypeParser(OID._tsmultirange as any, arrayParser(TimestampMultiRange));

types.setTypeParser(OID.tsrange as any, parser(TimestampRange));
types.setTypeParser(OID._tsrange as any, arrayParser(TimestampRange));

types.setTypeParser(OID.timestamptz as any, parser(TimestampTZ));
types.setTypeParser(OID._timestamptz as any, arrayParser(TimestampTZ));

types.setTypeParser(OID.tstzmultirange as any, parser(TimestampTZMultiRange));
types.setTypeParser(OID._tstzmultirange as any, arrayParser(TimestampTZMultiRange));

types.setTypeParser(OID.tstzrange as any, parser(TimestampTZRange));
types.setTypeParser(OID._tstzrange as any, arrayParser(TimestampTZRange));

types.setTypeParser(OID.timetz as any, parser(TimeTZ));
types.setTypeParser(OID._timetz as any, arrayParser(TimeTZ, ","));

types.setTypeParser(OID.box as any, parser(Box));
types.setTypeParser(OID._box as any, arrayParser(Box, ";"));

types.setTypeParser(OID.circle as any, parser(Circle));
types.setTypeParser(OID._circle as any, arrayParser(Circle));

types.setTypeParser(OID.line as any, parser(Line));
types.setTypeParser(OID._line as any, arrayParser(Line));

types.setTypeParser(OID.lseg as any, parser(LineSegment));
types.setTypeParser(OID._lseg as any, arrayParser(LineSegment));

types.setTypeParser(OID.path as any, parser(Path));
types.setTypeParser(OID._path as any, arrayParser(Path));

types.setTypeParser(OID.point as any, parser(Point));
types.setTypeParser(OID._point as any, arrayParser(Point));

types.setTypeParser(OID.polygon as any, parser(Polygon));
types.setTypeParser(OID._polygon as any, arrayParser(Polygon));

types.setTypeParser(OID.money as any, parser<Money>(Money));
types.setTypeParser(OID._money as any, arrayParser<Money>(Money, ","));

// types.setTypeParser(OID.inet as any, parser(IPAddress));
// types.setTypeParser(OID._inet as any, arrayParser(IPAddress, ","));
// types.setTypeParser(OID.cidr as any, parser(IPAddress));
// types.setTypeParser(OID._cidr as any, arrayParser(IPAddress, ","));

// types.setTypeParser(OID.macaddr as any, parser(MACAddress));
// types.setTypeParser(OID._macaddr as any, arrayParser(MACAddress, ","));

// types.setTypeParser(OID.macaddr8 as any, parser(MACAddress8));
// types.setTypeParser(OID._macaddr8 as any, arrayParser(MACAddress8, ","));

types.setTypeParser(OID.float4 as any, parser<Float4>(Float4));
types.setTypeParser(OID._float4 as any, arrayParser<Float4>(Float4, ","));

types.setTypeParser(OID.float8 as any, parser<Float8>(Float8));
types.setTypeParser(OID._float8 as any, arrayParser<Float8>(Float8, ","));

types.setTypeParser(OID.int2 as any, parser<Int2>(Int2));
types.setTypeParser(OID._int2 as any, arrayParser<Int2>(Int2, ","));

types.setTypeParser(OID.int4 as any, parser<Int4>(Int4));
types.setTypeParser(OID._int4 as any, arrayParser<Int4>(Int4, ","));

types.setTypeParser(OID.int4multirange as any, parser<Int4MultiRange>(Int4MultiRange));
types.setTypeParser(OID._int4multirange as any, arrayParser<Int4MultiRange>(Int4MultiRange));

types.setTypeParser(OID.int4range as any, parser<Int4Range>(Int4Range));
types.setTypeParser(OID._int4range as any, arrayParser<Int4Range>(Int4Range));

types.setTypeParser(OID.int8 as any, parser<Int8>(Int8));
types.setTypeParser(OID._int8 as any, arrayParser<Int8>(Int8, ","));

types.setTypeParser(OID.int8multirange as any, parser<Int8MultiRange>(Int8MultiRange));
types.setTypeParser(OID._int8multirange as any, arrayParser<Int8MultiRange>(Int8MultiRange));

types.setTypeParser(OID.int8range as any, parser<Int8Range>(Int8Range));
types.setTypeParser(OID._int8range as any, arrayParser<Int8Range>(Int8Range));

types.setTypeParser(OID.oid as any, parser<OIDClass>(OIDClass));
types.setTypeParser(OID._oid as any, arrayParser<OIDClass>(OIDClass, ","));

types.setTypeParser(OID.uuid as any, parser<UUID>(UUID));
types.setTypeParser(OID._uuid as any, arrayParser<UUID>(UUID, ","));
