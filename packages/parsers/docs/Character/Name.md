<h1 align="center">
	Name
</h1>
<p align="center">
  The <code>Name</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>name</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>_name</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Name } from "@postgresql-typed/parsers";

//* Names can be created in the following ways:
const name1 = Name.from("abc");
const name2 = Name.from({
  value: "abc",
});


//* If you pass an invalid value, it will throw an error:
Name.from(true); // throws an error
Name.from("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"); // throws an error (Max bytes: 64)

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Name.safeFrom(true); // { success: false, error: Error }
Name.safeFrom("abc"); // { success: true, data: Name(abc) }

//* To verify if a value is a Name, use the `isName` method:
if (Name.isName(name1)) {
  console.log("name1 is a Name");
}

//* Afterwards, you can get/set the properties of the Name:
name1.value; // "abc"

//* It has a `toString()` method that returns a string representation of the Name:
name1.toString(); // "abc"

//* It has a `toJSON()` method that returns a JSON representation of the Name:
name1.toJSON(); // { value: "abc" }

//* It has a `equals()` method that returns whether two Names are equal:
name1.equals(name2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
name1.equals(true); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
name1.safeEquals(true); // { success: false, error: Error }
name1.safeEquals(name2); // { success: true, equals: true, data: name2 }
name1.safeEquals("def"); // { success: true, equals: false, data: Name(def) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./CharacterCategory.md">
    <img src="https://img.shields.io/badge/-Back%20to%20Character%20category-blue" alt="Back to Character category" />
  </a>
</p>