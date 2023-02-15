<h1 align="center">
	Float4
</h1>
<p align="center">
  The <code>Float4</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-FL``OAT"><code>float4</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-FLOAT"><code>_float4</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Float4 } from "postgresql-type-parsers";
import { BigNumber } from "bignumber.js";

//* Float4s can be created in the following ways:
const float41 = Float4.from(1);
const float42 = Float4.from({
  float4: "1",
});
const float43 = Float4.from("1");
const float44 = Float4.from(BigInt("1"));
const float45 = Float4.from(BigNumber(1));

//* If you pass an invalid value, it will throw an error:
Float4.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Float4.safeFrom("abc"); // { success: false, error: Error }
Float4.safeFrom("1"); // { success: true, data: Float4(1) }

//* To verify if a value is an Float4, use the `isFloat4` method:
if (Float4.isFloat4(float41)) {
  console.log("float41 is an Float4");
}

//* Afterwards, you can get/set the properties of the Float4:
float41.float4; // BigNumber(1)

//* It has a `toString()` method that returns a string representation of the Float4:
float41.toString(); // "1"

//* It has a `toBigNumber()` method that returns a big number representation of the Float4:
float41.toBigNumber(); // BigNumber(1)

//* It has a `toJSON()` method that returns a JSON representation of the Float4:
float41.toJSON(); // { float4: "1" }

//* It has a `equals()` method that returns whether two float4s are equal:
float41.equals(float42); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
float41.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
float41.safeEquals("abc"); // { success: false, error: Error }
float41.safeEquals(float42); // { success: true, equals: true, data: float42 }
float41.safeEquals("2"); // { success: true, equals: false, data: Float4(2) }
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