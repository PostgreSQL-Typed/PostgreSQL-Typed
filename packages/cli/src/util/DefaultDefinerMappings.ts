import { OID } from "@postgresql-typed/oids";
import type { ImportStatement } from "@postgresql-typed/util";

export const DefaultDefinerMappings = {
	get(
		oid: OID,
		options: {
			maxLength?: number;
			notNull?: boolean;
		} = {}
	): string | [string, ImportStatement[]] | undefined {
		const { maxLength, notNull } = options,
			lengthString = maxLength === undefined ? "" : `length: ${maxLength},`,
			notNullString = notNull ? ".notNull()" : "",
			ParserMapping: {
				[key in OID]: string | [string, ImportStatement[]];
			} = {
				[OID._abstime]: "undefined",
				[OID._aclitem]: "undefined",
				[OID._bit]: [
					`defineBit("%ATTRIBUTE%", { ${lengthString} }).array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBit",
							type: "named",
						},
					],
				],
				[OID._bool]: [
					`defineBoolean("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBoolean",
							type: "named",
						},
					],
				],
				[OID._box]: [
					`defineBox("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBox",
							type: "named",
						},
					],
				],
				[OID._bpchar]: [
					`defineCharacter("%ATTRIBUTE%", { ${lengthString} }).array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCharacter",
							type: "named",
						},
					],
				],
				[OID._bytea]: "undefined",
				[OID._char]: [
					`defineCharacter("%ATTRIBUTE%", { ${lengthString} }).array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCharacter",
							type: "named",
						},
					],
				],
				[OID._cid]: "undefined",
				[OID._cidr]: "undefined",
				[OID._circle]: [
					`defineCircle("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCircle",
							type: "named",
						},
					],
				],
				[OID._cstring]: "undefined",
				[OID._date]: [
					`defineDate("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineDate",
							type: "named",
						},
					],
				],
				[OID._datemultirange]: [
					`defineDateMultiRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineDateMultiRange",
							type: "named",
						},
					],
				],
				[OID._daterange]: [
					`defineDateRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineDateRange",
							type: "named",
						},
					],
				],
				[OID._float4]: [
					`defineFloat4("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineFloat4",
							type: "named",
						},
					],
				],
				[OID._float8]: [
					`defineFloat8("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineFloat8",
							type: "named",
						},
					],
				],
				[OID._gtsvector]: "undefined",
				[OID._inet]: "undefined",
				[OID._int2]: [
					`defineInt2("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt2",
							type: "named",
						},
					],
				],
				[OID._int2vector]: "undefined",
				[OID._int4]: [
					`defineInt4("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt4",
							type: "named",
						},
					],
				],
				[OID._int4multirange]: [
					`defineInt4MultiRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt4MultiRange",
							type: "named",
						},
					],
				],
				[OID._int4range]: [
					`defineInt4Range("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt4Range",
							type: "named",
						},
					],
				],
				[OID._int8]: [
					`defineInt8("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt8",
							type: "named",
						},
					],
				],
				[OID._int8multirange]: [
					`defineInt8MultiRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt8MultiRange",
							type: "named",
						},
					],
				],
				[OID._int8range]: [
					`defineInt8Range("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt8Range",
							type: "named",
						},
					],
				],
				[OID._interval]: [
					`defineInterval("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInterval",
							type: "named",
						},
					],
				],
				[OID._json]: [
					`defineJSON("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineJSON",
							type: "named",
						},
					],
				],
				[OID._jsonb]: [
					`defineJSONB("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineJSONB",
							type: "named",
						},
					],
				],
				[OID._jsonpath]: "undefined",
				[OID._line]: [
					`defineLine("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineLine",
							type: "named",
						},
					],
				],
				[OID._lseg]: [
					`defineLineSegment("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineLineSegment",
							type: "named",
						},
					],
				],
				[OID._macaddr]: "undefined",
				[OID._macaddr8]: "undefined",
				[OID._money]: [
					`defineMoney("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineMoney",
							type: "named",
						},
					],
				],
				[OID._name]: [
					`defineName("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineName",
							type: "named",
						},
					],
				],
				[OID._numeric]: "undefined",
				[OID._nummultirange]: "undefined",
				[OID._numrange]: "undefined",
				[OID._oid]: [
					`defineOID("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineOID",
							type: "named",
						},
					],
				],
				[OID._oidvector]: "undefined",
				[OID._path]: [
					`definePath("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "definePath",
							type: "named",
						},
					],
				],
				[OID._pg_lsn]: "undefined",
				[OID._pg_snapshot]: "undefined",
				[OID._point]: [
					`definePoint("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "definePoint",
							type: "named",
						},
					],
				],
				[OID._polygon]: [
					`definePolygon("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "definePolygon",
							type: "named",
						},
					],
				],
				[OID._record]: "undefined",
				[OID._refcursor]: "undefined",
				[OID._regclass]: "undefined",
				[OID._regcollation]: "undefined",
				[OID._regconfig]: "undefined",
				[OID._regdictionary]: "undefined",
				[OID._regnamespace]: "undefined",
				[OID._regoper]: "undefined",
				[OID._regoperator]: "undefined",
				[OID._regproc]: "undefined",
				[OID._regprocedure]: "undefined",
				[OID._regrole]: "undefined",
				[OID._regtype]: "undefined",
				[OID._reltime]: "undefined",
				[OID._text]: [
					`defineText("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineText",
							type: "named",
						},
					],
				],
				[OID._tid]: "undefined",
				[OID._time]: [
					`defineTime("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTime",
							type: "named",
						},
					],
				],
				[OID._timestamp]: [
					`defineTimestamp("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestamp",
							type: "named",
						},
					],
				],
				[OID._timestamptz]: [
					`defineTimestampTZ("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampTZ",
							type: "named",
						},
					],
				],
				[OID._timetz]: [
					`defineTimeTZ("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimeTZ",
							type: "named",
						},
					],
				],
				[OID._tinterval]: "undefined",
				[OID._tsquery]: "undefined",
				[OID._tsmultirange]: [
					`defineTimestampMultiRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampMultiRange",
							type: "named",
						},
					],
				],
				[OID._tsrange]: [
					`defineTimestampRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampRange",
							type: "named",
						},
					],
				],
				[OID._tstzmultirange]: [
					`defineTimestampTZMultiRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampTZMultiRange",
							type: "named",
						},
					],
				],
				[OID._tstzrange]: [
					`defineTimestampTZRange("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampTZRange",
							type: "named",
						},
					],
				],
				[OID._tsvector]: "undefined",
				[OID._txid_snapshot]: "undefined",
				[OID._uuid]: [
					`defineUUID("%ATTRIBUTE%").array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineUUID",
							type: "named",
						},
					],
				],
				[OID._varbit]: [
					`defineBitVarying("%ATTRIBUTE%", { ${lengthString} }).array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBitVarying",
							type: "named",
						},
					],
				],
				[OID._varchar]: [
					`defineCharacterVarying("%ATTRIBUTE%", { ${lengthString} }).array()${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCharacterVarying",
							type: "named",
						},
					],
				],
				[OID._xid]: "undefined",
				[OID._xid8]: "undefined",
				[OID._xml]: "undefined",
				[OID.abstime]: "undefined",
				[OID.aclitem]: "undefined",
				[OID.any]: "undefined",
				[OID.anyarray]: "undefined",
				[OID.anycompatible]: "undefined",
				[OID.anycompatiblearray]: "undefined",
				[OID.anycompatiblemultirange]: "undefined",
				[OID.anycompatiblenonarray]: "undefined",
				[OID.anycompatiblerange]: "undefined",
				[OID.anyelement]: "undefined",
				[OID.anyenum]: "undefined",
				[OID.anymultirange]: "undefined",
				[OID.anynonarray]: "undefined",
				[OID.anyrange]: "undefined",
				[OID.bit]: [
					`defineBit("%ATTRIBUTE%", { ${lengthString} })${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBit",
							type: "named",
						},
					],
				],
				[OID.bool]: [
					`defineBoolean("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBoolean",
							type: "named",
						},
					],
				],
				[OID.box]: [
					`defineBox("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBox",
							type: "named",
						},
					],
				],
				[OID.bpchar]: [
					`defineCharacter("%ATTRIBUTE%", { ${lengthString} })${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCharacter",
							type: "named",
						},
					],
				],
				[OID.bytea]: "undefined",
				[OID.cardinal_number]: "undefined",
				[OID.char]: [
					`defineCharacter("%ATTRIBUTE%", { ${lengthString} })${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCharacter",
							type: "named",
						},
					],
				],
				[OID.character_data]: "undefined",
				[OID.cid]: "undefined",
				[OID.cidr]: "undefined",
				[OID.circle]: [
					`defineCircle("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCircle",
							type: "named",
						},
					],
				],
				[OID.cstring]: "undefined",
				[OID.date]: [
					`defineDate("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineDate",
							type: "named",
						},
					],
				],
				[OID.datemultirange]: [
					`defineDateMultiRange("%ATTRIBUTE%").array("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineDateMultiRange",
							type: "named",
						},
					],
				],
				[OID.daterange]: [
					`defineDateRange("%ATTRIBUTE%").array("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineDateRange",
							type: "named",
						},
					],
				],
				[OID.event_trigger]: "undefined",
				[OID.fdw_handler]: "undefined",
				[OID.float4]: [
					`defineFloat4("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineFloat4",
							type: "named",
						},
					],
				],
				[OID.float8]: [
					`defineFloat8("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineFloat8",
							type: "named",
						},
					],
				],
				[OID.gtsvector]: "undefined",
				[OID.index_am_handler]: "undefined",
				[OID.inet]: "undefined",
				[OID.int2]: [
					`defineInt2("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt2",
							type: "named",
						},
					],
				],
				[OID.int2vector]: "undefined",
				[OID.int4]: [
					`defineInt4("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt4",
							type: "named",
						},
					],
				],
				[OID.int4multirange]: [
					`defineInt4MultiRange("%ATTRIBUTE%").array("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt4MultiRange",
							type: "named",
						},
					],
				],
				[OID.int4range]: [
					`defineInt4Range("%ATTRIBUTE%").array("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt4Range",
							type: "named",
						},
					],
				],
				[OID.int8]: [
					`defineInt8("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt8",
							type: "named",
						},
					],
				],
				[OID.int8multirange]: [
					`defineInt8MultiRange("%ATTRIBUTE%").array("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt8MultiRange",
							type: "named",
						},
					],
				],
				[OID.int8range]: [
					`defineInt8Range("%ATTRIBUTE%").array("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInt8Range",
							type: "named",
						},
					],
				],
				[OID.internal]: "undefined",
				[OID.interval]: [
					`defineInterval("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineInterval",
							type: "named",
						},
					],
				],
				[OID.json]: [
					`defineJSON("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineJSON",
							type: "named",
						},
					],
				],
				[OID.jsonb]: [
					`defineJSONB("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineJSONB",
							type: "named",
						},
					],
				],
				[OID.jsonpath]: "undefined",
				[OID.language_handler]: "undefined",
				[OID.line]: [
					`defineLine("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineLine",
							type: "named",
						},
					],
				],
				[OID.lseg]: [
					`defineLineSegment("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineLineSegment",
							type: "named",
						},
					],
				],
				[OID.macaddr]: "undefined",
				[OID.macaddr8]: "undefined",
				[OID.money]: [
					`defineMoney("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineMoney",
							type: "named",
						},
					],
				],
				[OID.name]: [
					`defineName("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineName",
							type: "named",
						},
					],
				],
				[OID.numeric]: "undefined",
				[OID.nummultirange]: "undefined",
				[OID.numrange]: "undefined",
				[OID.oid]: [
					`defineOID("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineOID",
							type: "named",
						},
					],
				],
				[OID.oidvector]: "undefined",
				[OID.opaque]: "undefined",
				[OID.path]: [
					`definePath("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "definePath",
							type: "named",
						},
					],
				],
				[OID.pg_brin_bloom_summary]: "undefined",
				[OID.pg_brin_minmax_multi_summary]: "undefined",
				[OID.pg_ddl_command]: "undefined",
				[OID.pg_dependencies]: "undefined",
				[OID.pg_lsn]: "undefined",
				[OID.pg_mcv_list]: "undefined",
				[OID.pg_ndistinct]: "undefined",
				[OID.pg_node_tree]: "undefined",
				[OID.pg_snapshot]: "undefined",
				[OID.point]: [
					`definePoint("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "definePoint",
							type: "named",
						},
					],
				],
				[OID.polygon]: [
					`definePolygon("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "definePolygon",
							type: "named",
						},
					],
				],
				[OID.record]: "undefined",
				[OID.refcursor]: "undefined",
				[OID.regcollation]: "undefined",
				[OID.regclass]: "undefined",
				[OID.regconfig]: "undefined",
				[OID.regdictionary]: "undefined",
				[OID.regnamespace]: "undefined",
				[OID.regoper]: "undefined",
				[OID.regoperator]: "undefined",
				[OID.regproc]: "undefined",
				[OID.regprocedure]: "undefined",
				[OID.regrole]: "undefined",
				[OID.regtype]: "undefined",
				[OID.reltime]: "undefined",
				[OID.smgr]: "undefined",
				[OID.table_am_handler]: "undefined",
				[OID.text]: [
					`defineText("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineText",
							type: "named",
						},
					],
				],
				[OID.tid]: "undefined",
				[OID.time]: [
					`defineTime("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTime",
							type: "named",
						},
					],
				],
				[OID.timestamp]: [
					`defineTimestamp("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestamp",
							type: "named",
						},
					],
				],
				[OID.timestamptz]: [
					`defineTimestampTZ("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampTZ",
							type: "named",
						},
					],
				],
				[OID.timetz]: [
					`defineTimeTZ("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimeTZ",
							type: "named",
						},
					],
				],
				[OID.tinterval]: "undefined",
				[OID.trigger]: "undefined",
				[OID.tsm_handler]: "undefined",
				[OID.tsmultirange]: [
					`defineTimestampMultiRange("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampMultiRange",
							type: "named",
						},
					],
				],
				[OID.tsquery]: "undefined",
				[OID.tsrange]: [
					`defineTimestampRange("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampRange",
							type: "named",
						},
					],
				],
				[OID.tstzmultirange]: [
					`defineTimestampTZMultiRange("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",

							name: "defineTimestampTZMultiRange",
							type: "named",
						},
					],
				],
				[OID.tstzrange]: [
					`defineTimestampTZRange("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineTimestampTZRange",
							type: "named",
						},
					],
				],
				[OID.tsvector]: "undefined",
				[OID.txid_snapshot]: "undefined",
				[OID.unknown]: "undefined",
				[OID.uuid]: [
					`defineUUID("%ATTRIBUTE%")${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineUUID",
							type: "named",
						},
					],
				],
				[OID.varbit]: [
					`defineBitVarying("%ATTRIBUTE%", { ${lengthString} })${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineBitVarying",
							type: "named",
						},
					],
				],
				[OID.varchar]: [
					`defineCharacterVarying("%ATTRIBUTE%", { ${lengthString} })${notNullString}`,
					[
						{
							module: "@postgresql-typed/core/definers",
							name: "defineCharacterVarying",
							type: "named",
						},
					],
				],
				[OID.void]: "undefined",
				[OID.xid]: "undefined",
				[OID.xid8]: "undefined",
				[OID.xml]: "undefined",
			};

		return ParserMapping[oid];
	},
};
