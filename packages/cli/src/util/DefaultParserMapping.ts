import { OID } from "@postgresql-typed/oids";

import type { ImportStatement } from "../types/interfaces/ImportStatement.js";

export const DefaultParserMapping = {
	get(oid: OID, maxLength?: number): string | [string, ImportStatement[]] | undefined {
		const lengthString = maxLength ? `<${maxLength}>` : "",
			ParserMapping: {
				[key in OID]: string | [string, ImportStatement[]];
			} = {
				[OID._abstime]: "'unknown', true",
				[OID._aclitem]: "'unknown', true",
				[OID._bit]: [
					`Bit.setN(${lengthString}), true`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Bit",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bool]: "'unknown', true",
				[OID._box]: [
					"Box, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Box",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bpchar]: "'unknown', true",
				[OID._bytea]: "'unknown', true",
				[OID._char]: "'unknown', true",
				[OID._cid]: "'unknown', true",
				[OID._cidr]: [
					"IPAddress, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._circle]: [
					"Circle, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Circle",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._cstring]: "'unknown', true",
				[OID._date]: [
					"Date, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Date",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._datemultirange]: [
					"DateMultiRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateMultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._daterange]: [
					"DateRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._float4]: [
					"Float4, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float4",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._float8]: "'unknown', true",
				[OID._gtsvector]: "'unknown', true",
				[OID._inet]: [
					"IPAddress, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int2]: [
					"Int2, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int2",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int2vector]: "'unknown', true",
				[OID._int4]: [
					"Int4, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int4multirange]: [
					"Int4MultiRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4MultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int4range]: [
					"Int4Range, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4Range",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int8]: [
					"Int8, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int8multirange]: [
					"Int8MultiRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8MultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int8range]: [
					"Int8Range, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8Range",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._interval]: [
					"Interval, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Interval",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._json]: "'unknown', true",
				[OID._jsonb]: "'unknown', true",
				[OID._jsonpath]: "'unknown', true",
				[OID._line]: [
					"Line, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Line",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._lseg]: [
					"LineSegment, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "LineSegment",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._macaddr]: [
					"MACAddress, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._macaddr8]: [
					"MACAddress8, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._money]: "'unknown', true",
				[OID._name]: "'unknown', true",
				[OID._numeric]: "'unknown', true",
				[OID._nummultirange]: "'unknown', true",
				[OID._numrange]: "'unknown', true",
				[OID._oid]: "'unknown', true",
				[OID._oidvector]: "'unknown', true",
				[OID._path]: [
					"Path, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Path",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._pg_lsn]: "'unknown', true",
				[OID._pg_snapshot]: "'unknown', true",
				[OID._point]: [
					"Point, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Point",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._polygon]: [
					"Polygon, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Polygon",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._record]: "'unknown', true",
				[OID._refcursor]: "'unknown', true",
				[OID._regclass]: "'unknown', true",
				[OID._regcollation]: "'unknown', true",
				[OID._regconfig]: "'unknown', true",
				[OID._regdictionary]: "'unknown', true",
				[OID._regnamespace]: "'unknown', true",
				[OID._regoper]: "'unknown', true",
				[OID._regoperator]: "'unknown', true",
				[OID._regproc]: "'unknown', true",
				[OID._regprocedure]: "'unknown', true",
				[OID._regrole]: "'unknown', true",
				[OID._regtype]: "'unknown', true",
				[OID._reltime]: "'unknown', true",
				[OID._text]: "'unknown', true",
				[OID._tid]: "'unknown', true",
				[OID._time]: [
					"Time, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Time",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._timestamp]: [
					"Timestamp, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Timestamp",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._timestamptz]: [
					"TimestampTZ, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZ",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._timetz]: [
					"TimeTZ, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZ",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tinterval]: "'unknown', true",
				[OID._tsquery]: "'unknown', true",
				[OID._tsmultirange]: [
					"TimestampMultiRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampMultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tsrange]: [
					"TimestampRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tstzmultirange]: [
					"TimestampTZMultiRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZMultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tstzrange]: [
					"TimestampTZRange, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tsvector]: "'unknown', true",
				[OID._txid_snapshot]: "'unknown', true",
				[OID._uuid]: [
					"UUID, true",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "UUID",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._varbit]: [
					`BitVarying.setN(${lengthString}), true`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "BitVarying",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._varchar]: "'unknown', true",
				[OID._xid]: "'unknown', true",
				[OID._xid8]: "'unknown', true",
				[OID._xml]: "'unknown', true",
				[OID.abstime]: "'unknown'",
				[OID.aclitem]: "'unknown'",
				[OID.any]: "'unknown'",
				[OID.anyarray]: "'unknown'",
				[OID.anycompatible]: "'unknown'",
				[OID.anycompatiblearray]: "'unknown'",
				[OID.anycompatiblemultirange]: "'unknown'",
				[OID.anycompatiblenonarray]: "'unknown'",
				[OID.anycompatiblerange]: "'unknown'",
				[OID.anyelement]: "'unknown'",
				[OID.anyenum]: "'unknown'",
				[OID.anymultirange]: "'unknown'",
				[OID.anynonarray]: "'unknown'",
				[OID.anyrange]: "'unknown'",
				[OID.bit]: [
					`Bit.setN(${lengthString})`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Bit",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bool]: "'unknown'",
				[OID.box]: [
					"Box",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Box",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bpchar]: "'unknown'",
				[OID.bytea]: "'unknown'",
				[OID.cardinal_number]: "'unknown'",
				[OID.char]: "'unknown'",
				[OID.character_data]: "'unknown'",
				[OID.cid]: "'unknown'",
				[OID.cidr]: [
					"CIDR",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "CIDR",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.circle]: [
					"Circle",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Circle",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.cstring]: "'unknown'",
				[OID.date]: [
					"Date",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Date",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.datemultirange]: [
					"DateMultiRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateMultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.daterange]: [
					"DateRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.event_trigger]: "'unknown'",
				[OID.fdw_handler]: "'unknown'",
				[OID.float4]: [
					"Float4",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float4",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.float8]: [
					"Float8",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.gtsvector]: "'unknown'",
				[OID.index_am_handler]: "'unknown'",
				[OID.inet]: [
					"IPAddress",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int2]: [
					"Int2",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int2",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int2vector]: "'unknown'",
				[OID.int4]: [
					"Int4",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int4multirange]: [
					"Int4MultiRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4MultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int4range]: [
					"Int4Range",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4Range",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int8]: [
					"Int8",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int8multirange]: [
					"Int8MultiRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8MultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int8range]: [
					"Int8Range",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8Range",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.internal]: "'unknown'",
				[OID.interval]: [
					"Interval",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Interval",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.json]: "'unknown'",
				[OID.jsonb]: "'unknown'",
				[OID.jsonpath]: "'unknown'",
				[OID.language_handler]: "'unknown'",
				[OID.line]: [
					"Line",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Line",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.lseg]: [
					"LineSegment",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "LineSegment",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.macaddr]: [
					"MACAddress",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.macaddr8]: [
					"MACAddress8",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.money]: "'unknown'",
				[OID.name]: "'unknown'",
				[OID.numeric]: "'unknown'",
				[OID.nummultirange]: "'unknown'",
				[OID.numrange]: "'unknown'",
				[OID.oid]: "'unknown'",
				[OID.oidvector]: "'unknown'",
				[OID.opaque]: "'unknown'",
				[OID.path]: [
					"Path",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Path",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.pg_brin_bloom_summary]: "'unknown'",
				[OID.pg_brin_minmax_multi_summary]: "'unknown'",
				[OID.pg_ddl_command]: "'unknown'",
				[OID.pg_dependencies]: "'unknown'",
				[OID.pg_lsn]: "'unknown'",
				[OID.pg_mcv_list]: "'unknown'",
				[OID.pg_ndistinct]: "'unknown'",
				[OID.pg_node_tree]: "'unknown'",
				[OID.pg_snapshot]: "'unknown'",
				[OID.point]: [
					"Point",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Point",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.polygon]: [
					"Polygon",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Polygon",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.record]: "'unknown'",
				[OID.refcursor]: "'unknown'",
				[OID.regcollation]: "'unknown'",
				[OID.regclass]: "'unknown'",
				[OID.regconfig]: "'unknown'",
				[OID.regdictionary]: "'unknown'",
				[OID.regnamespace]: "'unknown'",
				[OID.regoper]: "'unknown'",
				[OID.regoperator]: "'unknown'",
				[OID.regproc]: "'unknown'",
				[OID.regprocedure]: "'unknown'",
				[OID.regrole]: "'unknown'",
				[OID.regtype]: "'unknown'",
				[OID.reltime]: "'unknown'",
				[OID.smgr]: "'unknown'",
				[OID.table_am_handler]: "'unknown'",
				[OID.text]: "'unknown'",
				[OID.tid]: "'unknown'",
				[OID.time]: [
					"Time",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Time",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.timestamp]: [
					"Timestamp",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Timestamp",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.timestamptz]: [
					"TimestampTZ",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZ",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.timetz]: [
					"TimeTZ",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZ",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tinterval]: "'unknown'",
				[OID.trigger]: "'unknown'",
				[OID.tsm_handler]: "'unknown'",
				[OID.tsmultirange]: "'unknown'",
				[OID.tsquery]: "'unknown'",
				[OID.tsrange]: [
					"TimestampRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tstzmultirange]: [
					"TimestampTZMultiRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZMultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tstzrange]: [
					"TimestampTZRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tsvector]: "'unknown'",
				[OID.txid_snapshot]: "'unknown'",
				[OID.unknown]: "'unknown'",
				[OID.uuid]: [
					"UUID",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "UUID",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.varbit]: [
					`BitVarying.setN(${lengthString})`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "BitVarying",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.varchar]: "'unknown'",
				[OID.void]: "'unknown'",
				[OID.xid]: "'unknown'",
				[OID.xid8]: "'unknown'",
				[OID.xml]: "'unknown'",
			};

		return ParserMapping[oid];
	},
};
