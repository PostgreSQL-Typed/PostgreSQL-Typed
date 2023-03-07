<h1 align="center">
	Range
</h1>
<div align="center">
  <p>The <code>Range</code> parser is used to represet the following types:</p>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-BUILTIN"><code>daterange</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-BUILTIN"><code>int4range</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-BUILTIN"><code>int8range</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-BUILTIN"><code>tsrange</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-BUILTIN"><code>tstzrange</code></a><br/>
  <br/>
  <p>It also includes all of the array data types of the same name.</p>
</div>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import {
  Date,
  DateRange,
  Int4Range,
  Int8Range,
  TimestampRange,
  TimestampTZRange,
  LowerRange,
  UpperRange,
} from "@postgresql-typed/parsers";

//* The ranges are all created in the same way:
// Using a string
const range1 = DateRange.from("[2022-09-02,2022-10-03)");
const range2 = Int4Range.from("[1,5)");
const range3 = Int8Range.from("[1,5)");
const range4 = TimestampRange.from("[2020-01-01 00:00:00,2020-01-02 00:00:00)");
const range5 = TimestampTZRange.from("[2020-01-01 00:00:00+00,2020-01-02 00:00:00+00)");

// Using an object
const range6 = DateRange.from({
  lower: LowerRange.include,
  upper: UpperRange.exclude,
  value: [
    { year: 2022, month: 9, day: 2 }, // lowerValue
    { year: 2022, month: 10, day: 3 }, // upperValue
  ],
});
// etc.

//* If you pass an invalid value, it will throw an error:
Int4Range.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Int4Range.safeFrom("abc"); // { success: false, error: Error }
Int4Range.safeFrom("[1,5)"); // { success: true, data: Int4Range([1,5)) }
// etc.

//* To verify if a value is a range of the same tyupe, use the `isRange` method:
if (DateRange.isRange(range1)) {
  console.log("range1 is a date range");
}

if (Int4Range.isRange(range2)) {
  console.log("range2 is an int4 range");
}
// etc.

//* Afterwards, you can get/set the properties of the date range:
range1.lower; // LowerRange.include
range1.upper; // UpperRange.exclude
range1.value; // [Date { year: 2022, month: 9, day: 2 }, Date { year: 2022, month: 10, day: 3 }]

range2.lower; // LowerRange.include
range2.upper; // UpperRange.exclude
range2.value; // [1, 5]
// etc.

//* It has a `toString()` method that returns a string representation of the range:
range1.toString(); // "[2022-09-02,2022-10-03)"
range2.toString(); // "[1,5)"
// etc.

//* It has a `toJSON()` method that returns a JSON representation of the range:
range1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [ { year: 2022, month: 9, day: 2 }, { year: 2022, month: 10, day: 3 } ] }
range2.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [ 1, 5 ] }
// etc.

//* It has a `equals()` method that returns whether two ranges are equal:
range1.equals(range6); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
range2.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
range2.safeEquals("abc"); // { success: false, error: Error }
range2.safeEquals("[1,5)"); // { success: true, equals: true, data: Int4Range([1,5)) }
range2.safeEquals("[1,3)"); // { success: true, equals: false, data: Int4Range([1,3)) }

//* It has a `empty` readonly property that returns whether the range is empty:
range1.empty; // false
const emptyRange1 = DateRange.from("[2022-09-02,2022-09-02)");
emptyRange1.empty; // true
const emptyRange2 = DateRange.from("empty");
emptyRange2.empty; // true

//! Note that if a DateRange is empty, it will have a `null` value.
emptyRange1.value; // null
emptyRange2.value; // null

//* It has a `isWithinRange()` method that returns whether a value of the same data type is within the range:
range1.isWithinRange(Date.from("2022-09-15")); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method of the data type the range is based on), it will throw an error:
range1.isWithinRange("abc"); // throws an error

//* You can also use the `safeIsWithinRange` method to return a `success` boolean instead of throwing an error:
range1.safeIsWithinRange("abc"); // { success: false, error: Error }
range1.safeIsWithinRange(Date.from("2022-09-15")); // { success: true, isWithinRange: true, data: Date(2022-09-15) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>