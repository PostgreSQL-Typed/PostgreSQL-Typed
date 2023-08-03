import { OID } from "@postgresql-typed/oids";
import type { PostgreSQLTypedCLIConfig } from "@postgresql-typed/util";

import { DataTypeKind } from "../../../types/enums/DataTypeKind.js";
import type { DataType } from "../../../types/types/DataType.js";

export function getModeOfOid(oid: number, config: PostgreSQLTypedCLIConfig, type?: DataType): string {
	const {
		files: { definerModes },
	} = config;
	if (type?.kind === DataTypeKind.Enum) return definerModes.enum;
	switch (oid) {
		case OID._bit:
		case OID.bit:
			return definerModes.bit;
		case OID._varbit:
		case OID.varbit:
			return definerModes.bitVarying;
		case OID._bool:
		case OID.bool:
			return definerModes.boolean;
		case OID._box:
		case OID.box:
			return definerModes.box;
		case OID._bytea:
		case OID.bytea:
			return definerModes.bytea;
		case OID._char:
		case OID.char:
		case OID._bpchar:
		case OID.bpchar:
			return definerModes.character;
		case OID._varchar:
		case OID.varchar:
			return definerModes.characterVarying;
		case OID._circle:
		case OID.circle:
			return definerModes.circle;
		case OID._date:
		case OID.date:
			return definerModes.date;
		case OID._datemultirange:
		case OID.datemultirange:
			return definerModes.dateMultiRange;
		case OID._daterange:
		case OID.daterange:
			return definerModes.dateRange;
		case OID._float4:
		case OID.float4:
			return definerModes.float4;
		case OID._float8:
		case OID.float8:
			return definerModes.float8;
		case OID._int2:
		case OID.int2:
			return definerModes.int2;
		case OID._int4:
		case OID.int4:
			return definerModes.int4;
		case OID._int4multirange:
		case OID.int4multirange:
			return definerModes.int4MultiRange;
		case OID._int4range:
		case OID.int4range:
			return definerModes.int4Range;
		case OID._int8:
		case OID.int8:
			return definerModes.int8;
		case OID._int8multirange:
		case OID.int8multirange:
			return definerModes.int8MultiRange;
		case OID._int8range:
		case OID.int8range:
			return definerModes.int8Range;
		case OID._interval:
		case OID.interval:
			return definerModes.interval;
		case OID._json:
		case OID.json:
			return definerModes.json;
		case OID._jsonb:
		case OID.jsonb:
			return definerModes.jsonb;
		case OID._line:
		case OID.line:
			return definerModes.line;
		case OID._lseg:
		case OID.lseg:
			return definerModes.lineSegment;
		case OID._money:
		case OID.money:
			return definerModes.money;
		case OID._name:
		case OID.name:
			return definerModes.name;
		case OID._oid:
		case OID.oid:
			return definerModes.oid;
		case OID._path:
		case OID.path:
			return definerModes.path;
		case OID._point:
		case OID.point:
			return definerModes.point;
		case OID._polygon:
		case OID.polygon:
			return definerModes.polygon;
		case OID._text:
		case OID.text:
			return definerModes.text;
		case OID._time:
		case OID.time:
			return definerModes.time;
		case OID._timetz:
		case OID.timetz:
			return definerModes.timetz;
		case OID._timestamp:
		case OID.timestamp:
			return definerModes.timestamp;
		case OID._timestamptz:
		case OID.timestamptz:
			return definerModes.timestamptz;
		case OID._tsmultirange:
		case OID.tsmultirange:
			return definerModes.timestampMultiRange;
		case OID._tsrange:
		case OID.tsrange:
			return definerModes.timestampRange;
		case OID._tstzmultirange:
		case OID.tstzmultirange:
			return definerModes.timestamptzMultiRange;
		case OID._tstzrange:
		case OID.tstzrange:
			return definerModes.timestamptzRange;
		case OID._uuid:
		case OID.uuid:
			return definerModes.uuid;
		default:
			return "unknown";
	}
}
