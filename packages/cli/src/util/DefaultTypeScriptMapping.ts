import { OID } from "@postgresql-typed/oids";
import type { ImportStatement } from "@postgresql-typed/util";

export const DefaultTypeScriptMapping = {
	get(oid: OID, maxLength?: number): string | [string, ImportStatement[]] | undefined {
		const lengthString = maxLength === undefined ? "" : `<${maxLength}>`,
			TypeScriptMapping: {
				[key in OID]: string | [string, ImportStatement[]];
			} = {
				[OID._abstime]: "unknown[]",
				[OID._aclitem]: "unknown[]",
				[OID._bit]: [
					`Bit${lengthString}[]`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Bit",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bool]: [
					"Boolean[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Boolean",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._box]: [
					"Box[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Box",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bpchar]: [
					`Character${lengthString}[]`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bytea]: "Buffer[]",
				[OID._char]: [
					`Character${lengthString}[]`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._cid]: "string[]",
				[OID._cidr]: [
					"IPAddress[]",
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
					"Circle[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Circle",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._cstring]: "string[]",
				[OID._date]: [
					"Date[]",
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
					"DateMultiRange[]",
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
					"DateRange[]",
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
					"Float4[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float4",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._float8]: [
					"Float8[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._gtsvector]: "unknown[]",
				[OID._inet]: [
					"IPAddress[]",
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
					"Int2[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int2",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int2vector]: "unknown[]",
				[OID._int4]: [
					"Int4[]",
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
					"Int4MultiRange[]",
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
					"Int4Range[]",
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
					"Int8[]",
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
					"Int8MultiRange[]",
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
					"Int8Range[]",
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
					"Interval[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Interval",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._json]: "unknown[]",
				[OID._jsonb]: "unknown[]",
				[OID._jsonpath]: "unknown[]",
				[OID._line]: [
					"Line[]",
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
					"LineSegment[]",
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
					"MACAddress[]",
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
					"MACAddress8[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress8",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._money]: [
					"Money[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Money",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._name]: [
					"Name[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Name",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._numeric]: "number[]",
				[OID._nummultirange]: "unknown[]",
				[OID._numrange]: "unknown[]",
				[OID._oid]: [
					"OID[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "OID",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._oidvector]: "unknown[]",
				[OID._path]: [
					"Path[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Path",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._pg_lsn]: "unknown[]",
				[OID._pg_snapshot]: "unknown[]",
				[OID._point]: [
					"Point[]",
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
					"Polygon[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Polygon",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._record]: "unknown[]",
				[OID._refcursor]: "unknown[]",
				[OID._regclass]: "unknown[]",
				[OID._regcollation]: "unknown[]",
				[OID._regconfig]: "unknown[]",
				[OID._regdictionary]: "unknown[]",
				[OID._regnamespace]: "unknown[]",
				[OID._regoper]: "unknown[]",
				[OID._regoperator]: "unknown[]",
				[OID._regproc]: "unknown[]",
				[OID._regprocedure]: "unknown[]",
				[OID._regrole]: "unknown[]",
				[OID._regtype]: "unknown[]",
				[OID._reltime]: "unknown[]",
				[OID._text]: [
					"Text[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Text",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tid]: "unknown[]",
				[OID._time]: [
					"Time[]",
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
					"Timestamp[]",
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
					"TimestampTZ[]",
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
					"TimeTZ[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZ",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tinterval]: "unknown[]",
				[OID._tsquery]: "unknown[]",
				[OID._tsmultirange]: [
					"TimestampMultiRange[]",
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
					"TimestampRange[]",
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
					"TimestampTZMultiRange[]",
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
					"TimestampTZRange[]",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tsvector]: "unknown[]",
				[OID._txid_snapshot]: "unknown[]",
				[OID._uuid]: [
					"UUID[]",
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
					`BitVarying${lengthString}[]`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "BitVarying",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._varchar]: [
					`CharacterVarying${lengthString}[]`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterVarying",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._xid]: "unknown[]",
				[OID._xid8]: "unknown[]",
				[OID._xml]: "unknown[]",
				[OID.abstime]: "unknown",
				[OID.aclitem]: "unknown",
				[OID.any]: "unknown",
				[OID.anyarray]: "unknown",
				[OID.anycompatible]: "unknown",
				[OID.anycompatiblearray]: "unknown",
				[OID.anycompatiblemultirange]: "unknown",
				[OID.anycompatiblenonarray]: "unknown",
				[OID.anycompatiblerange]: "unknown",
				[OID.anyelement]: "unknown",
				[OID.anyenum]: "unknown",
				[OID.anymultirange]: "unknown",
				[OID.anynonarray]: "unknown",
				[OID.anyrange]: "unknown",
				[OID.bit]: [
					`Bit${lengthString}`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Bit",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bool]: [
					"Boolean",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Boolean",
							type: "named",
							isType: true,
						},
					],
				],
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
				[OID.bpchar]: [
					`Character${lengthString}`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bytea]: "Buffer",
				[OID.cardinal_number]: "unknown",
				[OID.char]: [
					`Character${lengthString}`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.character_data]: "unknown",
				[OID.cid]: "string",
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
				[OID.cstring]: "string",
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
				[OID.event_trigger]: "unknown",
				[OID.fdw_handler]: "unknown",
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
				[OID.gtsvector]: "unknown",
				[OID.index_am_handler]: "unknown",
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
				[OID.int2vector]: "unknown",
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
				[OID.internal]: "unknown",
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
				[OID.json]: "unknown",
				[OID.jsonb]: "unknown",
				[OID.jsonpath]: "unknown",
				[OID.language_handler]: "unknown",
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
				[OID.money]: [
					"Money",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Money",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.name]: [
					"Name",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Name",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.numeric]: "number",
				[OID.nummultirange]: "unknown",
				[OID.numrange]: "unknown",
				[OID.oid]: [
					"OID",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "OID",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.oidvector]: "unknown",
				[OID.opaque]: "unknown",
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
				[OID.pg_brin_bloom_summary]: "unknown",
				[OID.pg_brin_minmax_multi_summary]: "unknown",
				[OID.pg_ddl_command]: "unknown",
				[OID.pg_dependencies]: "unknown",
				[OID.pg_lsn]: "unknown",
				[OID.pg_mcv_list]: "unknown",
				[OID.pg_ndistinct]: "unknown",
				[OID.pg_node_tree]: "unknown",
				[OID.pg_snapshot]: "unknown",
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
				[OID.record]: "unknown",
				[OID.refcursor]: "unknown",
				[OID.regcollation]: "unknown",
				[OID.regclass]: "unknown",
				[OID.regconfig]: "unknown",
				[OID.regdictionary]: "unknown",
				[OID.regnamespace]: "unknown",
				[OID.regoper]: "unknown",
				[OID.regoperator]: "unknown",
				[OID.regproc]: "unknown",
				[OID.regprocedure]: "unknown",
				[OID.regrole]: "unknown",
				[OID.regtype]: "unknown",
				[OID.reltime]: "unknown",
				[OID.smgr]: "unknown",
				[OID.table_am_handler]: "unknown",
				[OID.text]: [
					"Text",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Text",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tid]: "unknown",
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
				[OID.tinterval]: "unknown",
				[OID.trigger]: "unknown",
				[OID.tsm_handler]: "unknown",
				[OID.tsmultirange]: [
					"TimestampMultiRange",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampMultiRange",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tsquery]: "unknown",
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
				[OID.tsvector]: "unknown",
				[OID.txid_snapshot]: "unknown",
				[OID.unknown]: "unknown",
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
					`BitVarying${lengthString}`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "BitVarying",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.varchar]: [
					`CharacterVarying${lengthString}`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterVarying",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.void]: "unknown",
				[OID.xid]: "unknown",
				[OID.xid8]: "unknown",
				[OID.xml]: "unknown",
			};

		return TypeScriptMapping[oid];
	},
};
