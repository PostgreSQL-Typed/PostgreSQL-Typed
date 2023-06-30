import { table } from "@postgresql-typed/core";
import { defineText, defineTime, defineTimestamp, defineTimestampTZ, defineTimeTZ } from "@postgresql-typed/core/definers";
import { Text, Time, Timestamp, TimestampTZ, TimeTZ } from "@postgresql-typed/parsers";

export const TzSwitcherTable = table("tzswitcher_testing", {
	time: defineTime("time", { mode: "Time" }).notNull(),
	_time: defineTime("_time", { mode: "Time" }).array().notNull(),
	timestamp: defineTimestamp("timestamp", { mode: "Timestamp" }).notNull(),
	_timestamp: defineTimestamp("_timestamp", { mode: "Timestamp" }).array().notNull(),
	timestamptz: defineTimestampTZ("timestamptz", { mode: "TimestampTZ" }).notNull(),
	_timestamptz: defineTimestampTZ("_timestamptz", { mode: "TimestampTZ" }).array().notNull(),
	timetz: defineTimeTZ("timetz", { mode: "TimeTZ" }).notNull(),
	_timetz: defineTimeTZ("_timetz", { mode: "TimeTZ" }).array().notNull(),
	not_a_time: defineText("not_a_time", { mode: "Text" }).notNull(),
	nullable_time: defineTime("nullable_time", { mode: "Time" }),
});

export const createTable = `
CREATE TABLE IF NOT EXISTS tzswitcher_testing (
  time TIME NOT NULL,
  _time TIME[] NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  _timestamp TIMESTAMP[] NOT NULL,
  timestamptz TIMESTAMPTZ NOT NULL,
  _timestamptz TIMESTAMPTZ[] NOT NULL,
  timetz TIMETZ NOT NULL,
  _timetz TIMETZ[] NOT NULL,
  not_a_time TEXT NOT NULL,
  nullable_time TIME
);`;

export const dropTable = `
DROP TABLE IF EXISTS tzswitcher_testing;
`;

export const insertQuery = `
INSERT INTO tzswitcher_testing (
  time,
  _time,
  timestamp,
  _timestamp,
  timestamptz,
  _timestamptz,
  timetz,
  _timetz,
  not_a_time,
  nullable_time
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10
);
`;

export const insertQueryValues = [
	Time.from("12:34:56").postgres,
	[Time.from("12:34:56").postgres, Time.from("12:56:12").postgres],
	Timestamp.from("2021-01-01 12:34:56").postgres,
	[Timestamp.from("2021-01-01 12:34:56.123").postgres, Timestamp.from("2021-01-01 12:56:12").postgres],
	TimestampTZ.from("2021-01-01 12:34:56 UTC").postgres,
	[TimestampTZ.from("2021-01-01 12:34:56 UTC").postgres, TimestampTZ.from("2021-01-01 12:56:12 UTC").postgres],
	TimeTZ.from("12:34:56 UTC").postgres,
	[TimeTZ.from("12:34:56 UTC").postgres, TimeTZ.from("12:56:12 UTC").postgres],
	Text.from("not a time").postgres,
	// eslint-disable-next-line unicorn/no-null
	null,
];

export const valuesInSeoul = {
	time: Time.from("21:34:56"),
	_time: [Time.from("21:34:56"), Time.from("21:56:12")],
	timestamp: Timestamp.from("2021-01-01 21:34:56"),
	_timestamp: [Timestamp.from("2021-01-01 21:34:56.123"), Timestamp.from("2021-01-01 21:56:12")],
	timestamptz: TimestampTZ.from("2021-01-01 21:34:56 Asia/Seoul"),
	_timestamptz: [TimestampTZ.from("2021-01-01 21:34:56 Asia/Seoul"), TimestampTZ.from("2021-01-01 21:56:12 Asia/Seoul")],
	timetz: TimeTZ.from("21:34:56 Asia/Seoul"),
	_timetz: [TimeTZ.from("21:34:56 Asia/Seoul"), TimeTZ.from("21:56:12 Asia/Seoul")],
	not_a_time: Text.from("not a time"),
	// eslint-disable-next-line unicorn/no-null
	nullable_time: null,
};
