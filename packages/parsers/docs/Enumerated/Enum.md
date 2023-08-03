<h1 align="center">
	Enum
</h1>
<p align="center">
  The <code>Enum</code> parser is used to represet any <a href="https://www.postgresql.org/docs/current/datatype-enum.html"><code>enum</code></a> and any <a href="https://www.postgresql.org/docs/current/datatype-enum.html"><code>_enum</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Enum } from "@postgresql-typed/parsers";

//* Enums can be created in the following ways:
const ColorEnum = Enum.setEnums(["red", "green", "blue"]);
const enum1 = ColorEnum.from(ColorEnum.from("blue"));
const enum2 = ColorEnum.from({
  value: "green",
});
const enum3 = ColorEnum.from("red");


//* If you pass an invalid value, it will throw an error:
Enum.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Enum.safeFrom("abc"); // { success: false, error: Error }
Enum.safeFrom("red"); // { success: true, data: Enum("red") }

//* To verify if a value is an Enum<Enums>, use the `isEnum<Enums>` method:
if (Enum.isEnum(enum1)) { // By default it uses the enums of the Enum (in this case ["red", "green", "blue"])
  console.log("enum1 is an Enum<[red | green | blue]>");
}
//* You can also pass the Enums as a parameter:
if (Enum.isEnum(enum1, ["red", "yellow", "blue"])) {
  console.log("enum1 is an Enum<[red | yellow | blue]>");
}

//* You can also use the `isAnyEnum` method to verify if a value is an Enum of any enum:
if (Enum.isAnyEnum(enum1)) {
  console.log("enum1 is an Enum of any value");
}

//* Afterwards, you can get/set the properties of the Enum:
enum1.value; // "blue"

//* It has a `toString()` method that returns a string representation of the Enum:
enum1.toString(); // "blue"

//* It has a `toJSON()` method that returns a JSON representation of the Enum:
enum1.toJSON(); // { value: "blue" }

//* It has a `equals()` method that returns whether two booleans are equal:
enum1.equals(enum2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
enum1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
enum1.safeEquals("abc"); // { success: false, error: Error }
enum1.safeEquals(enum2); // { success: true, equals: true, data: enum2 }
enum1.safeEquals("red"); // { success: true, equals: false, data: Enum("red") }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>