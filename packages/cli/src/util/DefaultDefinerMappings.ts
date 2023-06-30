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
				[OID._abstime]: "",
				[OID._aclitem]: "",
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
				[OID._bytea]: "",
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
				[OID._cid]: "",
				[OID._cidr]: "",
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
				[OID._cstring]: "",
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
				[OID._gtsvector]: "",
				[OID._inet]: "",
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
				[OID._int2vector]: "",
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
				[OID._jsonpath]: "",
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
				[OID._macaddr]: "",
				[OID._macaddr8]: "",
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
				[OID._numeric]: "",
				[OID._nummultirange]: "",
				[OID._numrange]: "",
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
				[OID._oidvector]: "",
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
				[OID._pg_lsn]: "",
				[OID._pg_snapshot]: "",
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
				[OID._record]: "",
				[OID._refcursor]: "",
				[OID._regclass]: "",
				[OID._regcollation]: "",
				[OID._regconfig]: "",
				[OID._regdictionary]: "",
				[OID._regnamespace]: "",
				[OID._regoper]: "",
				[OID._regoperator]: "",
				[OID._regproc]: "",
				[OID._regprocedure]: "",
				[OID._regrole]: "",
				[OID._regtype]: "",
				[OID._reltime]: "",
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
				[OID._tid]: "",
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
				[OID._tinterval]: "",
				[OID._tsquery]: "",
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
				[OID._tsvector]: "",
				[OID._txid_snapshot]: "",
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
				[OID._xid]: "",
				[OID._xid8]: "",
				[OID._xml]: "",
				[OID.abstime]: "",
				[OID.aclitem]: "",
				[OID.any]: "",
				[OID.anyarray]: "",
				[OID.anycompatible]: "",
				[OID.anycompatiblearray]: "",
				[OID.anycompatiblemultirange]: "",
				[OID.anycompatiblenonarray]: "",
				[OID.anycompatiblerange]: "",
				[OID.anyelement]: "",
				[OID.anyenum]: "",
				[OID.anymultirange]: "",
				[OID.anynonarray]: "",
				[OID.anyrange]: "",
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
				[OID.bytea]: "",
				[OID.cardinal_number]: "",
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
				[OID.character_data]: "",
				[OID.cid]: "",
				[OID.cidr]: "",
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
				[OID.cstring]: "",
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
				[OID.event_trigger]: "",
				[OID.fdw_handler]: "",
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
				[OID.gtsvector]: "",
				[OID.index_am_handler]: "",
				[OID.inet]: "",
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
				[OID.int2vector]: "",
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
				[OID.internal]: "",
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
				[OID.jsonpath]: "",
				[OID.language_handler]: "",
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
				[OID.macaddr]: "",
				[OID.macaddr8]: "",
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
				[OID.numeric]: "",
				[OID.nummultirange]: "",
				[OID.numrange]: "",
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
				[OID.oidvector]: "",
				[OID.opaque]: "",
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
				[OID.pg_brin_bloom_summary]: "",
				[OID.pg_brin_minmax_multi_summary]: "",
				[OID.pg_ddl_command]: "",
				[OID.pg_dependencies]: "",
				[OID.pg_lsn]: "",
				[OID.pg_mcv_list]: "",
				[OID.pg_ndistinct]: "",
				[OID.pg_node_tree]: "",
				[OID.pg_snapshot]: "",
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
				[OID.record]: "",
				[OID.refcursor]: "",
				[OID.regcollation]: "",
				[OID.regclass]: "",
				[OID.regconfig]: "",
				[OID.regdictionary]: "",
				[OID.regnamespace]: "",
				[OID.regoper]: "",
				[OID.regoperator]: "",
				[OID.regproc]: "",
				[OID.regprocedure]: "",
				[OID.regrole]: "",
				[OID.regtype]: "",
				[OID.reltime]: "",
				[OID.smgr]: "",
				[OID.table_am_handler]: "",
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
				[OID.tid]: "",
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
				[OID.tinterval]: "",
				[OID.trigger]: "",
				[OID.tsm_handler]: "",
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
				[OID.tsquery]: "",
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
				[OID.tsvector]: "",
				[OID.txid_snapshot]: "",
				[OID.unknown]: "",
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
				[OID.void]: "",
				[OID.xid]: "",
				[OID.xid8]: "",
				[OID.xml]: "",
			};

		return ParserMapping[oid];
	},
};
