import {
	Bit,
	type BitConstructor,
	BitVarying,
	type BitVaryingConstructor,
	Boolean,
	type BooleanConstructor,
	Box,
	type BoxConstructor,
	Character,
	type CharacterConstructor,
	CharacterVarying,
	type CharacterVaryingConstructor,
	Circle,
	type CircleConstructor,
	Date,
	type DateConstructor,
	DateMultiRange,
	type DateMultiRangeConstructor,
	DateRange,
	type DateRangeConstructor,
	Float4,
	type Float4Constructor,
	Float8,
	type Float8Constructor,
	Int2,
	type Int2Constructor,
	Int4,
	type Int4Constructor,
	Int4MultiRange,
	type Int4MultiRangeConstructor,
	Int4Range,
	type Int4RangeConstructor,
	Int8,
	type Int8Constructor,
	Int8MultiRange,
	type Int8MultiRangeConstructor,
	Int8Range,
	type Int8RangeConstructor,
	Interval,
	type IntervalConstructor,
	Line,
	type LineConstructor,
	LineSegment,
	type LineSegmentConstructor,
	Money,
	type MoneyConstructor,
	Name,
	type NameConstructor,
	OID,
	type OIDConstructor,
	Path,
	type PathConstructor,
	PgTPParser,
	type PgTPParserClass,
	Point,
	type PointConstructor,
	Polygon,
	type PolygonConstructor,
	Text,
	type TextConstructor,
	Time,
	type TimeConstructor,
	Timestamp,
	type TimestampConstructor,
	TimestampMultiRange,
	type TimestampMultiRangeConstructor,
	TimestampRange,
	type TimestampRangeConstructor,
	TimestampTZ,
	type TimestampTZConstructor,
	TimestampTZMultiRange,
	type TimestampTZMultiRangeConstructor,
	TimestampTZRange,
	type TimestampTZRangeConstructor,
	TimeTZ,
	TimeTZConstructor,
	UUID,
	type UUIDConstructor,
} from "@postgresql-typed/parsers";

export type TestData = {
	db1: {
		name: "db1";
		schemas: {
			schema1: {
				name: "schema1";
				tables: {
					table1: {
						name: "table1";
						primary_key: "id";
						columns: {
							/**
							 * @kind bit(5)[]
							 */
							_bit: Bit<5>[];
							/**
							 * @kind boolean[]
							 */
							// eslint-disable-next-line @typescript-eslint/ban-types
							_bool: Boolean[];
							/**
							 * @kind box[]
							 */
							_box: Box[];
							/**
							 * @kind character(1)[]
							 */
							_char: Character<1>[];
							/**
							 * @kind circle[]
							 */
							_circle: Circle[];
							/**
							 * @kind date[]
							 */
							_date: Date[];
							/**
							 * @kind daterange[]
							 */
							_daterange: DateRange[];
							/**
							 * @kind real[]
							 */
							_float4: Float4[];
							/**
							 * @kind double precision[]
							 */
							_float8: Float8[];
							/**
							 * @kind smallint[]
							 */
							_int2: Int2[];
							/**
							 * @kind integer[]
							 */
							_int4: Int4[];
							/**
							 * @kind int4multirange[]
							 */
							_int4multirange: Int4MultiRange[];
							/**
							 * @kind int4range[]
							 */
							_int4range: Int4Range[];
							/**
							 * @kind bigint[]
							 */
							_int8: Int8[];
							/**
							 * @kind int8multirange[]
							 */
							_int8multirange: Int8MultiRange[];
							/**
							 * @kind int8range[]
							 */
							_int8range: Int8Range[];
							/**
							 * @kind interval[]
							 */
							_interval: Interval[];
							/**
							 * @kind line[]
							 */
							_line: Line[];
							/**
							 * @kind lseg[]
							 */
							_lseg: LineSegment[];
							/**
							 * @kind money[]
							 */
							_money: Money[];
							/**
							 * @kind datemultirange[]
							 */
							_multidaterange: DateMultiRange[];
							/**
							 * @kind name[]
							 */
							_name: Name[];
							/**
							 * @kind oid[]
							 */
							_oid: OID[];
							/**
							 * @kind path[]
							 */
							_path: Path[];
							/**
							 * @kind point[]
							 */
							_point: Point[];
							/**
							 * @kind polygon[]
							 */
							_polygon: Polygon[];
							/**
							 * @kind text[]
							 */
							_text: Text[];
							/**
							 * @kind time without time zone[]
							 */
							_time: Time[];
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: Timestamp[];
							/**
							 * @kind tsmultirange[]
							 */
							_timestampmultirange: TimestampMultiRange[];
							/**
							 * @kind tsrange[]
							 */
							_timestamprange: TimestampRange[];
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: TimestampTZ[];
							/**
							 * @kind tstzmultirange[]
							 */
							_timestamptzmultirange: TimestampTZMultiRange[];
							/**
							 * @kind tstzrange[]
							 */
							_timestamptzrange: TimestampTZRange[];
							/**
							 * @kind time with time zone[]
							 */
							_timetz: TimeTZ[];
							/**
							 * @kind uuid[]
							 */
							_uuid: UUID[];
							/**
							 * @kind bit varying(5)[]
							 */
							_varbit: BitVarying<5>[];
							/**
							 * @kind character varying(1)[]
							 */
							_varchar: CharacterVarying<1>[];
							/**
							 * @kind bit(1)
							 */
							bit: Bit<1>;
							/**
							 * @kind boolean
							 */
							// eslint-disable-next-line @typescript-eslint/ban-types
							bool: Boolean;
							/**
							 * @kind box
							 */
							box: Box;
							/**
							 * @kind character(1)
							 */
							char: Character<1>;
							/**
							 * @kind circle
							 */
							circle: Circle;
							/**
							 * @kind date
							 */
							date: Date;
							/**
							 * @kind daterange
							 */
							daterange: DateRange;
							/**
							 * @kind real
							 */
							float4: Float4;
							/**
							 * @kind double precision
							 */
							float8: Float8;
							/**
							 * @kind smallint
							 */
							int2: Int2;
							/**
							 * @kind integer
							 */
							int4: Int4;
							/**
							 * @kind int4multirange
							 */
							int4multirange: Int4MultiRange;
							/**
							 * @kind int4range
							 */
							int4range: Int4Range;
							/**
							 * @kind bigint
							 */
							int8: Int8;
							/**
							 * @kind int8multirange
							 */
							int8multirange: Int8MultiRange;
							/**
							 * @kind int8range
							 */
							int8range: Int8Range;
							/**
							 * @kind interval
							 */
							interval: Interval;
							/**
							 * @kind line
							 */
							line: Line;
							/**
							 * @kind lseg
							 */
							lseg: LineSegment;
							/**
							 * @kind money
							 */
							money: Money;
							/**
							 * @kind datemultirange
							 */
							multidaterange: DateMultiRange;
							/**
							 * @kind name
							 */
							name: Name;
							/**
							 * @kind oid
							 */
							oid: OID;
							/**
							 * @kind path
							 */
							path: Path;
							/**
							 * @kind point
							 */
							point: Point;
							/**
							 * @kind polygon
							 */
							polygon: Polygon;
							/**
							 * @kind text
							 */
							text: Text;
							/**
							 * @kind time without time zone
							 */
							time: Time;
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: Timestamp;
							/**
							 * @kind tsmultirange
							 */
							timestampmultirange: TimestampMultiRange;
							/**
							 * @kind tsrange
							 */
							timestamprange: TimestampRange;
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: TimestampTZ;
							/**
							 * @kind tstzmultirange
							 */
							timestamptzmultirange: TimestampTZMultiRange;
							/**
							 * @kind tstzrange
							 */
							timestamptzrange: TimestampTZRange;
							/**
							 * @kind time with time zone
							 */
							timetz: TimeTZ;
							/**
							 * @kind uuid
							 */
							uuid: UUID;
							/**
							 * @kind bit varying(1)
							 */
							varbit: BitVarying<1>;
							/**
							 * @kind character varying(1)
							 */
							varchar: CharacterVarying<1>;
						};
						insert_parameters: {
							/**
							 * @kind bit(5)[]
							 */
							_bit: Bit<5>[];
							/**
							 * @kind boolean[]
							 */
							// eslint-disable-next-line @typescript-eslint/ban-types
							_bool: Boolean[];
							/**
							 * @kind box[]
							 */
							_box: Box[];
							/**
							 * @kind character(1)[]
							 */
							_char: Character<1>[];
							/**
							 * @kind circle[]
							 */
							_circle: Circle[];
							/**
							 * @kind date[]
							 */
							_date: Date[];
							/**
							 * @kind daterange[]
							 */
							_daterange: DateRange[];
							/**
							 * @kind real[]
							 */
							_float4: Float4[];
							/**
							 * @kind double precision[]
							 */
							_float8: Float8[];
							/**
							 * @kind smallint[]
							 */
							_int2: Int2[];
							/**
							 * @kind integer[]
							 */
							_int4: Int4[];
							/**
							 * @kind int4multirange[]
							 */
							_int4multirange: Int4MultiRange[];
							/**
							 * @kind int4range[]
							 */
							_int4range: Int4Range[];
							/**
							 * @kind bigint[]
							 */
							_int8: Int8[];
							/**
							 * @kind int8multirange[]
							 */
							_int8multirange: Int8MultiRange[];
							/**
							 * @kind int8range[]
							 */
							_int8range: Int8Range[];
							/**
							 * @kind interval[]
							 */
							_interval: Interval[];
							/**
							 * @kind line[]
							 */
							_line: Line[];
							/**
							 * @kind lseg[]
							 */
							_lseg: LineSegment[];
							/**
							 * @kind money[]
							 */
							_money: Money[];
							/**
							 * @kind datemultirange[]
							 */
							_multidaterange: DateMultiRange[];
							/**
							 * @kind name[]
							 */
							_name: Name[];
							/**
							 * @kind oid[]
							 */
							_oid: OID[];
							/**
							 * @kind path[]
							 */
							_path: Path[];
							/**
							 * @kind point[]
							 */
							_point: Point[];
							/**
							 * @kind polygon[]
							 */
							_polygon: Polygon[];
							/**
							 * @kind text[]
							 */
							_text: Text[];
							/**
							 * @kind time without time zone[],
							 */
							_time: Time[];
							/**
							 * @kind timestamp without time zone[],
							 */
							_timestamp: Timestamp[];
							/**
							 * @kind tsmultirange[]
							 */
							_timestampmultirange: TimestampMultiRange[];
							/**
							 * @kind tsrange[]
							 */
							_timestamprange: TimestampRange[];
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: TimestampTZ[];
							/**
							 * @kind tstzmultirange[]
							 */
							_timestamptzmultirange: TimestampTZMultiRange[];
							/**
							 * @kind tstzrange[]
							 */
							_timestamptzrange: TimestampTZRange[];
							/**
							 * @kind time with time zone[]
							 */
							_timetz: TimeTZ[];
							/**
							 * @kind uuid[]
							 */
							_uuid: UUID[];
							/**
							 * @kind bit varying(5)[]
							 */
							_varbit: BitVarying<5>[];
							/**
							 * @kind character varying(1)[]
							 */
							_varchar: CharacterVarying<1>[];
							/**
							 * @kind bit(1)
							 */
							bit: Bit<1>;
							/**
							 * @kind boolean
							 */
							// eslint-disable-next-line @typescript-eslint/ban-types
							bool: Boolean;
							/**
							 * @kind box
							 */
							box: Box;
							/**
							 * @kind character(1)
							 */
							char: Character<1>;
							/**
							 * @kind circle
							 */
							circle: Circle;
							/**
							 * @kind date
							 */
							date: Date;
							/**
							 * @kind daterange
							 */
							daterange: DateRange;
							/**
							 * @kind real
							 */
							float4: Float4;
							/**
							 * @kind double precision
							 */
							float8: Float8;
							/**
							 * @kind smallint
							 */
							int2: Int2;
							/**
							 * @kind integer
							 */
							int4: Int4;
							/**
							 * @kind int4multirange
							 */
							int4multirange: Int4MultiRange;
							/**
							 * @kind int4range
							 */
							int4range: Int4Range;
							/**
							 * @kind bigint
							 */
							int8: Int8;
							/**
							 * @kind int8multirange
							 */
							int8multirange: Int8MultiRange;
							/**
							 * @kind int8range
							 */
							int8range: Int8Range;
							/**
							 * @kind interval
							 */
							interval: Interval;
							/**
							 * @kind line
							 */
							line: Line;
							/**
							 * @kind lseg
							 */
							lseg: LineSegment;
							/**
							 * @kind money
							 */
							money: Money;
							/**
							 * @kind datemultirange
							 */
							multidaterange: DateMultiRange;
							/**
							 * @kind name
							 */
							name: Name;
							/**
							 * @kind oid
							 */
							oid: OID;
							/**
							 * @kind path
							 */
							path: Path;
							/**
							 * @kind point
							 */
							point: Point;
							/**
							 * @kind polygon
							 */
							polygon: Polygon;
							/**
							 * @kind text
							 */
							text: Text;
							/**
							 * @kind time without time zone
							 */
							time: Time;
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: Timestamp;
							/**
							 * @kind tsmultirange
							 */
							timestampmultirange: TimestampMultiRange;
							/**
							 * @kind tsrange
							 */
							timestamprange: TimestampRange;
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: TimestampTZ;
							/**
							 * @kind tstzmultirange
							 */
							timestamptzmultirange: TimestampTZMultiRange;
							/**
							 * @kind tstzrange
							 */
							timestamptzrange: TimestampTZRange;
							/**
							 * @kind time with time zone
							 */
							timetz: TimeTZ;
							/**
							 * @kind uuid
							 */
							uuid: UUID;
							/**
							 * @kind bit varying(1)
							 */
							varbit: BitVarying<1>;
							/**
							 * @kind character varying(1)
							 */
							varchar: CharacterVarying<1>;
						};
					};
				};
			};
		};
	};
};

export const testData = {
	db1: {
		name: "db1" as const,
		schemas: [
			{
				name: "schema1" as const,
				tables: [
					{
						name: "table1" as const,
						primary_key: "id" as const,
						columns: {
							/**
							 * @kind bit(5)[]
							 */
							_bit: PgTPParser(Bit.setN(5), true) as PgTPParserClass<BitConstructor<5>>,
							/**
							 * @kind boolean[]
							 */
							_bool: PgTPParser(Boolean, true) as PgTPParserClass<BooleanConstructor>,
							/**
							 * @kind box[]
							 */
							_box: PgTPParser(Box, true) as PgTPParserClass<BoxConstructor>,
							/**
							 * @kind character(1)[]
							 */
							_char: PgTPParser(Character.setN(1), true) as PgTPParserClass<CharacterConstructor<1>>,
							/**
							 * @kind circle[]
							 */
							_circle: PgTPParser(Circle, true) as PgTPParserClass<CircleConstructor>,
							/**
							 * @kind date[]
							 */
							_date: PgTPParser(Date, true) as PgTPParserClass<DateConstructor>,
							/**
							 * @kind daterange[]
							 */
							_daterange: PgTPParser(DateRange, true) as PgTPParserClass<DateRangeConstructor>,
							/**
							 * @kind real[]
							 */
							_float4: PgTPParser(Float4, true) as PgTPParserClass<Float4Constructor>,
							/**
							 * @kind double precision[]
							 */
							_float8: PgTPParser(Float8, true) as PgTPParserClass<Float8Constructor>,
							/**
							 * @kind smallint[]
							 */
							_int2: PgTPParser(Int2, true) as PgTPParserClass<Int2Constructor>,
							/**
							 * @kind integer[]
							 */
							_int4: PgTPParser(Int4, true) as PgTPParserClass<Int4Constructor>,
							/**
							 * @kind int4multirange[]
							 */
							_int4multirange: PgTPParser(Int4MultiRange, true) as PgTPParserClass<Int4MultiRangeConstructor>,
							/**
							 * @kind int4range[]
							 */
							_int4range: PgTPParser(Int4Range, true) as PgTPParserClass<Int4RangeConstructor>,
							/**
							 * @kind bigint[]
							 */
							_int8: PgTPParser(Int8, true) as PgTPParserClass<Int8Constructor>,
							/**
							 * @kind int8multirange[]
							 */
							_int8multirange: PgTPParser(Int8MultiRange, true) as PgTPParserClass<Int8MultiRangeConstructor>,
							/**
							 * @kind int8range[]
							 */
							_int8range: PgTPParser(Int8Range, true) as PgTPParserClass<Int8RangeConstructor>,
							/**
							 * @kind interval[]
							 */
							_interval: PgTPParser(Interval, true) as PgTPParserClass<IntervalConstructor>,
							/**
							 * @kind line[]
							 */
							_line: PgTPParser(Line, true) as PgTPParserClass<LineConstructor>,
							/**
							 * @kind lseg[]
							 */
							_lseg: PgTPParser(LineSegment, true) as PgTPParserClass<LineSegmentConstructor>,
							/**
							 * @kind money[]
							 */
							_money: PgTPParser(Money, true) as PgTPParserClass<MoneyConstructor>,
							/**
							 * @kind datemultirange[]
							 */
							_multidaterange: PgTPParser(DateMultiRange, true) as PgTPParserClass<DateMultiRangeConstructor>,
							/**
							 * @kind name[]
							 */
							_name: PgTPParser(Name, true) as PgTPParserClass<NameConstructor>,
							/**
							 * @kind oid[]
							 */
							_oid: PgTPParser(OID, true) as PgTPParserClass<OIDConstructor>,
							/**
							 * @kind path[]
							 */
							_path: PgTPParser(Path, true) as PgTPParserClass<PathConstructor>,
							/**
							 * @kind point[]
							 */
							_point: PgTPParser(Point, true) as PgTPParserClass<PointConstructor>,
							/**
							 * @kind polygon[]
							 */
							_polygon: PgTPParser(Polygon, true) as PgTPParserClass<PolygonConstructor>,
							/**
							 * @kind text[]
							 */
							_text: PgTPParser(Text, true) as PgTPParserClass<TextConstructor>,
							/**
							 * @kind time without time zone[]
							 */
							_time: PgTPParser(Time, true) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: PgTPParser(Timestamp, true) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind tsmultirange[]
							 */
							_timestampmultirange: PgTPParser(TimestampMultiRange, true) as PgTPParserClass<TimestampMultiRangeConstructor>,
							/**
							 * @kind tsrange[]
							 */
							_timestamprange: PgTPParser(TimestampRange, true) as PgTPParserClass<TimestampRangeConstructor>,
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: PgTPParser(TimestampTZ, true) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind tstzmultirange[]
							 */
							_timestamptzmultirange: PgTPParser(TimestampTZMultiRange, true) as PgTPParserClass<TimestampTZMultiRangeConstructor>,
							/**
							 * @kind tstzrange[]
							 */
							_timestamptzrange: PgTPParser(TimestampTZRange, true) as PgTPParserClass<TimestampTZRangeConstructor>,
							/**
							 * @kind time with time zone[]
							 */
							_timetz: PgTPParser(TimeTZ, true) as PgTPParserClass<TimeTZConstructor>,
							/**
							 * @kind uuid[]
							 */
							_uuid: PgTPParser(UUID, true) as PgTPParserClass<UUIDConstructor>,
							/**
							 * @kind bit varying(5)[]
							 */
							_varbit: PgTPParser(BitVarying.setN(5), true) as PgTPParserClass<BitVaryingConstructor<5>>,
							/**
							 * @kind character varying(1)[]
							 */
							_varchar: PgTPParser(CharacterVarying.setN(1), true) as PgTPParserClass<CharacterVaryingConstructor<1>>,
							/**
							 * @kind bit(1)
							 */
							bit: PgTPParser(Bit.setN(1)) as PgTPParserClass<BitConstructor<1>>,
							/**
							 * @kind boolean
							 */
							bool: PgTPParser(Boolean) as PgTPParserClass<BooleanConstructor>,
							/**
							 * @kind box
							 */
							box: PgTPParser(Box) as PgTPParserClass<BoxConstructor>,
							/**
							 * @kind character(1)
							 */
							char: PgTPParser(Character.setN(1)) as PgTPParserClass<CharacterConstructor<1>>,
							/**
							 * @kind circle
							 */
							circle: PgTPParser(Circle) as PgTPParserClass<CircleConstructor>,
							/**
							 * @kind date
							 */
							date: PgTPParser(Date) as PgTPParserClass<DateConstructor>,
							/**
							 * @kind daterange
							 */
							daterange: PgTPParser(DateRange) as PgTPParserClass<DateRangeConstructor>,
							/**
							 * @kind real
							 */
							float4: PgTPParser(Float4) as PgTPParserClass<Float4Constructor>,
							/**
							 * @kind double precision
							 */
							float8: PgTPParser(Float8) as PgTPParserClass<Float8Constructor>,
							/**
							 * @kind smallint
							 */
							int2: PgTPParser(Int2) as PgTPParserClass<Int2Constructor>,
							/**
							 * @kind integer
							 */
							int4: PgTPParser(Int4) as PgTPParserClass<Int4Constructor>,
							/**
							 * @kind int4multirange
							 */
							int4multirange: PgTPParser(Int4MultiRange) as PgTPParserClass<Int4MultiRangeConstructor>,
							/**
							 * @kind int4range
							 */
							int4range: PgTPParser(Int4Range) as PgTPParserClass<Int4RangeConstructor>,
							/**
							 * @kind bigint
							 */
							int8: PgTPParser(Int8) as PgTPParserClass<Int8Constructor>,
							/**
							 * @kind int8multirange
							 */
							int8multirange: PgTPParser(Int8MultiRange) as PgTPParserClass<Int8MultiRangeConstructor>,
							/**
							 * @kind int8range
							 */
							int8range: PgTPParser(Int8Range) as PgTPParserClass<Int8RangeConstructor>,
							/**
							 * @kind interval
							 */
							interval: PgTPParser(Interval) as PgTPParserClass<IntervalConstructor>,
							/**
							 * @kind line
							 */
							line: PgTPParser(Line) as PgTPParserClass<LineConstructor>,
							/**
							 * @kind lseg
							 */
							lseg: PgTPParser(LineSegment) as PgTPParserClass<LineSegmentConstructor>,
							/**
							 * @kind money
							 */
							money: PgTPParser(Money) as PgTPParserClass<MoneyConstructor>,
							/**
							 * @kind datemultirange
							 */
							multidaterange: PgTPParser(DateMultiRange) as PgTPParserClass<DateMultiRangeConstructor>,
							/**
							 * @kind name
							 */
							name: PgTPParser(Name) as PgTPParserClass<NameConstructor>,
							/**
							 * @kind oid
							 */
							oid: PgTPParser(OID) as PgTPParserClass<OIDConstructor>,
							/**
							 * @kind path
							 */
							path: PgTPParser(Path) as PgTPParserClass<PathConstructor>,
							/**
							 * @kind point
							 */
							point: PgTPParser(Point) as PgTPParserClass<PointConstructor>,
							/**
							 * @kind polygon
							 */
							polygon: PgTPParser(Polygon) as PgTPParserClass<PolygonConstructor>,
							/**
							 * @kind text
							 */
							text: PgTPParser(Text) as PgTPParserClass<TextConstructor>,
							/**
							 * @kind time without time zone
							 */
							time: PgTPParser(Time) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: PgTPParser(Timestamp) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind tsmultirange
							 */
							timestampmultirange: PgTPParser(TimestampMultiRange) as PgTPParserClass<TimestampMultiRangeConstructor>,
							/**
							 * @kind tsrange
							 */
							timestamprange: PgTPParser(TimestampRange) as PgTPParserClass<TimestampRangeConstructor>,
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: PgTPParser(TimestampTZ) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind tstzmultirange
							 */
							timestamptzmultirange: PgTPParser(TimestampTZMultiRange) as PgTPParserClass<TimestampTZMultiRangeConstructor>,
							/**
							 * @kind tstzrange
							 */
							timestamptzrange: PgTPParser(TimestampTZRange) as PgTPParserClass<TimestampTZRangeConstructor>,
							/**
							 * @kind time with time zone
							 */
							timetz: PgTPParser(TimeTZ) as PgTPParserClass<TimeTZConstructor>,
							/**
							 * @kind uuid
							 */
							uuid: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
							/**
							 * @kind bit varying(1)
							 */
							varbit: PgTPParser(BitVarying.setN(1)) as PgTPParserClass<BitVaryingConstructor<1>>,
							/**
							 * @kind character varying(1)
							 */
							varchar: PgTPParser(CharacterVarying.setN(1)) as PgTPParserClass<CharacterVaryingConstructor<1>>,
						},
						insert_parameters: {
							/**
							 * @kind bit(5)[]
							 */
							_bit: PgTPParser(Bit.setN(5), true) as PgTPParserClass<BitConstructor<5>>,
							/**
							 * @kind boolean[]
							 */
							_bool: PgTPParser(Boolean, true) as PgTPParserClass<BooleanConstructor>,
							/**
							 * @kind box[]
							 */
							_box: PgTPParser(Box, true) as PgTPParserClass<BoxConstructor>,
							/**
							 * @kind character(1)[]
							 */
							_char: PgTPParser(Character.setN(1), true) as PgTPParserClass<CharacterConstructor<1>>,
							/**
							 * @kind circle[]
							 */
							_circle: PgTPParser(Circle, true) as PgTPParserClass<CircleConstructor>,
							/**
							 * @kind date[]
							 */
							_date: PgTPParser(Date, true) as PgTPParserClass<DateConstructor>,
							/**
							 * @kind daterange[]
							 */
							_daterange: PgTPParser(DateRange, true) as PgTPParserClass<DateRangeConstructor>,
							/**
							 * @kind real[]
							 */
							_float4: PgTPParser(Float4, true) as PgTPParserClass<Float4Constructor>,
							/**
							 * @kind double precision[]
							 */
							_float8: PgTPParser(Float8, true) as PgTPParserClass<Float8Constructor>,
							/**
							 * @kind smallint[]
							 */
							_int2: PgTPParser(Int2, true) as PgTPParserClass<Int2Constructor>,
							/**
							 * @kind integer[]
							 */
							_int4: PgTPParser(Int4, true) as PgTPParserClass<Int4Constructor>,
							/**
							 * @kind int4multirange[]
							 */
							_int4multirange: PgTPParser(Int4MultiRange, true) as PgTPParserClass<Int4MultiRangeConstructor>,
							/**
							 * @kind int4range[]
							 */
							_int4range: PgTPParser(Int4Range, true) as PgTPParserClass<Int4RangeConstructor>,
							/**
							 * @kind bigint[]
							 */
							_int8: PgTPParser(Int8, true) as PgTPParserClass<Int8Constructor>,
							/**
							 * @kind int8multirange[]
							 */
							_int8multirange: PgTPParser(Int8MultiRange, true) as PgTPParserClass<Int8MultiRangeConstructor>,
							/**
							 * @kind int8range[]
							 */
							_int8range: PgTPParser(Int8Range, true) as PgTPParserClass<Int8RangeConstructor>,
							/**
							 * @kind interval[]
							 */
							_interval: PgTPParser(Interval, true) as PgTPParserClass<IntervalConstructor>,
							/**
							 * @kind line[]
							 */
							_line: PgTPParser(Line, true) as PgTPParserClass<LineConstructor>,
							/**
							 * @kind lseg[]
							 */
							_lseg: PgTPParser(LineSegment, true) as PgTPParserClass<LineSegmentConstructor>,
							/**
							 * @kind money[]
							 */
							_money: PgTPParser(Money, true) as PgTPParserClass<MoneyConstructor>,
							/**
							 * @kind datemultirange[]
							 */
							_multidaterange: PgTPParser(DateMultiRange, true) as PgTPParserClass<DateMultiRangeConstructor>,
							/**
							 * @kind name[]
							 */
							_name: PgTPParser(Name, true) as PgTPParserClass<NameConstructor>,
							/**
							 * @kind oid[]
							 */
							_oid: PgTPParser(OID, true) as PgTPParserClass<OIDConstructor>,
							/**
							 * @kind path[]
							 */
							_path: PgTPParser(Path, true) as PgTPParserClass<PathConstructor>,
							/**
							 * @kind point[]
							 */
							_point: PgTPParser(Point, true) as PgTPParserClass<PointConstructor>,
							/**
							 * @kind polygon[]
							 */
							_polygon: PgTPParser(Polygon, true) as PgTPParserClass<PolygonConstructor>,
							/**
							 * @kind text[]
							 */
							_text: PgTPParser(Text, true) as PgTPParserClass<TextConstructor>,
							/**
							 * @kind time without time zone[]
							 */
							_time: PgTPParser(Time, true) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: PgTPParser(Timestamp, true) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind tsmultirange[]
							 */
							_timestampmultirange: PgTPParser(TimestampMultiRange, true) as PgTPParserClass<TimestampMultiRangeConstructor>,
							/**
							 * @kind tsrange[]
							 */
							_timestamprange: PgTPParser(TimestampRange, true) as PgTPParserClass<TimestampRangeConstructor>,
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: PgTPParser(TimestampTZ, true) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind tstzmultirange[]
							 */
							_timestamptzmultirange: PgTPParser(TimestampTZMultiRange, true) as PgTPParserClass<TimestampTZMultiRangeConstructor>,
							/**
							 * @kind tstzrange[]
							 */
							_timestamptzrange: PgTPParser(TimestampTZRange, true) as PgTPParserClass<TimestampTZRangeConstructor>,
							/**
							 * @kind time with time zone[]
							 */
							_timetz: PgTPParser(TimeTZ, true) as PgTPParserClass<TimeTZConstructor>,
							/**
							 * @kind uuid[]
							 */
							_uuid: PgTPParser(UUID, true) as PgTPParserClass<UUIDConstructor>,
							/**
							 * @kind bit varying(5)[]
							 */
							_varbit: PgTPParser(BitVarying.setN(5), true) as PgTPParserClass<BitVaryingConstructor<5>>,
							/**
							 * @kind character varying(1)[]
							 */
							_varchar: PgTPParser(CharacterVarying.setN(1), true) as PgTPParserClass<CharacterVaryingConstructor<1>>,
							/**
							 * @kind bit(1)
							 */
							bit: PgTPParser(Bit.setN(1)) as PgTPParserClass<BitConstructor<1>>,
							/**
							 * @kind boolean
							 */
							bool: PgTPParser(Boolean) as PgTPParserClass<BooleanConstructor>,
							/**
							 * @kind box
							 */
							box: PgTPParser(Box) as PgTPParserClass<BoxConstructor>,
							/**
							 * @kind character(1)
							 */
							char: PgTPParser(Character.setN(1)) as PgTPParserClass<CharacterConstructor<1>>,
							/**
							 * @kind circle
							 */
							circle: PgTPParser(Circle) as PgTPParserClass<CircleConstructor>,
							/**
							 * @kind date
							 */
							date: PgTPParser(Date) as PgTPParserClass<DateConstructor>,
							/**
							 * @kind daterange
							 */
							daterange: PgTPParser(DateRange) as PgTPParserClass<DateRangeConstructor>,
							/**
							 * @kind real
							 */
							float4: PgTPParser(Float4) as PgTPParserClass<Float4Constructor>,
							/**
							 * @kind double precision
							 */
							float8: PgTPParser(Float8) as PgTPParserClass<Float8Constructor>,
							/**
							 * @kind smallint
							 */
							int2: PgTPParser(Int2) as PgTPParserClass<Int2Constructor>,
							/**
							 * @kind integer
							 */
							int4: PgTPParser(Int4) as PgTPParserClass<Int4Constructor>,
							/**
							 * @kind int4multirange
							 */
							int4multirange: PgTPParser(Int4MultiRange) as PgTPParserClass<Int4MultiRangeConstructor>,
							/**
							 * @kind int4range
							 */
							int4range: PgTPParser(Int4Range) as PgTPParserClass<Int4RangeConstructor>,
							/**
							 * @kind bigint
							 */
							int8: PgTPParser(Int8) as PgTPParserClass<Int8Constructor>,
							/**
							 * @kind int8multirange
							 */
							int8multirange: PgTPParser(Int8MultiRange) as PgTPParserClass<Int8MultiRangeConstructor>,
							/**
							 * @kind int8range
							 */
							int8range: PgTPParser(Int8Range) as PgTPParserClass<Int8RangeConstructor>,
							/**
							 * @kind interval
							 */
							interval: PgTPParser(Interval) as PgTPParserClass<IntervalConstructor>,
							/**
							 * @kind line
							 */
							line: PgTPParser(Line) as PgTPParserClass<LineConstructor>,
							/**
							 * @kind lseg
							 */
							lseg: PgTPParser(LineSegment) as PgTPParserClass<LineSegmentConstructor>,
							/**
							 * @kind money
							 */
							money: PgTPParser(Money) as PgTPParserClass<MoneyConstructor>,
							/**
							 * @kind datemultirange
							 */
							multidaterange: PgTPParser(DateMultiRange) as PgTPParserClass<DateMultiRangeConstructor>,
							/**
							 * @kind name
							 */
							name: PgTPParser(Name) as PgTPParserClass<NameConstructor>,
							/**
							 * @kind oid
							 */
							oid: PgTPParser(OID) as PgTPParserClass<OIDConstructor>,
							/**
							 * @kind path
							 */
							path: PgTPParser(Path) as PgTPParserClass<PathConstructor>,
							/**
							 * @kind point
							 */
							point: PgTPParser(Point) as PgTPParserClass<PointConstructor>,
							/**
							 * @kind polygon
							 */
							polygon: PgTPParser(Polygon) as PgTPParserClass<PolygonConstructor>,
							/**
							 * @kind text
							 */
							text: PgTPParser(Text) as PgTPParserClass<TextConstructor>,
							/**
							 * @kind time without time zone
							 */
							time: PgTPParser(Time) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: PgTPParser(Timestamp) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind tsmultirange
							 */
							timestampmultirange: PgTPParser(TimestampMultiRange) as PgTPParserClass<TimestampMultiRangeConstructor>,
							/**
							 * @kind tsrange
							 */
							timestamprange: PgTPParser(TimestampRange) as PgTPParserClass<TimestampRangeConstructor>,
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: PgTPParser(TimestampTZ) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind tstzmultirange
							 */
							timestamptzmultirange: PgTPParser(TimestampTZMultiRange) as PgTPParserClass<TimestampTZMultiRangeConstructor>,
							/**
							 * @kind tstzrange
							 */
							timestamptzrange: PgTPParser(TimestampTZRange) as PgTPParserClass<TimestampTZRangeConstructor>,
							/**
							 * @kind time with time zone
							 */
							timetz: PgTPParser(TimeTZ) as PgTPParserClass<TimeTZConstructor>,
							/**
							 * @kind uuid
							 */
							uuid: PgTPParser(UUID) as PgTPParserClass<UUIDConstructor>,
							/**
							 * @kind bit varying(1)
							 */
							varbit: PgTPParser(BitVarying.setN(1)) as PgTPParserClass<BitVaryingConstructor<1>>,
							/**
							 * @kind character varying(1)
							 */
							varchar: PgTPParser(CharacterVarying.setN(1)) as PgTPParserClass<CharacterVaryingConstructor<1>>,
						},
					},
				],
			},
		],
	},
};
