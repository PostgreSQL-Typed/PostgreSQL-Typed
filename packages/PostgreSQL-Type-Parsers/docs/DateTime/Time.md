<h1 align="center">
	Time
</h1>
<p align="center">
  The <code>Time</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>time</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT"><code>_time</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Time } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Times can be created in the following ways:
const time1 = Time.from("12:34:56.789");
const time2 = Time.from(12, 34, 56); // hours, minutes, seconds
const time3 = Time.from({
  hours: 12,
  minutes: 34,
  seconds: 56,
});
const time4 = Time.from(DateTime.fromISO("2020-01-01 12:34:56")); // Luxon DateTime
const time5 = Time.from(new globalThis.Date("2020-01-01 12:34:56")); // JavaScript Date

//* If you pass an invalid value, it will throw an error:
Time.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Time.safeFrom("abc"); // { success: false, error: Error }
Time.safeFrom("12:34:56.789"); // { success: true, data: Time(12:34:56.789) }

//* To verify if a value is a time, use the `isTime` method:
if (Time.isTime(time1)) {
  console.log("time1 is a time");
}

//* Afterwards, you can get/set the properties of the time:
time1.hours; // 12
time1.minutes; // 34
time1.seconds; // 56.789

//* It has a `toString()` method that returns a string representation of the time:
time1.toString(); // "12:34:56.789"

//* It has a `toJSON()` method that returns a JSON representation of the time:
time1.toJSON(); // { hours: 12, minutes: 34, seconds: 56.789 }

//* It has a `equals()` method that returns whether two times are equal:
time1.equals(time2); // true

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
time1.safeEquals("abc"); // { success: false, error: Error }
time1.safeEquals(time2); // { success: true, equals: true, data: time2 }
time1.safeEquals("12:34:56"); // { success: true, equals: false, data: Time(12:34:56) }

//* It has a `toDateTime()` method that returns a Luxon `DateTime` representation of the time: (defaults to the current timezone)
time1.toDateTime(); // DateTime { hours: 12, minutes: 34, seconds: 56.789 }
time1.toDateTime("America/New_York"); // DateTime { hours: 12, minutes: 34, seconds: 56.789, zone: "America/New_York" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the time: (defaults to the current timezone)
time1.toJSDate(); // Date { hours: 12, minutes: 34, seconds: 56.789 }
time1.toJSDate("America/New_York"); // Date { hours: 12, minutes: 34, seconds: 56.789, zone: "America/New_York" }
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