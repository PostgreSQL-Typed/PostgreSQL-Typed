<h1 align="center">
	TimestampTZ
</h1>
<p align="center">
  The <code>TimestampTZ</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>timestamptz</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>_timestamptz</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { TimestampTZ } from "@postgresql-typed/parsers";
import { DateTime } from "luxon";

//* TimestampTZs can be created in the following ways:
const timestampTZ1 = TimestampTZ.from("2020-01-01 12:34:56.789 +01:00");
const timestampTZ2 = TimestampTZ.from("2020-01-01T12:34:56.789+01:00"); // ISO8601
const timestampTZ3 = TimestampTZ.from(2020, 1, 1, 12, 34, 56.789, 1, 0, "plus"); // year, month, day, hours, minutes, seconds, offsetHours, offsetMinutes, offsetDirection
const timestampTZ4 = TimestampTZ.from({
  year: 2020,
  month: 1,
  day: 1,
  hours: 12,
  minutes: 34,
  seconds: 56.789,
  offset: {
    hours: 1,
    minutes: 0,
    direction: "plus",
  },
});
const timestampTZ5 = TimestampTZ.from(
  DateTime.fromISO("2020-01-01T12:34:56.789Z")
); // Luxon DateTime
const timestampTZ6 = TimestampTZ.from(
  new globalThis.Date("2020-01-01T12:34:56.789Z")
); // JavaScript Date

//* If you pass an invalid value, it will throw an error:
TimestampTZ.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
TimestampTZ.safeFrom("abc"); // { success: false, error: Error }
TimestampTZ.safeFrom("2020-01-01T12:34:56.789Z"); // { success: true, data: TimestampTZ(2020-01-01T12:34:56.789Z) }

//* To verify if a value is a timestampTZ, use the `isTimestampTZ` method:
if (TimestampTZ.isTimestampTZ(timestampTZ1)) {
  console.log("timestampTZ1 is a timestampTZ");
}


//* Afterwards, you can get/set the properties of the timestampTZ:
timestampTZ1.year; // 2020
timestampTZ1.month; // 1
timestampTZ1.day; // 1
timestampTZ1.hours; // 12
timestampTZ1.minutes; // 34
timestampTZ1.seconds; // 56.789
timestampTZ1.offset.hours; // 1
timestampTZ1.offset.minutes; // 0
timestampTZ1.offset.direction; // "plus"

//* It has a `toString()` method that returns a string representation of the timestampTZ:
timestampTZ1.toString(); // "2020-01-01 12:34:56.789 +01:00"

//* The `toString()` method accepts a `style` parameter that can be one of the following:
/**
 * const timestamp = TimestampTZ.from("01-01-2023 20:00:23.123456 PST+05:00");
 *
 * timestamp.toString(); // "2023-01-01T20:00:23.123456-13:00"
 * timestamp.toString("ISO"); // "2023-01-01T20:00:23.123456-13:00"
 * timestamp.toString("ISO-Date"); // "2023-01-01"
 * timestamp.toString("ISO-Time"); // "20:00:23.123456-13:00"
 * timestamp.toString("ISO-Duration"); // "P2023Y1M1DT20H0M23.123456S"
 * timestamp.toString("ISO-Duration-Short"); // "P2023Y1M1DT20H23.123456S"
 * timestamp.toString("ISO-Duration-Basic"); // "P20230101T200023.123456S"
 * timestamp.toString("ISO-Duration-Extended"); // "P2023-01-01T20:00:23.123456S"
 * timestamp.toString("POSIX"); // "2023-01-01 20:00:23.123456-13:00"
 * timestamp.toString("PostgreSQL"); // "Sunday January 01 2023 20:00:23.123456 -13:00"
 * timestamp.toString("PostgreSQL-Short"); // "Sun Jan 01 2023 20:00:23.123456 -13:00"
 * timestamp.toString("SQL"); // "2023-01 01 20:00:23.123456-13:00"
 */

//* It has a `toJSON()` method that returns a JSON representation of the timestampTZ:
timestampTZ1.toJSON(); // { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789, offset: { hours: 1, minutes: 0, direction: "plus" } }

//* It has a `equals()` method that returns whether two timestampTZs are equal:
timestampTZ1.equals(timestampTZ2); // true

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
timestampTZ1.safeEquals("abc"); // { success: false, error: Error }
timestampTZ1.safeEquals(timestampTZ2); // { success: true, equals: true, data: timestampTZ2 }
timestampTZ1.safeEquals("2021-01-01T12:34:56.789Z"); // { success: true, equals: false, data: TimestampTZ(2021-01-01T12:34:56.789Z) }

//* It has a `toDate()` method that returns a `Date` representation of the timestampTZ:
timestampTZ1.toDate(); // Date { year: 2020, month: 1, day: 1 }

//* It has a `toTime()` method that returns a `Time` representation of the timestampTZ:
timestampTZ1.toTime(); // Time { hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `toTimeTZ()` method that returns a `TimeTZ` representation of the timestampTZ:
timestampTZ1.toTimeTZ(); // TimeTZ { hours: 12, minutes: 34, seconds: 56.789, offset: { hours: 1, minutes: 0, direction: "plus" } }

//* It has a `toTimestamp()` method that returns a `Timestamp` representation of the timestampTZ:
timestampTZ1.toTimestamp(); // Timestamp { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `toDateTime()` method that returns a Luxon `DateTime` representation of the timestampTZ:
timestampTZ1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789, zone: "+01:00" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the timestampTZ:
timestampTZ1.toJSDate(); // Date { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789, zone: "+01:00" }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./DateTime.md">
    <img src="https://img.shields.io/badge/-Back%20to%20DateTime%20category-blue" alt="Back to DateTime category" />
  </a>
</p>