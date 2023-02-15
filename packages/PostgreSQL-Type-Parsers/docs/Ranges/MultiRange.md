<h1 align="center">
	MultiRange
</h1>
<div align="center">
  <p>The <code>MultiRange</code> parser is used to represet the following types:</p>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT"><code>datemultirange</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT"><code>int4multirange</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT"><code>int8multirange</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT"><code>tsmultirange</code></a><br/>
  <a href="https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT"><code>tstzmultirange</code></a><br/>
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
  DateRange,
  DateMultiRange,
  Int4MultiRange,
  Int8MultiRange,
  TimestampMultiRange,
  TimestampTZMultiRange,
} from "postgresql-type-parsers";

//* The ranges are all created in the same way:
// Using a string
const multirange1 = DateMultiRange.from(
  "{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"
);
const multirange2 = Int4MultiRange.from("{[1,9),[11,19)}");
const multirange3 = Int8MultiRange.from("{[1,9),[11,19)}");
const multirange4 = TimestampMultiRange.from("{[2020-01-01 00:00:00+00,2020-01-02 00:00:00+00),[2020-01-03 00:00:00+00,2020-01-04 00:00:00+00)}");
const multirange5 = TimestampTZMultiRange.from("{[2020-01-01 00:00:00+00,2020-01-02 00:00:00+00),[2020-01-03 00:00:00+00,2020-01-04 00:00:00+00)}");

// Using an object
const multirange6 = DateMultiRange.from({
  ranges: [
    DateRange.from("[1999-01-08,2022-01-01)"),
    DateRange.from("[2023-01-08,2024-01-01)"),
  ],
});
// etc.

// Using a raw object
const multirange7 = DateMultiRange.from({
  ranges: [
    {
      lower: LowerRange.include,
      upper: UpperRange.exclude,
      value: [
        { year: 1999, month: 1, day: 8 },
        { year: 2022, month: 1, day: 1 },
      ],
    },
    {
      lower: "(",
      upper: "]",
      value: [
        { year: 2023, month: 1, day: 8 },
        { year: 2024, month: 1, day: 1 },
      ],
    },
  ],
});
// etc.

//* If you pass an invalid value, it will throw an error:
Int4MultiRange.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Int4MultiRange.safeFrom("abc"); // { success: false, error: Error }
Int4MultiRange.safeFrom("{[1,9),[11,19)}"); // { success: true, data: Int4MultiRange({[1,9),[11,19)}) }
// etc.

//* To verify if a value is a range of the same tyupe, use the `isMultiRange` method:
if (DateMultiRange.isMultiRange(multirange1)) {
  console.log("multirange1 is a date multi range");
}

if (Int4MultiRange.isMultiRange(multirange2)) {
  console.log("multirange2 is an int4 multi range");
}
// etc.

//* Afterwards, you can get/set the properties of the multi range:
multirange1.ranges; // [DateRange, DateRange]
multirange2.ranges; // [Int4Range, Int4Range]
// etc.

//* It has a `toString()` method that returns a string representation of the multi range:
multirange1.toString(); // "{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"
multirange2.toString(); // "{[1,9),[11,19)}"
// etc.

//* It has a `toJSON()` method that returns a JSON representation of the multi range:
multirange1.toJSON(); // { ranges: [{ lower: "[", upper: ")", value: [Date, Date] }, { lower: "[", upper: ")", value: [Date, Date] }] }
multirange2.toJSON(); // { ranges: [{ lower: "[", upper: ")", value: [Int4, Int4] }, { lower: "[", upper: ")", value: [Int4, Int4] }] }
// etc.

//* It has a `equals()` method that returns whether two ranges are equal:
multirange1.equals(multirange6); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
multirange2.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
multirange2.safeEquals("abc"); // { success: false, error: Error }
multirange2.safeEquals("{[1,9),[11,19)}"); // { success: true, equals: true, data: Int4MultiRange({[1,9),[11,19)}) }
multirange2.safeEquals("{[1,9),[21,29)}"); // { success: true, equals: false, data: Int4MultiRange({[1,9),[21,29)}) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>