<h1 align="center">
	Circle
</h1>
<p align="center">
  The <code>Circle</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE"><code>circle</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE"><code>_circle</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Circle } from "@postgresql-typed/parsers";

//* Circles can be created in the following ways:
const circle1 = Circle.from({ x: 1, y: 2, radius: 3 });
const circle2 = Circle.from("<(1,2),3>");
const circle3 = Circle.from(1, 2, 3); //x, y, radius

//* If you pass an invalid value, it will throw an error:
Circle.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Circle.safeFrom("abc"); // { success: false, error: Error }
Circle.safeFrom("<(1,2),3>"); // { success: true, data: Circle(<(1,2),3>) }

//* To verify if a value is a circle, use the `isCircle` method:
if (Circle.isCircle(circle1)) {
  console.log("circle1 is a circle");
}

//* Afterwards, you can get/set the properties of the circle:
circle1.x; // 1
circle1.y; // 2
circle1.radius; // 3

//* It has a `toString()` method that returns a string representation of the circle:
circle1.toString(); // "<(1,2),3>"

//* It has a `toJSON()` method that returns a JSON representation of the circle:
circle1.toJSON(); // { x: 1, y: 2, radius: 3 }

//* It has a `equals()` method that returns whether two circles are equal:
circle1.equals(circle2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
circle1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
circle1.safeEquals("abc"); // { success: false, error: Error }
circle1.safeEquals(circle2); // { success: true, equals: true, data: circle2 }
circle1.safeEquals("<(1,2),5>"); // { success: true, equals: false, data: Circle(<(1,2),5>) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
  <!-- Back to category button -->
  <a href="./Geometric.md">
    <img src="https://img.shields.io/badge/-Back%20to%20Geometric%20category-blue" alt="Back to Geometric category" />
  </a>
</p>