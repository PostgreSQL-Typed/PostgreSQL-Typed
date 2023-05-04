import { OID } from "@postgresql-typed/oids";
import type { ImportStatement } from "@postgresql-typed/util";

export const DefaultParserMapping = {
	get(oid: OID, maxLength?: number): string | [string, ImportStatement[]] | undefined {
		const lengthString = maxLength === undefined ? "" : `${maxLength}`,
			ParserMapping: {
				[key in OID]: string | [string, ImportStatement[]];
			} = {
				[OID._abstime]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._aclitem]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._bit]: [
					`PGTPParser(Bit.setN(${lengthString}), true)%others% as PGTPParserClass<BitConstructor<${lengthString}>>`,
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
					"PGTPParser(Boolean, true)%others% as PGTPParserClass<BooleanConstructor>",
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
					"PGTPParser(Box, true)%others% as PGTPParserClass<BoxConstructor>",
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
					`PGTPParser(Character.setN(${lengthString}), true)%others% as PGTPParserClass<CharacterConstructor<${lengthString}>>`,
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
				[OID._bytea]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._char]: [
					`PGTPParser(Character.setN(${lengthString}), true)%others% as PGTPParserClass<CharacterConstructor<${lengthString}>>`,
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
				[OID._cid]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._cidr]: [
					"PGTPParser(IPAddress, true)%others% as PGTPParserClass<IPAddressConstructor>",
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
					"PGTPParser(Circle, true)%others% as PGTPParserClass<CircleConstructor>",
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
				[OID._cstring]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._date]: [
					"PGTPParser(Date, true)%others% as PGTPParserClass<DateConstructor>",
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
					"PGTPParser(DateMultiRange, true)%others% as PGTPParserClass<DateMultiRangeConstructor>",
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
					"PGTPParser(DateRange, true)%others% as PGTPParserClass<DateRangeConstructor>",
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
					"PGTPParser(Float4, true)%others% as PGTPParserClass<Float4Constructor>",
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
					"PGTPParser(Float8, true)%others% as PGTPParserClass<Float8Constructor>",
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
				[OID._gtsvector]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._inet]: [
					"PGTPParser(IPAddress, true)%others% as PGTPParserClass<IPAddressConstructor>",
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
					"PGTPParser(Int2, true)%others% as PGTPParserClass<Int2Constructor>",
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
				[OID._int2vector]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._int4]: [
					"PGTPParser(Int4, true)%others% as PGTPParserClass<Int4Constructor>",
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
					"PGTPParser(Int4MultiRange, true)%others% as PGTPParserClass<Int4MultiRangeConstructor>",
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
					"PGTPParser(Int4Range, true)%others% as PGTPParserClass<Int4RangeConstructor>",
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
					"PGTPParser(Int8, true)%others% as PGTPParserClass<Int8Constructor>",
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
					"PGTPParser(Int8MultiRange, true)%others% as PGTPParserClass<Int8MultiRangeConstructor>",
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
					"PGTPParser(Int8Range, true)%others% as PGTPParserClass<Int8RangeConstructor>",
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
					"PGTPParser(Interval, true)%others% as PGTPParserClass<IntervalConstructor>",
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
				[OID._json]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._jsonb]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._jsonpath]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._line]: [
					"PGTPParser(Line, true)%others% as PGTPParserClass<LineConstructor>",
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
					"PGTPParser(LineSegment, true)%others% as PGTPParserClass<LineSegmentConstructor>",
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
					"PGTPParser(MACAddress, true)%others% as PGTPParserClass<MacAddressConstructor>",
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
					"PGTPParser(MACAddress8, true)%others% as PGTPParserClass<MacAddress8Constructor>",
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
					"PGTPParser(Money, true)%others% as PGTPParserClass<MoneyConstructor>",
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
					"PGTPParser(Name, true)%others% as PGTPParserClass<NameConstructor>",
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
				[OID._numeric]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._nummultirange]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._numrange]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._oid]: [
					"PGTPParser(OID, true)%others% as PGTPParserClass<OIDConstructor>",
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
				[OID._oidvector]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._path]: [
					"PGTPParser(Path, true)%others% as PGTPParserClass<PathConstructor>",
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
				[OID._pg_lsn]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._pg_snapshot]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._point]: [
					"PGTPParser(Point, true)%others% as PGTPParserClass<PointConstructor>",
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
					"PGTPParser(Polygon, true)%others% as PGTPParserClass<PolygonConstructor>",
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
				[OID._record]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._refcursor]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regclass]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regcollation]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regconfig]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regdictionary]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regnamespace]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regoper]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regoperator]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regproc]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regprocedure]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regrole]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._regtype]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._reltime]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._text]: [
					"PGTPParser(Text, true)%others% as PGTPParserClass<TextConstructor>",
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
				[OID._tid]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._time]: [
					"PGTPParser(Time, true)%others% as PGTPParserClass<TimeConstructor>",
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
					"PGTPParser(Timestamp, true)%others% as PGTPParserClass<TimestampConstructor>",
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
					"PGTPParser(TimestampTZ, true)%others% as PGTPParserClass<TimestampTZConstructor>",
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
					"PGTPParser(TimeTZ, true)%others% as PGTPParserClass<TimeTZConstructor>",
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
				[OID._tinterval]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._tsquery]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._tsmultirange]: [
					"PGTPParser(TimestampMultiRange, true)%others% as PGTPParserClass<TimestampMultiRangeConstructor>",
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
					"PGTPParser(TimestampRange, true)%others% as PGTPParserClass<TimestampRangeConstructor>",
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
					"PGTPParser(TimestampTZMultiRange, true)%others% as PGTPParserClass<TimestampTZMultiRangeConstructor>",
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
					"PGTPParser(TimestampTZRange, true)%others% as PGTPParserClass<TimestampTZRangeConstructor>",
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
				[OID._tsvector]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._txid_snapshot]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._uuid]: [
					"PGTPParser(UUID, true)%others% as PGTPParserClass<UUIDConstructor>",
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
					`PGTPParser(BitVarying.setN(${lengthString}), true)%others% as PGTPParserClass<BitVaryingConstructor<${lengthString}>>`,
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
					`PGTPParser(CharacterVarying.setN(${lengthString}), true)%others% as PGTPParserClass<CharacterVaryingConstructor<${lengthString}>>`,
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
				[OID._xid]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._xid8]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
				[OID._xml]: "PGTPParser('unknown', true)%others% as PGTPParserClass<'unknown'>",
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
					`PGTPParser(Bit.setN(${lengthString}))%others% as PGTPParserClass<BitConstructor<${lengthString}>>`,
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
					"PGTPParser(Boolean)%others% as PGTPParserClass<BooleanConstructor>",
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
					"PGTPParser(Box)%others% as PGTPParserClass<BoxConstructor>",
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
					`PGTPParser(Character.setN(${lengthString}))%others% as PGTPParserClass<CharacterConstructor<${lengthString}>>`,
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
					`PGTPParser(Character.setN(${lengthString}))%others% as PGTPParserClass<CharacterConstructor<${lengthString}>>`,
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
					"PGTPParser(IPAddress)%others% as PGTPParserClass<IPAddressConstructor>",
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
					"PGTPParser(Circle)%others% as PGTPParserClass<CircleConstructor>",
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
					"PGTPParser(Date)%others% as PGTPParserClass<DateConstructor>",
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
					"PGTPParser(DateMultiRange)%others% as PGTPParserClass<DateMultiRangeConstructor>",
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
					"PGTPParser(DateRange)%others% as PGTPParserClass<DateRangeConstructor>",
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
					"PGTPParser(Float4)%others% as PGTPParserClass<Float4Constructor>",
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
					"PGTPParser(Float8)%others% as PGTPParserClass<Float8Constructor>",
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
					"PGTPParser(IPAddress)%others% as PGTPParserClass<IPAddressConstructor>",
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
					"PGTPParser(Int2)%others% as PGTPParserClass<Int2Constructor>",
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
					"PGTPParser(Int4)%others% as PGTPParserClass<Int4Constructor>",
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
					"PGTPParser(Int4MultiRange)%others% as PGTPParserClass<Int4MultiRangeConstructor>",
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
					"PGTPParser(Int4Range)%others% as PGTPParserClass<Int4RangeConstructor>",
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
					"PGTPParser(Int8)%others% as PGTPParserClass<Int8Constructor>",
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
					"PGTPParser(Int8MultiRange)%others% as PGTPParserClass<Int8MultiRangeConstructor>",
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
					"PGTPParser(Int8Range)%others% as PGTPParserClass<Int8RangeConstructor>",
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
					"PGTPParser(Interval)%others% as PGTPParserClass<IntervalConstructor>",
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
					"PGTPParser(Line)%others% as PGTPParserClass<LineConstructor>",
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
					"PGTPParser(LineSegment)%others% as PGTPParserClass<LineSegmentConstructor>",
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
					"PGTPParser(MACAddress)%others% as PGTPParserClass<MacAddressConstructor>",
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
					"PGTPParser(MACAddress8)%others% as PGTPParserClass<MacAddress8Constructor>",
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
					"PGTPParser(Money)%others% as PGTPParserClass<MoneyConstructor>",
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
					"PGTPParser(Name)%others% as PGTPParserClass<NameConstructor>",
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
					"PGTPParser(OID)%others% as PGTPParserClass<OIDConstructor>",
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
					"PGTPParser(Path)%others% as PGTPParserClass<PathConstructor>",
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
					"PGTPParser(Point)%others% as PGTPParserClass<PointConstructor>",
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
					"PGTPParser(Polygon)%others% as PGTPParserClass<PolygonConstructor>",
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
					"PGTPParser(Text)%others% as PGTPParserClass<TextConstructor>",
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
					"PGTPParser(Time)%others% as PGTPParserClass<TimeConstructor>",
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
					"PGTPParser(Timestamp)%others% as PGTPParserClass<TimestampConstructor>",
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
					"PGTPParser(TimestampTZ)%others% as PGTPParserClass<TimestampTZConstructor>",
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
					"PGTPParser(TimeTZ)%others% as PGTPParserClass<TimeTZConstructor>",
					[
						{
							module: "@postgresql-typed/parsers",
							name: "TimeTZ",
							type: "named",
						},
					],
				],
				[OID.tinterval]: "'unknown'",
				[OID.trigger]: "'unknown'",
				[OID.tsm_handler]: "'unknown'",
				[OID.tsmultirange]: "'unknown'",
				[OID.tsquery]: "'unknown'",
				[OID.tsrange]: [
					"PGTPParser(TimestampRange)%others% as PGTPParserClass<TimestampRangeConstructor>",
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
					"PGTPParser(TimestampTZMultiRange)%others% as PGTPParserClass<TimestampTZMultiRangeConstructor>",
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
					"PGTPParser(TimestampTZRange)%others% as PGTPParserClass<TimestampTZRangeConstructor>",
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
					"PGTPParser(UUID)%others% as PGTPParserClass<UUIDConstructor>",
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
					`PGTPParser(BitVarying.setN(${lengthString}))%others% as PGTPParserClass<BitVaryingConstructor<${lengthString}>>`,
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
					`PGTPParser(CharacterVarying.setN(${lengthString}))%others% as PGTPParserClass<CharacterVaryingConstructor<${lengthString}>>`,
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
