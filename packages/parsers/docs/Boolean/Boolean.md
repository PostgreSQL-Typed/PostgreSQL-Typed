<h1 align="center">
	Boolean
</h1>
<p align="center">
  The <code>Boolean</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-boolean.html"><code>bool</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-boolean.html"><code>_bool</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Boolean } from "@postgresql-typed/parsers";

//* Booleans can be created in the following ways:
const boolean1 = Boolean.from(true);
const boolean2 = Boolean.from({
  value: true,
});
const boolean3 = Boolean.from("true"); // It accepts a bunch of different values for true and false (see the source code)


//* If you pass an invalid value, it will throw an error:
Boolean.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Boolean.safeFrom("abc"); // { success: false, error: Error }
Boolean.safeFrom("true"); // { success: true, data: Boolean(true) }

//* To verify if a value is an Boolean, use the `isBoolean` method:
if (Boolean.isBoolean(boolean1)) {
  console.log("boolean1 is an Boolean");
}

//* Afterwards, you can get/set the properties of the Boolean:
boolean1.value; // true

//* It has a `toString()` method that returns a string representation of the Boolean:
boolean1.toString(); // "true"

//* It has a `toNumber()` method that returns a number representation of the Boolean:
boolean1.toNumber(); // 1

//* It has a `toBoolean()` method that returns a boolean representation of the Boolean:
boolean1.toBoolean(); // true

//* It has a `toJSON()` method that returns a JSON representation of the Boolean:
boolean1.toJSON(); // { value: true }

//* It has a `equals()` method that returns whether two booleans are equal:
boolean1.equals(boolean2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
boolean1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
boolean1.safeEquals("abc"); // { success: false, error: Error }
boolean1.safeEquals(boolean2); // { success: true, equals: true, data: boolean2 }
boolean1.safeEquals("false"); // { success: true, equals: false, data: Boolean(false) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>