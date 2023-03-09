<h1 align="center">
	CharacterVarying
</h1>
<p align="center">
  The <code>CharacterVarying</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>varchar</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>_varchar</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { CharacterVarying } from "@postgresql-typed/parsers";

//* CharacterVaryings can be created in the following ways:
const character2 = CharacterVarying.from({
  character: "a",
});
const character3 = CharacterVarying.from("a");

//* By default the n value of the CharacterVarying is Infinity, you can use the `setN` method to customize this:
const characterN3 = CharacterVarying.setN(3);
// You can now parse characters with a maximum of 3 characters
// characterN3.from("abc")


//* If you pass an invalid value, it will throw an error:
CharacterVarying.from(true); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
CharacterVarying.safeFrom(true); // { success: false, error: Error }
CharacterVarying.safeFrom("a"); // { success: true, data: CharacterVarying<Infinity>("a") }

//* To verify if a value is an CharacterVarying<N>, use the `isCharacterVarying<N>` method:
if (CharacterVarying.isCharacterVarying(character1)) { // By default it uses the N value of the CharacterVarying (in this case Infinity)
  console.log("character1 is an CharacterVarying<Infinity>");
}
//* You can also pass the N value as a parameter:
if (CharacterVarying.isCharacterVarying(character1, 3)) {
  console.log("character1 is an CharacterVarying<3>")
}

//* You can also use the `isAnyCharacterVarying` method to verify if a value is an CharacterVarying of any N value:
if (CharacterVarying.isAnyCharacterVarying(character1)) {
  console.log("character1 is an CharacterVarying of any N value");
}

//* Afterwards, you can get/set the properties of the CharacterVarying:
character1.character; // "a"

//* It has a `toString()` method that returns a string representation of the CharacterVarying:
character1.toString(); // "a"

//* It has a `toJSON()` method that returns a JSON representation of the CharacterVarying:
character1.toJSON(); // { character: "a" }

//* It has a `equals()` method that returns whether two characters are equal:
character1.equals(character2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
character1.equals(true); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
character1.safeEquals(true); // { success: false, error: Error }
character1.safeEquals(character2); // { success: true, equals: true, data: character2 }
character1.safeEquals("b"); // { success: true, equals: false, data: CharacterVarying("b") }
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