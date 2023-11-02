import { ColumnDataType } from "drizzle-orm";

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
	infer TDriverParameter,
	infer TColumnType,
	infer TDataType,
	infer TEnumValues
>
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTBitType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTBitVaryingType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTBooleanType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTCharacterType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTCharacterVaryingType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTNameType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTextType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTDateType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTDateMultiRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTDateRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTIntervalType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimestampType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimestampMultiRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimestampRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimestampTZType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimestampTZMultiRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimestampTZRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTTimeTZType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTEnumType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTBoxType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTCircleType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTLineType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTLineSegmentType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTPathType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTPointType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTPolygonType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTJSONType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTJSONBType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTMoneyType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTFloat4Type<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTFloat8Type<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt2Type<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt4Type<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt4MultiRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt4RangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt8Type<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt8MultiRangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTInt8RangeType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTOIDType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: TType extends PgTUUIDType<
			infer TTableName,
			infer TName,
			any,
			infer TNotNull,
			infer THasDefault,
			infer TData,
			infer TDriverParameter,
			infer TColumnType,
			infer TDataType,
			infer TEnumValues
	  >
	? PgTArray<
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				data: TData[];
				driverParam: TDriverParameter[] | string;
				columnType: "PgTArray";
				dataType: "array";
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			},
			{
				tableName: TTableName extends string ? TTableName : never;
				name: TName extends string ? TName : never;
				data: TData;
				driverParam: TDriverParameter;
				notNull: TNotNull extends boolean ? TNotNull : never;
				hasDefault: THasDefault extends boolean ? THasDefault : never;
				columnType: TColumnType extends string ? TColumnType : never;
				dataType: TDataType extends ColumnDataType ? TDataType : never;
				enumValues: TEnumValues extends undefined ? TEnumValues : never;
			}
	  >
	: never;
