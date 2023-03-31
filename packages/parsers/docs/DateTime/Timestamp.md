<h1 align="center">
	Timestamp
</h1>
<p align="center">
  The <code>Timestamp</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>timestamp</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>_timestamp</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Timestamp } from "@postgresql-typed/parsers";
import { DateTime } from "luxon";

//* Timestamps can be created in the following ways:
const timestamp1 = Timestamp.from("2020-01-01 12:34:56.789");
const timestamp2 = Timestamp.from("2020-01-01T12:34:56.789Z"); // ISO8601
const timestamp3 = Timestamp.from(2020, 1, 1, 12, 34, 56.789); // year, month, day, hours, minutes, seconds
const timestamp4 = Timestamp.from({
  year: 2020,
  month: 1,
  day: 1,
  hours: 12,
  minutes: 34,
  seconds: 56.789,
});
const timestamp5 = Timestamp.from(DateTime.fromISO("2020-01-01T12:34:56.789Z")); // Luxon DateTime
const timestamp6 = Timestamp.from(
  new globalThis.Date("2020-01-01T12:34:56.789Z")
); // JavaScript Date

//* If you pass an invalid value, it will throw an error:
Timestamp.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Timestamp.safeFrom("abc"); // { success: false, error: Error }
Timestamp.safeFrom("2020-01-01T12:34:56.789Z"); // { success: true, data: Timestamp(2020-01-01T12:34:56.789Z) }

//* To verify if a value is a timestamp, use the `isTimestamp` method:
if (Timestamp.isTimestamp(timestamp1)) {
  console.log("timestamp1 is a timestamp");
}

//* Afterwards, you can get/set the properties of the timestamp:
timestamp1.year; // 2020
timestamp1.month; // 1
timestamp1.day; // 1
timestamp1.hours; // 12
timestamp1.minutes; // 34
timestamp1.seconds; // 56.789

timestamp1.value; // "2020-01-01 12:34:56.789"

//* It has a `toString()` method that returns a string representation of the timestamp:
timestamp1.toString(); // "2020-01-01 12:34:56.789"

//* The `toString()` method accepts a `style` parameter that can be one of the following:
/**
 * const timestamp = Timestamp.from("01-01-2023 20:00:23.123456");
 *
 * timestamp.toString(); // "2023-01-01T20:00:23.123456Z"
 * timestamp.toString("ISO"); // "2023-01-01T20:00:23.123456Z"
 * timestamp.toString("ISO-Date"); // "2023-01-01"
 * timestamp.toString("ISO-Time"); // "20:00:23.123456"
 * timestamp.toString("ISO-Duration"); // "P2023Y1M1DT20H0M23.123456S"
 * timestamp.toString("ISO-Duration-Short"); // "P2023Y1M1DT20H23.123456S"
 * timestamp.toString("ISO-Duration-Basic"); // "P20230101T200023.123456S"
 * timestamp.toString("ISO-Duration-Extended"); // "P2023-01-01T20:00:23.123456S"
 * timestamp.toString("POSIX"); // "2023-01-01 20:00:23.123456"
 * timestamp.toString("PostgreSQL"); // "Sunday January 01 2023 20:00:23.123456"
 * timestamp.toString("PostgreSQL-Short"); // "Sun Jan 01 2023 20:00:23.123456"
 * timestamp.toString("SQL"); // "2023-01 01 20:00:23.123456"
 */

//* It has a `toJSON()` method that returns a JSON representation of the timestamp:
timestamp1.toJSON(); // { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `equals()` method that returns whether two timestamps are equal:
timestamp1.equals(timestamp2); // true

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
timestamp1.safeEquals("abc"); // { success: false, error: Error }
timestamp1.safeEquals(timestamp2); // { success: true, equals: true, data: timestamp2 }
timestamp1.safeEquals("2021-01-01T12:34:56.789Z"); // { success: true, equals: false, data: Timestamp(2021-01-01T12:34:56.789Z) }

//* It has a `toDate()` method that returns a `Date` representation of the timestamp:
timestamp1.toDate(); // Date { year: 2020, month: 1, day: 1 }

//* It has a `toTime()` method that returns a `Time` representation of the timestamp:
timestamp1.toTime(); // Time { hours: 12, minutes: 34, seconds: 56 }

//* It has a `toDateTime()` method that returns a Luxon `DateTime` representation of the date: (defaults to the current timezone)
timestamp1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
timestamp1.toJSDate(); // Date { year: 2020, month: 1, day: 1, hours: 12, minutes: 34, seconds: 56.789 }
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