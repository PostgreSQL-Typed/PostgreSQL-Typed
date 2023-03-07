<h1 align="center">
	Float8
</h1>
<p align="center">
  The <code>Float8</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-FLOAT"><code>float8</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-FLOAT"><code>_float8</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Float8 } from "@postgresql-typed/parsers";
import { BigNumber } from "bignumber.js";

//* Float8s can be created in the following ways:
const float81 = Float8.from(1);
const float82 = Float8.from({
  float8: "1",
});
const float83 = Float8.from("1");
const float84 = Float8.from(BigInt("1"));
const float85 = Float8.from(BigNumber(1));

//* If you pass an invalid value, it will throw an error:
Float8.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Float8.safeFrom("abc"); // { success: false, error: Error }
Float8.safeFrom("1"); // { success: true, data: Float8(1) }

//* To verify if a value is an Float8, use the `isFloat8` method:
if (Float8.isFloat8(float81)) {
  console.log("float81 is an Float8");
}

//* Afterwards, you can get/set the properties of the Float8:
float81.float8; // BigNumber(1)

//* It has a `toString()` method that returns a string representation of the Float8:
float81.toString(); // "1"

//* It has a `toBigNumber()` method that returns a big number representation of the Float8:
float81.toBigNumber(); // BigNumber(1)

//* It has a `toJSON()` method that returns a JSON representation of the Float8:
float81.toJSON(); // { float8: "1" }

//* It has a `equals()` method that returns whether two float8s are equal:
float81.equals(float82); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
float81.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
float81.safeEquals("abc"); // { success: false, error: Error }
float81.safeEquals(float82); // { success: true, equals: true, data: float82 }
float81.safeEquals("2"); // { success: true, equals: false, data: Float8(2) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./Numeric.md">
    <img src="https://img.shields.io/badge/-Back%20to%20Numeric%20category-blue" alt="Back to Numeric category" />
  </a>
</p>