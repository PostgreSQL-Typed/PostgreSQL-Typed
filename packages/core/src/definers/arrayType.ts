import type { PgTArray } from "../array.js";
import type { PgTByteAType } from "./Binary/ByteA.js";
import type { PgTBitType } from "./BitString/Bit.js";
import type { PgTBitVaryingType } from "./BitString/BitVarying.js";
import type { PgTBooleanType } from "./Boolean/Boolean.js";
import type { PgTCharacterType } from "./Character/Character.js";
import type { PgTCharacterVaryingType } from "./Character/CharacterVarying.js";
import type { PgTNameType } from "./Character/Name.js";
import type { PgTTextType } from "./Character/Text.js";
import type { PgTDateType } from "./DateTime/Date.js";
import type { PgTDateMultiRangeType } from "./DateTime/DateMultiRange.js";
import type { PgTDateRangeType } from "./DateTime/DateRange.js";
import type { PgTIntervalType } from "./DateTime/Interval.js";
import type { PgTTimeType } from "./DateTime/Time.js";
import type { PgTTimestampType } from "./DateTime/Timestamp.js";
import type { PgTTimestampMultiRangeType } from "./DateTime/TimestampMultiRange.js";
import type { PgTTimestampRangeType } from "./DateTime/TimestampRange.js";
import type { PgTTimestampTZType } from "./DateTime/TimestampTZ.js";
import type { PgTTimestampTZMultiRangeType } from "./DateTime/TimestampTZMultiRange.js";
import type { PgTTimestampTZRangeType } from "./DateTime/TimestampTZRange.js";
import type { PgTTimeTZType } from "./DateTime/TimeTZ.js";
import type { PgTEnumType } from "./Enumerated/Enum.js";
import type { PgTBoxType } from "./Geometric/Box.js";
import type { PgTCircleType } from "./Geometric/Circle.js";
import type { PgTLineType } from "./Geometric/Line.js";
import type { PgTLineSegmentType } from "./Geometric/LineSegment.js";
import type { PgTPathType } from "./Geometric/Path.js";
import type { PgTPointType } from "./Geometric/Point.js";
import type { PgTPolygonType } from "./Geometric/Polygon.js";
import type { PgTJSONType } from "./JSON/JSON.js";
import type { PgTJSONBType } from "./JSON/JSON-B.js";
import type { PgTMoneyType } from "./Monetary/Money.js";
import type { PgTFloat4Type } from "./Numeric/Float4.js";
import type { PgTFloat8Type } from "./Numeric/Float8.js";
import type { PgTInt2Type } from "./Numeric/Int2.js";
import type { PgTInt4Type } from "./Numeric/Int4.js";
import type { PgTInt4MultiRangeType } from "./Numeric/Int4MultiRange.js";
import type { PgTInt4RangeType } from "./Numeric/Int4Range.js";
import type { PgTInt8Type } from "./Numeric/Int8.js";
import type { PgTInt8MultiRangeType } from "./Numeric/Int8MultiRange.js";
import type { PgTInt8RangeType } from "./Numeric/Int8Range.js";
import type { PgTOIDType } from "./ObjectIdentifier/OID.js";
import type { PgTUUIDType } from "./UUID/UUID.js";

export type PgTArrayOfType<TType> = TType extends PgTByteAType<
	infer TTableName,
	infer TName,
	any,
	infer TNotNull,
	infer THasDefault,
	infer TData,
	infer TDriverParameter
>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTBitType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTBitVaryingType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTBooleanType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTCharacterType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTCharacterVaryingType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTNameType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTextType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTDateType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTDateMultiRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTDateRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTIntervalType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimestampType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimestampMultiRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimestampRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimestampTZType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimestampTZMultiRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimestampTZRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTTimeTZType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTEnumType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTBoxType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTCircleType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTLineType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTLineSegmentType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTPathType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTPointType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTPolygonType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTJSONType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTJSONBType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTMoneyType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTFloat4Type<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTFloat8Type<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt2Type<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt4Type<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt4MultiRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt4RangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt8Type<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt8MultiRangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTInt8RangeType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTOIDType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: TType extends PgTUUIDType<infer TTableName, infer TName, any, infer TNotNull, infer THasDefault, infer TData, infer TDriverParameter>
	? PgTArray<{
			tableName: TTableName;
			name: TName;
			notNull: TNotNull;
			hasDefault: THasDefault;
			data: TData[];
			driverParam: TDriverParameter[] | string;
	  }>
	: never;
