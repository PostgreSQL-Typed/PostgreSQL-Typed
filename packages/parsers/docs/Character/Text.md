<h1 align="center">
	Text
</h1>
<p align="center">
  The <code>Text</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>text</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>_text</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Text } from "@postgresql-typed/parsers";

//* Texts can be created in the following ways:
const text1 = Text.from("abc");
const text2 = Text.from({
  text: "abc",
});


//* If you pass an invalid value, it will throw an error:
Text.from(true); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Text.safeFrom(true); // { success: false, error: Error }
Text.safeFrom("abc"); // { success: true, data: Text(abc) }

//* To verify if a value is a Text, use the `isText` method:
if (Text.isText(text1)) {
  console.log("text1 is a Text");
}

//* Afterwards, you can get/set the properties of the Text:
text1.text; // "abc"

//* It has a `toString()` method that returns a string representation of the Text:
text1.toString(); // "abc"

//* It has a `toJSON()` method that returns a JSON representation of the Text:
text1.toJSON(); // { text: "abc" }

//* It has a `equals()` method that returns whether two Texts are equal:
text1.equals(text2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
text1.equals(true); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
text1.safeEquals(true); // { success: false, error: Error }
text1.safeEquals(text2); // { success: true, equals: true, data: text2 }
text1.safeEquals("def"); // { success: true, equals: false, data: Text(def) }
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