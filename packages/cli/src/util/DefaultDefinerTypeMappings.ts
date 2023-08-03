import { OID } from "@postgresql-typed/oids";
import type { ImportStatement } from "@postgresql-typed/util";

export const DefaultDefinerTypeMappings = {
	get(oid: OID): string | [string, ImportStatement[]] | undefined {
		const ParserMapping: {
			[key in OID]: string | [string, ImportStatement[]];
		} = {
			[OID._abstime]: "undefined",
			[OID._aclitem]: "undefined",
			[OID._bit]: [
				'PgTArrayOfType<PgTBitType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBitType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._bool]: [
				'PgTArrayOfType<PgTBooleanType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBooleanType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._box]: [
				'PgTArrayOfType<PgTBoxType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBoxType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._bpchar]: [
				'PgTArrayOfType<PgTCharacterType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCharacterType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._bytea]: [
				'PgTArrayOfType<PgTByteAType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTByteAType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._char]: [
				'PgTArrayOfType<PgTCharacterType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCharacterType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._cid]: "undefined",
			[OID._cidr]: "undefined",
			[OID._circle]: [
				'PgTArrayOfType<PgTCircleType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCircleType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._cstring]: "undefined",
			[OID._date]: [
				'PgTArrayOfType<PgTDateType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTDateType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._datemultirange]: [
				'PgTArrayOfType<PgTDateMultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTDateMultiRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._daterange]: [
				'PgTArrayOfType<PgTDateRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTDateRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._float4]: [
				'PgTArrayOfType<PgTFloat4Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTFloat4Type",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._float8]: [
				'PgTArrayOfType<PgTFloat8Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTFloat8Type",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._gtsvector]: "undefined",
			[OID._inet]: "undefined",
			[OID._int2]: [
				'PgTArrayOfType<PgTInt2Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt2Type",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._int2vector]: "undefined",
			[OID._int4]: [
				'PgTArrayOfType<PgTInt4Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt4Type",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._int4multirange]: [
				'PgTArrayOfType<PgTInt4MultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt4MultiRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._int4range]: [
				'PgTArrayOfType<PgTInt4RangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt4RangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._int8]: [
				'PgTArrayOfType<PgTInt8Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt8Type",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._int8multirange]: [
				'PgTArrayOfType<PgTInt8MultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt8MultiRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._int8range]: [
				'PgTArrayOfType<PgTInt8RangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt8RangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._interval]: [
				'PgTArrayOfType<PgTIntervalType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTIntervalType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._json]: [
				'PgTArrayOfType<PgTJSONType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTJSONType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._jsonb]: [
				'PgTArrayOfType<PgTJSONBType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTJSONBType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._jsonpath]: "undefined",
			[OID._line]: [
				'PgTArrayOfType<PgTLineType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTLineType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._lseg]: [
				'PgTArrayOfType<PgTLineSegmentType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTLineSegmentType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._macaddr]: "undefined",
			[OID._macaddr8]: "undefined",
			[OID._money]: [
				'PgTArrayOfType<PgTMoneyType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTMoneyType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._name]: [
				'PgTArrayOfType<PgTNameType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTNameType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._numeric]: "undefined",
			[OID._nummultirange]: "undefined",
			[OID._numrange]: "undefined",
			[OID._oid]: [
				'PgTArrayOfType<PgTOIDType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTOIDType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._oidvector]: "undefined",
			[OID._path]: [
				'PgTArrayOfType<PgTPathType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTPathType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._pg_lsn]: "undefined",
			[OID._pg_snapshot]: "undefined",
			[OID._point]: [
				'PgTArrayOfType<PgTPointType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTPointType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._polygon]: [
				'PgTArrayOfType<PgTPolygonType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTPolygonType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
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
				'PgTArrayOfType<PgTTextType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTextType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._tid]: "undefined",
			[OID._time]: [
				'PgTArrayOfType<PgTTimeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._timestamp]: [
				'PgTArrayOfType<PgTTimestampType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._timestamptz]: [
				'PgTArrayOfType<PgTTimestampTZType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampTZType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._timetz]: [
				'PgTArrayOfType<PgTTimeTZType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimeTZType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._tinterval]: "undefined",
			[OID._tsquery]: "undefined",
			[OID._tsmultirange]: [
				'PgTArrayOfType<PgTTimestampMultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampMultiRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._tsrange]: [
				'PgTArrayOfType<PgTTimestampRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._tstzmultirange]: [
				'PgTArrayOfType<PgTTimestampTZMultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampTZMultiRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._tstzrange]: [
				'PgTArrayOfType<PgTTimestampTZRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampTZRangeType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._tsvector]: "undefined",
			[OID._txid_snapshot]: "undefined",
			[OID._uuid]: [
				'PgTArrayOfType<PgTUUIDType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "defineUUID",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._varbit]: [
				'PgTArrayOfType<PgTBitVaryingType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBitVaryingType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
						type: "named",
					},
				],
			],
			[OID._varchar]: [
				'PgTArrayOfType<PgTCharacterVaryingType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCharacterVaryingType",
						type: "named",
					},
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTArrayOfType",
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
				'PgTBitType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBitType",
						type: "named",
					},
				],
			],
			[OID.bool]: [
				'PgTBooleanType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBooleanType",
						type: "named",
					},
				],
			],
			[OID.box]: [
				'PgTBoxType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBoxType",
						type: "named",
					},
				],
			],
			[OID.bpchar]: [
				'PgTCharacterType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCharacterType",
						type: "named",
					},
				],
			],
			[OID.bytea]: [
				'PgTByteAType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTByteAType",
						type: "named",
					},
				],
			],
			[OID.cardinal_number]: "undefined",
			[OID.char]: [
				'PgTCharacterType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCharacterType",
						type: "named",
					},
				],
			],
			[OID.character_data]: "undefined",
			[OID.cid]: "undefined",
			[OID.cidr]: "undefined",
			[OID.circle]: [
				'PgTCircleType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCircleType",
						type: "named",
					},
				],
			],
			[OID.cstring]: "undefined",
			[OID.date]: [
				'PgTDateType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTDateType",
						type: "named",
					},
				],
			],
			[OID.datemultirange]: [
				'PgTDateMultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTDateMultiRangeType",
						type: "named",
					},
				],
			],
			[OID.daterange]: [
				'PgTDateRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTDateRangeType",
						type: "named",
					},
				],
			],
			[OID.event_trigger]: "undefined",
			[OID.fdw_handler]: "undefined",
			[OID.float4]: [
				'PgTFloat4Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTFloat4Type",
						type: "named",
					},
				],
			],
			[OID.float8]: [
				'PgTFloat8Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTFloat8Type",
						type: "named",
					},
				],
			],
			[OID.gtsvector]: "undefined",
			[OID.index_am_handler]: "undefined",
			[OID.inet]: "undefined",
			[OID.int2]: [
				'PgTInt2Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt2Type",
						type: "named",
					},
				],
			],
			[OID.int2vector]: "undefined",
			[OID.int4]: [
				'PgTInt4Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt4Type",
						type: "named",
					},
				],
			],
			[OID.int4multirange]: [
				'PgTInt4MultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt4MultiRangeType",
						type: "named",
					},
				],
			],
			[OID.int4range]: [
				'PgTInt4RangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt4RangeType",
						type: "named",
					},
				],
			],
			[OID.int8]: [
				'PgTInt8Type<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt8Type",
						type: "named",
					},
				],
			],
			[OID.int8multirange]: [
				'PgTInt8MultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt8MultiRangeType",
						type: "named",
					},
				],
			],
			[OID.int8range]: [
				'PgTInt8RangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTInt8RangeType",
						type: "named",
					},
				],
			],
			[OID.internal]: "undefined",
			[OID.interval]: [
				'PgTIntervalType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTIntervalType",
						type: "named",
					},
				],
			],
			[OID.json]: [
				'PgTJSONType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTJSONType",
						type: "named",
					},
				],
			],
			[OID.jsonb]: [
				'PgTJSONBType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTJSONBType",
						type: "named",
					},
				],
			],
			[OID.jsonpath]: "undefined",
			[OID.language_handler]: "undefined",
			[OID.line]: [
				'PgTLineType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTLineType",
						type: "named",
					},
				],
			],
			[OID.lseg]: [
				'PgTLineSegmentType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTLineSegmentType",
						type: "named",
					},
				],
			],
			[OID.macaddr]: "undefined",
			[OID.macaddr8]: "undefined",
			[OID.money]: [
				'PgTMoneyType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTMoneyType",
						type: "named",
					},
				],
			],
			[OID.name]: [
				'PgTNameType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTNameType",
						type: "named",
					},
				],
			],
			[OID.numeric]: "undefined",
			[OID.nummultirange]: "undefined",
			[OID.numrange]: "undefined",
			[OID.oid]: [
				'PgTOIDType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTOIDType",
						type: "named",
					},
				],
			],
			[OID.oidvector]: "undefined",
			[OID.opaque]: "undefined",
			[OID.path]: [
				'PgTPathType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTPathType",
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
				'PgTPointType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTPointType",
						type: "named",
					},
				],
			],
			[OID.polygon]: [
				'PgTPolygonType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTPolygonType",
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
				'PgTTextType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTextType",
						type: "named",
					},
				],
			],
			[OID.tid]: "undefined",
			[OID.time]: [
				'PgTTimeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimeType",
						type: "named",
					},
				],
			],
			[OID.timestamp]: [
				'PgTTimestampType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampType",
						type: "named",
					},
				],
			],
			[OID.timestamptz]: [
				'PgTTimestampTZType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampTZType",
						type: "named",
					},
				],
			],
			[OID.timetz]: [
				'PgTTimeTZType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimeTZType",
						type: "named",
					},
				],
			],
			[OID.tinterval]: "undefined",
			[OID.trigger]: "undefined",
			[OID.tsm_handler]: "undefined",
			[OID.tsmultirange]: [
				'PgTTimestampMultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampMultiRangeType",
						type: "named",
					},
				],
			],
			[OID.tsquery]: "undefined",
			[OID.tsrange]: [
				'PgTTimestampRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampRangeType",
						type: "named",
					},
				],
			],
			[OID.tstzmultirange]: [
				'PgTTimestampTZMultiRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,

						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampTZMultiRangeType",
						type: "named",
					},
				],
			],
			[OID.tstzrange]: [
				'PgTTimestampTZRangeType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTTimestampTZRangeType",
						type: "named",
					},
				],
			],
			[OID.tsvector]: "undefined",
			[OID.txid_snapshot]: "undefined",
			[OID.unknown]: "undefined",
			[OID.uuid]: [
				'PgTUUIDType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTUUIDType",
						type: "named",
					},
				],
			],
			[OID.varbit]: [
				'PgTBitVaryingType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTBitVaryingType",
						type: "named",
					},
				],
			],
			[OID.varchar]: [
				'PgTCharacterVaryingType<"%TABLE%", "%ATTRIBUTE%", "%MODE%", %NOTNULL%, %HASDEFAULT%, %LENGTHMAYBE%>',
				[
					{
						isType: true,
						module: "@postgresql-typed/core/definers",
						name: "PgTCharacterVaryingType",
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
