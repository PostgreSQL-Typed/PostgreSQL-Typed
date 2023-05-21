import {
	PgTPParser,
	type PgTPParserClass,
	Time,
	type TimeConstructor,
	Timestamp,
	type TimestampConstructor,
	TimestampTZ,
	type TimestampTZConstructor,
	TimeTZ,
	type TimeTZConstructor,
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
							 * @kind time without time zone[]
							 */
							_time: Time[];
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: Timestamp[];
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: TimestampTZ[];
							/**
							 * @kind time with time zone[]
							 */
							_timetz: TimeTZ[];
							/**
							 * @kind time without time zone
							 */
							time: Time;
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: Timestamp;
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: TimestampTZ;
							/**
							 * @kind time with time zone
							 */
							timetz: TimeTZ;
						};
						insert_parameters: {
							/**
							 * @kind time without time zone[]
							 */
							_time: Time[];
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: Timestamp[];
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: TimestampTZ[];
							/**
							 * @kind time with time zone[]
							 */
							_timetz: TimeTZ[];
							/**
							 * @kind time without time zone
							 */
							time: Time;
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: Timestamp;
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: TimestampTZ;
							/**
							 * @kind time with time zone
							 */
							timetz: TimeTZ;
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
							 * @kind time without time zone[]
							 */
							_time: PgTPParser(Time, true) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: PgTPParser(Timestamp, true) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: PgTPParser(TimestampTZ, true) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind time with time zone[]
							 */
							_timetz: PgTPParser(TimeTZ, true) as PgTPParserClass<TimeTZConstructor>,
							/**
							 * @kind time without time zone
							 */
							time: PgTPParser(Time) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: PgTPParser(Timestamp) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: PgTPParser(TimestampTZ) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind time with time zone
							 */
							timetz: PgTPParser(TimeTZ) as PgTPParserClass<TimeTZConstructor>,
						},
						insert_parameters: {
							/**
							 * @kind time without time zone[]
							 */
							_time: PgTPParser(Time, true) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone[]
							 */
							_timestamp: PgTPParser(Timestamp, true) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind timestamp with time zone[]
							 */
							_timestamptz: PgTPParser(TimestampTZ, true) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind time with time zone[]
							 */
							_timetz: PgTPParser(TimeTZ, true) as PgTPParserClass<TimeTZConstructor>,
							/**
							 * @kind time without time zone
							 */
							time: PgTPParser(Time) as PgTPParserClass<TimeConstructor>,
							/**
							 * @kind timestamp without time zone
							 */
							timestamp: PgTPParser(Timestamp) as PgTPParserClass<TimestampConstructor>,
							/**
							 * @kind timestamp with time zone
							 */
							timestamptz: PgTPParser(TimestampTZ) as PgTPParserClass<TimestampTZConstructor>,
							/**
							 * @kind time with time zone
							 */
							timetz: PgTPParser(TimeTZ) as PgTPParserClass<TimeTZConstructor>,
						},
					},
				],
			},
		],
	},
};
