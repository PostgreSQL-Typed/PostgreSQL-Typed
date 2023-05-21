import { Time, Timestamp, TimestampTZ, TimeTZ } from "@postgresql-typed/parsers";

export const createTable = `
CREATE TABLE IF NOT EXISTS tzswitcher_testing (
  time TIME NOT NULL,
  _time TIME[] NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  _timestamp TIMESTAMP[] NOT NULL,
  timestamptz TIMESTAMPTZ NOT NULL,
  _timestamptz TIMESTAMPTZ[] NOT NULL,
  timetz TIMETZ NOT NULL,
  _timetz TIMETZ[] NOT NULL
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
  _timetz
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8
);
`;

export const insertQueryValues = [
	Time.from("12:34:56").postgres,
	[Time.from("12:34:56").postgres, Time.from("12:56:12").postgres],
	Timestamp.from("2021-01-01 12:34:56").postgres,
	[Timestamp.from("2021-01-01 12:34:56"), Timestamp.from("2021-01-01 12:56:12")],
	TimestampTZ.from("2021-01-01 12:34:56 UTC"),
	[TimestampTZ.from("2021-01-01 12:34:56 UTC"), TimestampTZ.from("2021-01-01 12:56:12 UTC")],
	TimeTZ.from("12:34:56 UTC"),
	[TimeTZ.from("12:34:56 UTC"), TimeTZ.from("12:56:12 UTC")],
];

export const valuesInSeoul = {
	time: Time.from("21:34:56"),
	_time: [Time.from("21:34:56"), Time.from("21:56:12")],
	timestamp: Timestamp.from("2021-01-01 21:34:56"),
	_timestamp: [Timestamp.from("2021-01-01 21:34:56"), Timestamp.from("2021-01-01 21:56:12")],
	timestamptz: TimestampTZ.from("2021-01-01 21:34:56 Asia/Seoul"),
	_timestamptz: [TimestampTZ.from("2021-01-01 21:34:56 Asia/Seoul"), TimestampTZ.from("2021-01-01 21:56:12 Asia/Seoul")],
	timetz: TimeTZ.from("21:34:56 Asia/Seoul"),
	_timetz: [TimeTZ.from("21:34:56 Asia/Seoul"), TimeTZ.from("21:56:12 Asia/Seoul")],
};

export const selectQuery = `
SELECT * FROM tzswitcher_testing
WHERE timestamp = $1
`;

export const selectQueryValues = [Timestamp.from("2021-01-01 21:34:56")];
