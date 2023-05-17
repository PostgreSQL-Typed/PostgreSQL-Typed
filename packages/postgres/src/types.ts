/* eslint-disable unicorn/no-null */
import { OID } from "@postgresql-typed/oids";
import { defaultParserMappings } from "@postgresql-typed/parsers";
import type postgres from "postgres";

export const types: Record<string, postgres.PostgresType<any>> = {
	bit: {
		to: OID.bit,
		from: [OID.bit],
		...defaultParserMappings[OID.bit],
	},
	_bit: {
		to: OID._bit,
		from: [OID._bit],
		...defaultParserMappings[OID._bit],
	},
	varbit: {
		to: OID.varbit,
		from: [OID.varbit],
		...defaultParserMappings[OID.varbit],
	},
	_varbit: {
		to: OID._varbit,
		from: [OID._varbit],
		...defaultParserMappings[OID._varbit],
	},
	bool: {
		to: OID.bool,
		from: [OID.bool],
		...defaultParserMappings[OID.bool],
	},
	_bool: {
		to: OID._bool,
		from: [OID._bool],
		...defaultParserMappings[OID._bool],
	},
	char: {
		to: OID.char,
		from: [OID.char],
		...defaultParserMappings[OID.char],
	},
	_char: {
		to: OID._char,
		from: [OID._char],
		...defaultParserMappings[OID._char],
	},
	bpchar: {
		to: OID.bpchar,
		from: [OID.bpchar],
		...defaultParserMappings[OID.bpchar],
	},
	_bpchar: {
		to: OID._bpchar,
		from: [OID._bpchar],
		...defaultParserMappings[OID._bpchar],
	},
	varchar: {
		to: OID.varchar,
		from: [OID.varchar],
		...defaultParserMappings[OID.varchar],
	},
	_varchar: {
		to: OID._varchar,
		from: [OID._varchar],
		...defaultParserMappings[OID._varchar],
	},
	namee: {
		to: OID.name,
		from: [OID.name],
		...defaultParserMappings[OID.name],
	},
	_namee: {
		to: OID._name,
		from: [OID._name],
		...defaultParserMappings[OID._name],
	},
	text: {
		to: OID.text,
		from: [OID.text],
		...defaultParserMappings[OID.text],
	},
	_text: {
		to: OID._text,
		from: [OID._text],
		...defaultParserMappings[OID._text],
	},
	date: {
		to: OID.date,
		from: [OID.date],
		...defaultParserMappings[OID.date],
	},
	_date: {
		to: OID._date,
		from: [OID._date],
		...defaultParserMappings[OID._date],
	},
	datemultirange: {
		to: OID.datemultirange,
		from: [OID.datemultirange],
		...defaultParserMappings[OID.datemultirange],
	},
	_datemultirange: {
		to: OID._datemultirange,
		from: [OID._datemultirange],
		...defaultParserMappings[OID._datemultirange],
	},
	daterange: {
		to: OID.daterange,
		from: [OID.daterange],
		...defaultParserMappings[OID.daterange],
	},
	_daterange: {
		to: OID._daterange,
		from: [OID._daterange],
		...defaultParserMappings[OID._daterange],
	},
	interval: {
		to: OID.interval,
		from: [OID.interval],
		...defaultParserMappings[OID.interval],
	},
	_interval: {
		to: OID._interval,
		from: [OID._interval],
		...defaultParserMappings[OID._interval],
	},
	time: {
		to: OID.time,
		from: [OID.time],
		...defaultParserMappings[OID.time],
	},
	_time: {
		to: OID._time,
		from: [OID._time],
		...defaultParserMappings[OID._time],
	},
	timestamp: {
		to: OID.timestamp,
		from: [OID.timestamp],
		...defaultParserMappings[OID.timestamp],
	},
	_timestamp: {
		to: OID._timestamp,
		from: [OID._timestamp],
		...defaultParserMappings[OID._timestamp],
	},
	tsmultirange: {
		to: OID.tsmultirange,
		from: [OID.tsmultirange],
		...defaultParserMappings[OID.tsmultirange],
	},
	_tsmultirange: {
		to: OID._tsmultirange,
		from: [OID._tsmultirange],
		...defaultParserMappings[OID._tsmultirange],
	},
	tsrange: {
		to: OID.tsrange,
		from: [OID.tsrange],
		...defaultParserMappings[OID.tsrange],
	},
	_tsrange: {
		to: OID._tsrange,
		from: [OID._tsrange],
		...defaultParserMappings[OID._tsrange],
	},
	timestamptz: {
		to: OID.timestamptz,
		from: [OID.timestamptz],
		...defaultParserMappings[OID.timestamptz],
	},
	_timestamptz: {
		to: OID._timestamptz,
		from: [OID._timestamptz],
		...defaultParserMappings[OID._timestamptz],
	},
	tstzmultirange: {
		to: OID.tstzmultirange,
		from: [OID.tstzmultirange],
		...defaultParserMappings[OID.tstzmultirange],
	},
	_tstzmultirange: {
		to: OID._tstzmultirange,
		from: [OID._tstzmultirange],
		...defaultParserMappings[OID._tstzmultirange],
	},
	tstzrange: {
		to: OID.tstzrange,
		from: [OID.tstzrange],
		...defaultParserMappings[OID.tstzrange],
	},
	_tstzrange: {
		to: OID._tstzrange,
		from: [OID._tstzrange],
		...defaultParserMappings[OID._tstzrange],
	},
	timetz: {
		to: OID.timetz,
		from: [OID.timetz],
		...defaultParserMappings[OID.timetz],
	},
	_timetz: {
		to: OID._timetz,
		from: [OID._timetz],
		...defaultParserMappings[OID._timetz],
	},
	box: {
		to: OID.box,
		from: [OID.box],
		...defaultParserMappings[OID.box],
	},
	_box: {
		to: OID._box,
		from: [OID._box],
		...defaultParserMappings[OID._box],
	},
	circle: {
		to: OID.circle,
		from: [OID.circle],
		...defaultParserMappings[OID.circle],
	},
	_circle: {
		to: OID._circle,
		from: [OID._circle],
		...defaultParserMappings[OID._circle],
	},
	line: {
		to: OID.line,
		from: [OID.line],
		...defaultParserMappings[OID.line],
	},
	_line: {
		to: OID._line,
		from: [OID._line],
		...defaultParserMappings[OID._line],
	},
	lseg: {
		to: OID.lseg,
		from: [OID.lseg],
		...defaultParserMappings[OID.lseg],
	},
	_lseg: {
		to: OID._lseg,
		from: [OID._lseg],
		...defaultParserMappings[OID._lseg],
	},
	path: {
		to: OID.path,
		from: [OID.path],
		...defaultParserMappings[OID.path],
	},
	_path: {
		to: OID._path,
		from: [OID._path],
		...defaultParserMappings[OID._path],
	},
	point: {
		to: OID.point,
		from: [OID.point],
		...defaultParserMappings[OID.point],
	},
	_point: {
		to: OID._point,
		from: [OID._point],
		...defaultParserMappings[OID._point],
	},
	polygon: {
		to: OID.polygon,
		from: [OID.polygon],
		...defaultParserMappings[OID.polygon],
	},
	_polygon: {
		to: OID._polygon,
		from: [OID._polygon],
		...defaultParserMappings[OID._polygon],
	},
	money: {
		to: OID.money,
		from: [OID.money],
		...defaultParserMappings[OID.money],
	},
	_money: {
		to: OID._money,
		from: [OID._money],
		...defaultParserMappings[OID._money],
	},
	float4: {
		to: OID.float4,
		from: [OID.float4],
		...defaultParserMappings[OID.float4],
	},
	_float4: {
		to: OID._float4,
		from: [OID._float4],
		...defaultParserMappings[OID._float4],
	},
	float8: {
		to: OID.float8,
		from: [OID.float8],
		...defaultParserMappings[OID.float8],
	},
	_float8: {
		to: OID._float8,
		from: [OID._float8],
		...defaultParserMappings[OID._float8],
	},
	int2: {
		to: OID.int2,
		from: [OID.int2],
		...defaultParserMappings[OID.int2],
	},
	_int2: {
		to: OID._int2,
		from: [OID._int2],
		...defaultParserMappings[OID._int2],
	},
	int4: {
		to: OID.int4,
		from: [OID.int4],
		...defaultParserMappings[OID.int4],
	},
	_int4: {
		to: OID._int4,
		from: [OID._int4],
		...defaultParserMappings[OID._int4],
	},
	int4multirange: {
		to: OID.int4multirange,
		from: [OID.int4multirange],
		...defaultParserMappings[OID.int4multirange],
	},
	_int4multirange: {
		to: OID._int4multirange,
		from: [OID._int4multirange],
		...defaultParserMappings[OID._int4multirange],
	},
	int4range: {
		to: OID.int4range,
		from: [OID.int4range],
		...defaultParserMappings[OID.int4range],
	},
	_int4range: {
		to: OID._int4range,
		from: [OID._int4range],
		...defaultParserMappings[OID._int4range],
	},
	int8: {
		to: OID.int8,
		from: [OID.int8],
		...defaultParserMappings[OID.int8],
	},
	_int8: {
		to: OID._int8,
		from: [OID._int8],
		...defaultParserMappings[OID._int8],
	},
	int8multirange: {
		to: OID.int8multirange,
		from: [OID.int8multirange],
		...defaultParserMappings[OID.int8multirange],
	},
	_int8multirange: {
		to: OID._int8multirange,
		from: [OID._int8multirange],
		...defaultParserMappings[OID._int8multirange],
	},
	int8range: {
		to: OID.int8range,
		from: [OID.int8range],
		...defaultParserMappings[OID.int8range],
	},
	_int8range: {
		to: OID._int8range,
		from: [OID._int8range],
		...defaultParserMappings[OID._int8range],
	},
	oid: {
		to: OID.oid,
		from: [OID.oid],
		...defaultParserMappings[OID.oid],
	},
	_oid: {
		to: OID._oid,
		from: [OID._oid],
		...defaultParserMappings[OID._oid],
	},
	uuid: {
		to: OID.uuid,
		from: [OID.uuid],
		...defaultParserMappings[OID.uuid],
	},
	_uuid: {
		to: OID._uuid,
		from: [OID._uuid],
		...defaultParserMappings[OID._uuid],
	},
};
