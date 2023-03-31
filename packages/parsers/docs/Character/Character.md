<h1 align="center">
	Character
</h1>
<p align="center">
  The <code>Character</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/typeconv-query.html"><code>bpchar</code></a>, <a href="https://www.postgresql.org/docs/current/typeconv-query.html"><code>_bpchar</code></a>, <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>char</code></a>, and <a href="https://www.postgresql.org/docs/current/datatype-character.html"><code>_char</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Character } from "@postgresql-typed/parsers";

//* Characters can be created in the following ways:
const character1 = Character.from("a");
const character2 = Character.from({
  value: "a",
});

//* By default the n value of the Character is 1, you can use the `setN` method to customize this:
const characterN3 = Character.setN(3);
// You can now parse higher characters
// characterN3.from("abc")


//* If you pass an invalid value, it will throw an error:
Character.from(true); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Character.safeFrom(true); // { success: false, error: Error }
Character.safeFrom("a"); // { success: true, data: Character<1>("a") }

//* To verify if a value is an Character<N>, use the `isCharacter<N>` method:
if (Character.isCharacter(character1)) { // By default it uses the N value of the Character (in this case 1)
  console.log("character1 is an Character<1>");
}
//* You can also pass the N value as a parameter:
if (Character.isCharacter(character1, 3)) {
  console.log("character1 is an Character<3>")
}

//* You can also use the `isAnyCharacter` method to verify if a value is an Character of any N value:
if (Character.isAnyCharacter(character1)) {
  console.log("character1 is an Character of any N value");
}

//* Afterwards, you can get/set the properties of the Character:
character1.value; // "a"

//* It has a `toString()` method that returns a string representation of the Character:
character1.toString(); // "a"

//* It has a `toJSON()` method that returns a JSON representation of the Character:
character1.toJSON(); // { value: "a" }

//* It has a `equals()` method that returns whether two characters are equal:
character1.equals(character2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
character1.equals(true); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
character1.safeEquals(true); // { success: false, error: Error }
character1.safeEquals(character2); // { success: true, equals: true, data: character2 }
character1.safeEquals("b"); // { success: true, equals: false, data: Character("b") }
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