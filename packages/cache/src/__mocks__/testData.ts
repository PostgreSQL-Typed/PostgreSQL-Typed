import { PgInsertValue, table } from "@postgresql-typed/core";
import {
	defineBit,
	defineBitVarying,
	defineBoolean,
	defineBox,
	defineCharacter,
	defineCharacterVarying,
	defineCircle,
	defineDate,
	defineFloat4,
	defineFloat8,
	defineInt2,
	defineInt4,
	defineInt8,
	defineInterval,
	defineLine,
	defineLineSegment,
	defineMoney,
	defineName,
	defineOID,
	definePath,
	definePoint,
	definePolygon,
	defineText,
	defineTime,
	defineTimestamp,
	defineTimestampTZ,
	defineTimeTZ,
	defineUUID,
} from "@postgresql-typed/core/definers";

export const TestTable = table("cache_testing", {
	bit: defineBit("bit", { length: 1 }).notNull(),
	_bit: defineBit("_bit", { length: 1 }).array().notNull(),
	varbit: defineBitVarying("varbit", { length: 1 }).notNull(),
	_varbit: defineBitVarying("_varbit", { length: 1 }).array().notNull(),
	bool: defineBoolean("bool").notNull(),
	_bool: defineBoolean("_bool").array().notNull(),
	box: defineBox("box").notNull(),
	_box: defineBox("_box").array().notNull(),
	char: defineCharacter("char", { length: 1 }).notNull(),
	_char: defineCharacter("_char", { length: 1 }).array().notNull(),
	varchar: defineCharacterVarying("varchar", { length: 1 }).notNull(),
	_varchar: defineCharacterVarying("_varchar", { length: 1 }).array().notNull(),
	circle: defineCircle("circle").notNull(),
	_circle: defineCircle("_circle").array().notNull(),
	date: defineDate("date", { mode: "string" }).notNull(),
	_date: defineDate("_date", {
		mode: "string",
	})
		.array()
		.notNull(),
	float4: defineFloat4("float4").notNull(),
	_float4: defineFloat4("_float4").array().notNull(),
	float8: defineFloat8("float8").notNull(),
	_float8: defineFloat8("_float8").array().notNull(),
	int2: defineInt2("int2").notNull(),
	_int2: defineInt2("_int2").array().notNull(),
	int4: defineInt4("int4").notNull(),
	_int4: defineInt4("_int4").array().notNull(),
	int8: defineInt8("int8").notNull(),
	_int8: defineInt8("_int8").array().notNull(),
	interval: defineInterval("interval").notNull(),
	_interval: defineInterval("_interval").array().notNull(),
	line: defineLine("line").notNull(),
	_line: defineLine("_line").array().notNull(),
	lseg: defineLineSegment("lseg").notNull(),
	_lseg: defineLineSegment("_lseg").array().notNull(),
	money: defineMoney("money").notNull(),
	_money: defineMoney("_money").array().notNull(),
	name: defineName("name").notNull(),
	_name: defineName("_name").array().notNull(),
	oid: defineOID("oid").notNull(),
	_oid: defineOID("_oid").array().notNull(),
	path: definePath("path").notNull(),
	_path: definePath("_path").array().notNull(),
	point: definePoint("point").notNull(),
	_point: definePoint("_point").array().notNull(),
	polygon: definePolygon("polygon").notNull(),
	_polygon: definePolygon("_polygon").array().notNull(),
	text: defineText("text", { mode: "string" }).notNull(),
	_text: defineText("_text", { mode: "string" }).array().notNull(),
	time: defineTime("time", { mode: "string" }).notNull(),
	_time: defineTime("_time", { mode: "string" }).array().notNull(),
	timestamp: defineTimestamp("timestamp", { mode: "string" }).notNull(),
	_timestamp: defineTimestamp("_timestamp", { mode: "string" }).array().notNull(),
	timestamptz: defineTimestampTZ("timestamptz", { mode: "string" }).notNull(),
	_timestamptz: defineTimestampTZ("_timestamptz", { mode: "string" }).array().notNull(),
	timetz: defineTimeTZ("timetz", { mode: "string" }).notNull(),
	_timetz: defineTimeTZ("_timetz", { mode: "string" }).array().notNull(),
	uuid: defineUUID("uuid").notNull(),
	_uuid: defineUUID("_uuid").array().notNull(),
});

export const createTable = `
CREATE TABLE IF NOT EXISTS cache_testing (
  bit BIT(1) NOT NULL,
  _bit BIT(1)[] NOT NULL,
  varbit BIT VARYING(1) NOT NULL,
  _varbit BIT VARYING(1)[] NOT NULL,
  bool BOOLEAN NOT NULL,
  _bool BOOLEAN[] NOT NULL,
  box BOX NOT NULL,
  _box BOX[] NOT NULL,
  char CHAR(1) NOT NULL,
  _char CHAR(1)[] NOT NULL,
  varchar CHARACTER VARYING(1) NOT NULL,
  _varchar CHARACTER VARYING(1)[] NOT NULL,
  circle CIRCLE NOT NULL,
  _circle CIRCLE[] NOT NULL,
  date DATE NOT NULL,
  _date DATE[] NOT NULL,
  float4 FLOAT4 NOT NULL,
  _float4 FLOAT4[] NOT NULL,
  float8 FLOAT8 NOT NULL,
  _float8 FLOAT8[] NOT NULL,
  int2 INT2 NOT NULL,
  _int2 INT2[] NOT NULL,
  int4 INT4 NOT NULL,
  _int4 INT4[] NOT NULL,
  int8 INT8 NOT NULL,
  _int8 INT8[] NOT NULL,
  interval INTERVAL NOT NULL,
  _interval INTERVAL[] NOT NULL,
  line LINE NOT NULL,
  _line LINE[] NOT NULL,
  lseg LSEG NOT NULL,
  _lseg LSEG[] NOT NULL,
  money MONEY NOT NULL,
  _money MONEY[] NOT NULL,
  name NAME NOT NULL,
  _name NAME[] NOT NULL,
  oid OID NOT NULL,
  _oid OID[] NOT NULL,
  path PATH NOT NULL,
  _path PATH[] NOT NULL,
  point POINT NOT NULL,
  _point POINT[] NOT NULL,
  polygon POLYGON NOT NULL,
  _polygon POLYGON[] NOT NULL,
  text TEXT NOT NULL,
  _text TEXT[] NOT NULL,
  time TIME NOT NULL,
  _time TIME[] NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  _timestamp TIMESTAMP[] NOT NULL,
  timestamptz TIMESTAMPTZ NOT NULL,
  _timestamptz TIMESTAMPTZ[] NOT NULL,
  timetz TIMETZ NOT NULL,
  _timetz TIMETZ[] NOT NULL,
  uuid UUID NOT NULL,
  _uuid UUID[] NOT NULL
);`;

export const dropTable = `
DROP TABLE IF EXISTS cache_testing;
`;

export const insertQuery: PgInsertValue<typeof TestTable> = {
	bit: "1",
	_bit: ["1", "0"],
	varbit: "1",
	_varbit: ["1", "0"],
	bool: true,
	_bool: [true, false],
	box: "((0,0),(1,1))",
	_box: ["((0,0),(1,1))", "((0,0),(1,1))"],
	char: "a",
	_char: ["a", "b"],
	varchar: "a",
	_varchar: ["a", "b"],
	circle: "<(0,0),1>",
	_circle: ["<(0,0),1>", "<(0,0),1>"],
	date: "2020-01-01",
	_date: ["2020-01-01", "2020-01-02"],
	float4: 1.1,
	_float4: [1.1, 2.2],
	float8: 1.1,
	_float8: [1.1, 2.2],
	int2: 1,
	_int2: [1, 2],
	int4: 1,
	_int4: [1, 2],
	int8: 1,
	_int8: [1, 2],
	interval: "1 day",
	_interval: ["1 day", "2 days"],
	line: "{1.1,2.2,3.3}",
	_line: ["{1.1,2.2,3.3}", "{1.1,2.2,3.3}"],
	lseg: "[(0,0),(1,1)]",
	_lseg: ["[(0,0),(1,1)]", "[(0,0),(1,1)]"],
	money: 1.1,
	_money: [1.1, 2.2],
	name: "a",
	_name: ["a", "b"],
	oid: 1,
	_oid: [1, 2],
	path: "((0,0),(1,1))",
	_path: ["((0,0),(1,1))", "((0,0),(1,1))"],
	point: "(0,0)",
	_point: ["(0,0)", "(0,0)"],
	polygon: "((0,0),(1,1))",
	_polygon: ["((0,0),(1,1))", "((0,0),(1,1))"],
	text: "a",
	_text: ["a", "b"],
	time: "00:00:00",
	_time: ["00:00:00", "00:00:01"],
	timestamp: "2020-01-01 00:00:00",
	_timestamp: ["2020-01-01 00:00:00", "2020-01-01 00:00:01"],
	timestamptz: "2020-01-01 00:00:00",
	_timestamptz: ["2020-01-01 00:00:00", "2020-01-01 00:00:01"],
	timetz: "00:00:00",
	_timetz: ["00:00:00", "00:00:01"],
	uuid: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
	_uuid: ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12"],
};

export const selectQuery = `
SELECT * FROM cache_testing
WHERE uuid = $1
`;

export const selectQueryValues = ["a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"];
