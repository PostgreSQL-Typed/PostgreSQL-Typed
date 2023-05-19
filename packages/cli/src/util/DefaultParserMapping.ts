import { OID } from "@postgresql-typed/oids";
import type { ImportStatement } from "@postgresql-typed/util";

export const DefaultParserMapping = {
	get(oid: OID, maxLength?: number): string | [string, ImportStatement[]] | undefined {
		const lengthString = maxLength === undefined ? "" : `${maxLength}`,
			ParserMapping: {
				[key in OID]: string | [string, ImportStatement[]];
			} = {
				[OID._abstime]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._aclitem]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._bit]: [
					`PgTPParser(Bit.setN(${lengthString}), true)%others% as PgTPParserClass<BitConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Bit",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BitConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bool]: [
					"PgTPParser(Boolean, true)%others% as PgTPParserClass<BooleanConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Boolean",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BooleanConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._box]: [
					"PgTPParser(Box, true)%others% as PgTPParserClass<BoxConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Box",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BoxConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bpchar]: [
					`PgTPParser(Character.setN(${lengthString}), true)%others% as PgTPParserClass<CharacterConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._bytea]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._char]: [
					`PgTPParser(Character.setN(${lengthString}), true)%others% as PgTPParserClass<CharacterConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._cid]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._cidr]: [
					"PgTPParser(IPAddress, true)%others% as PgTPParserClass<IPAddressConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddressConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._circle]: [
					"PgTPParser(Circle, true)%others% as PgTPParserClass<CircleConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Circle",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CircleConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._cstring]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._date]: [
					"PgTPParser(Date, true)%others% as PgTPParserClass<DateConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Date",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "DateConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._datemultirange]: [
					"PgTPParser(DateMultiRange, true)%others% as PgTPParserClass<DateMultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateMultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "DateMultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._daterange]: [
					"PgTPParser(DateRange, true)%others% as PgTPParserClass<DateRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "DateRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._float4]: [
					"PgTPParser(Float4, true)%others% as PgTPParserClass<Float4Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float4",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Float4Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._float8]: [
					"PgTPParser(Float8, true)%others% as PgTPParserClass<Float8Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float8",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Float8Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._gtsvector]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._inet]: [
					"PgTPParser(IPAddress, true)%others% as PgTPParserClass<IPAddressConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddressConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int2]: [
					"PgTPParser(Int2, true)%others% as PgTPParserClass<Int2Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int2",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int2Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int2vector]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._int4]: [
					"PgTPParser(Int4, true)%others% as PgTPParserClass<Int4Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int4Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int4multirange]: [
					"PgTPParser(Int4MultiRange, true)%others% as PgTPParserClass<Int4MultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4MultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int4MultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int4range]: [
					"PgTPParser(Int4Range, true)%others% as PgTPParserClass<Int4RangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4Range",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int4RangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int8]: [
					"PgTPParser(Int8, true)%others% as PgTPParserClass<Int8Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int8Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int8multirange]: [
					"PgTPParser(Int8MultiRange, true)%others% as PgTPParserClass<Int8MultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8MultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int8MultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._int8range]: [
					"PgTPParser(Int8Range, true)%others% as PgTPParserClass<Int8RangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8Range",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int8RangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._interval]: [
					"PgTPParser(Interval, true)%others% as PgTPParserClass<IntervalConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Interval",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "IntervalConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._json]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._jsonb]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._jsonpath]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._line]: [
					"PgTPParser(Line, true)%others% as PgTPParserClass<LineConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Line",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "LineConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._lseg]: [
					"PgTPParser(LineSegment, true)%others% as PgTPParserClass<LineSegmentConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "LineSegment",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "LineSegmentConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._macaddr]: [
					"PgTPParser(MACAddress, true)%others% as PgTPParserClass<MacAddressConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "MacAddressConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._macaddr8]: [
					"PgTPParser(MACAddress8, true)%others% as PgTPParserClass<MacAddress8Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress8",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "MacAddress8Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._money]: [
					"PgTPParser(Money, true)%others% as PgTPParserClass<MoneyConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Money",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "MoneyConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._name]: [
					"PgTPParser(Name, true)%others% as PgTPParserClass<NameConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Name",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "NameConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._numeric]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._nummultirange]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._numrange]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._oid]: [
					"PgTPParser(OID, true)%others% as PgTPParserClass<OIDConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "OID",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "OIDConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._oidvector]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._path]: [
					"PgTPParser(Path, true)%others% as PgTPParserClass<PathConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Path",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "PathConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._pg_lsn]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._pg_snapshot]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._point]: [
					"PgTPParser(Point, true)%others% as PgTPParserClass<PointConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Point",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "PointConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._polygon]: [
					"PgTPParser(Polygon, true)%others% as PgTPParserClass<PolygonConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Polygon",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "PolygonConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._record]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._refcursor]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regclass]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regcollation]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regconfig]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regdictionary]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regnamespace]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regoper]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regoperator]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regproc]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regprocedure]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regrole]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._regtype]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._reltime]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._text]: [
					"PgTPParser(Text, true)%others% as PgTPParserClass<TextConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Text",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TextConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tid]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._time]: [
					"PgTPParser(Time, true)%others% as PgTPParserClass<TimeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Time",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._timestamp]: [
					"PgTPParser(Timestamp, true)%others% as PgTPParserClass<TimestampConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Timestamp",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._timestamptz]: [
					"PgTPParser(TimestampTZ, true)%others% as PgTPParserClass<TimestampTZConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZ",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._timetz]: [
					"PgTPParser(TimeTZ, true)%others% as PgTPParserClass<TimeTZConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZ",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tinterval]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._tsquery]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._tsmultirange]: [
					"PgTPParser(TimestampMultiRange, true)%others% as PgTPParserClass<TimestampMultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampMultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampMultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tsrange]: [
					"PgTPParser(TimestampRange, true)%others% as PgTPParserClass<TimestampRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tstzmultirange]: [
					"PgTPParser(TimestampTZMultiRange, true)%others% as PgTPParserClass<TimestampTZMultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZMultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZMultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tstzrange]: [
					"PgTPParser(TimestampTZRange, true)%others% as PgTPParserClass<TimestampTZRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._tsvector]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._txid_snapshot]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._uuid]: [
					"PgTPParser(UUID, true)%others% as PgTPParserClass<UUIDConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "UUID",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "UUIDConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._varbit]: [
					`PgTPParser(BitVarying.setN(${lengthString}), true)%others% as PgTPParserClass<BitVaryingConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "BitVarying",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BitVaryingConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._varchar]: [
					`PgTPParser(CharacterVarying.setN(${lengthString}), true)%others% as PgTPParserClass<CharacterVaryingConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterVarying",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterVaryingConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID._xid]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._xid8]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
				[OID._xml]: "PgTPParser('unknown', true)%others% as PgTPParserClass<'unknown'>",
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
					`PgTPParser(Bit.setN(${lengthString}))%others% as PgTPParserClass<BitConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Bit",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BitConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bool]: [
					"PgTPParser(Boolean)%others% as PgTPParserClass<BooleanConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Boolean",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BooleanConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.box]: [
					"PgTPParser(Box)%others% as PgTPParserClass<BoxConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Box",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BoxConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bpchar]: [
					`PgTPParser(Character.setN(${lengthString}))%others% as PgTPParserClass<CharacterConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.bytea]: "'unknown'",
				[OID.cardinal_number]: "'unknown'",
				[OID.char]: [
					`PgTPParser(Character.setN(${lengthString}))%others% as PgTPParserClass<CharacterConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Character",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.character_data]: "'unknown'",
				[OID.cid]: "'unknown'",
				[OID.cidr]: [
					"PgTPParser(IPAddress)%others% as PgTPParserClass<IPAddressConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddressConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.circle]: [
					"PgTPParser(Circle)%others% as PgTPParserClass<CircleConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Circle",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CircleConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.cstring]: "'unknown'",
				[OID.date]: [
					"PgTPParser(Date)%others% as PgTPParserClass<DateConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Date",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "DateConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.datemultirange]: [
					"PgTPParser(DateMultiRange)%others% as PgTPParserClass<DateMultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateMultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "DateMultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.daterange]: [
					"PgTPParser(DateRange)%others% as PgTPParserClass<DateRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "DateRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "DateRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.event_trigger]: "'unknown'",
				[OID.fdw_handler]: "'unknown'",
				[OID.float4]: [
					"PgTPParser(Float4)%others% as PgTPParserClass<Float4Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float4",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Float4Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.float8]: [
					"PgTPParser(Float8)%others% as PgTPParserClass<Float8Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Float8",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Float8Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.gtsvector]: "'unknown'",
				[OID.index_am_handler]: "'unknown'",
				[OID.inet]: [
					"PgTPParser(IPAddress)%others% as PgTPParserClass<IPAddressConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddress",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "IPAddressConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int2]: [
					"PgTPParser(Int2)%others% as PgTPParserClass<Int2Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int2",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int2Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int2vector]: "'unknown'",
				[OID.int4]: [
					"PgTPParser(Int4)%others% as PgTPParserClass<Int4Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int4Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int4multirange]: [
					"PgTPParser(Int4MultiRange)%others% as PgTPParserClass<Int4MultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4MultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int4MultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int4range]: [
					"PgTPParser(Int4Range)%others% as PgTPParserClass<Int4RangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int4Range",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int4RangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int8]: [
					"PgTPParser(Int8)%others% as PgTPParserClass<Int8Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int8Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int8multirange]: [
					"PgTPParser(Int8MultiRange)%others% as PgTPParserClass<Int8MultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8MultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int8MultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.int8range]: [
					"PgTPParser(Int8Range)%others% as PgTPParserClass<Int8RangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Int8Range",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "Int8RangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.internal]: "'unknown'",
				[OID.interval]: [
					"PgTPParser(Interval)%others% as PgTPParserClass<IntervalConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Interval",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "IntervalConstructor",
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
					"PgTPParser(Line)%others% as PgTPParserClass<LineConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Line",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "LineConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.lseg]: [
					"PgTPParser(LineSegment)%others% as PgTPParserClass<LineSegmentConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "LineSegment",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "LineSegmentConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.macaddr]: [
					"PgTPParser(MACAddress)%others% as PgTPParserClass<MacAddressConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "MacAddressConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.macaddr8]: [
					"PgTPParser(MACAddress8)%others% as PgTPParserClass<MacAddress8Constructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "MACAddress8",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "MacAddress8Constructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.money]: [
					"PgTPParser(Money)%others% as PgTPParserClass<MoneyConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Money",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "MoneyConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.name]: [
					"PgTPParser(Name)%others% as PgTPParserClass<NameConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Name",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "NameConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.numeric]: "'unknown'",
				[OID.nummultirange]: "'unknown'",
				[OID.numrange]: "'unknown'",
				[OID.oid]: [
					"PgTPParser(OID)%others% as PgTPParserClass<OIDConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "OID",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "OIDConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.oidvector]: "'unknown'",
				[OID.opaque]: "'unknown'",
				[OID.path]: [
					"PgTPParser(Path)%others% as PgTPParserClass<PathConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Path",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "PathConstructor",
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
					"PgTPParser(Point)%others% as PgTPParserClass<PointConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Point",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "PointConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.polygon]: [
					"PgTPParser(Polygon)%others% as PgTPParserClass<PolygonConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Polygon",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "PolygonConstructor",
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
				[OID.text]: [
					"PgTPParser(Text)%others% as PgTPParserClass<TextConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Text",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TextConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tid]: "'unknown'",
				[OID.time]: [
					"PgTPParser(Time)%others% as PgTPParserClass<TimeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Time",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.timestamp]: [
					"PgTPParser(Timestamp)%others% as PgTPParserClass<TimestampConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "Timestamp",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.timestamptz]: [
					"PgTPParser(TimestampTZ)%others% as PgTPParserClass<TimestampTZConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZ",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.timetz]: [
					"PgTPParser(TimeTZ)%others% as PgTPParserClass<TimeTZConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZ",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZConstructor",
							type: "named",
						},
					],
				],
				[OID.tinterval]: "'unknown'",
				[OID.trigger]: "'unknown'",
				[OID.tsm_handler]: "'unknown'",
				[OID.tsmultirange]: [
					"PgTPParser(TimestampMultiRange)%others% as PgTPParserClass<TimestampMultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampMultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampMultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tsquery]: "'unknown'",
				[OID.tsrange]: [
					"PgTPParser(TimestampRange)%others% as PgTPParserClass<TimestampRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tstzmultirange]: [
					"PgTPParser(TimestampTZMultiRange)%others% as PgTPParserClass<TimestampTZMultiRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZMultiRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZMultiRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tstzrange]: [
					"PgTPParser(TimestampTZRange)%others% as PgTPParserClass<TimestampTZRangeConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRange",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "TimestampTZRangeConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.tsvector]: "'unknown'",
				[OID.txid_snapshot]: "'unknown'",
				[OID.unknown]: "'unknown'",
				[OID.uuid]: [
					"PgTPParser(UUID)%others% as PgTPParserClass<UUIDConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "UUID",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "UUIDConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.varbit]: [
					`PgTPParser(BitVarying.setN(${lengthString}))%others% as PgTPParserClass<BitVaryingConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "BitVarying",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "BitVaryingConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.varchar]: [
					`PgTPParser(CharacterVarying.setN(${lengthString}))%others% as PgTPParserClass<CharacterVaryingConstructor<${lengthString}>>`,
					[
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterVarying",
							type: "named",
						},
						{
							module: "@postgresql-typed/parsers",
							name: "CharacterVaryingConstructor",
							type: "named",
							isType: true,
						},
					],
				],
				[OID.void]: "'unknown'",
				[OID.xid]: "'unknown'",
				[OID.xid8]: "'unknown'",
				[OID.xml]: "'unknown'",
			};

		return ParserMapping[oid];
	},
};
