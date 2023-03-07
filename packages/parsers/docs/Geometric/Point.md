<h1 align="center">
	Point
</h1>
<p align="center">
  The <code>Point</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5"><code>point</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5"><code>_point</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Point } from "@postgresql-typed/parsers";

//* Points can be created in the following ways:
const point1 = Point.from("(1,2)");
const point2 = Point.from({ x: 1, y: 2 });
const point3 = Point.from(1, 2);

//* If you pass an invalid value, it will throw an error:
Point.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Point.safeFrom("abc"); // { success: false, error: Error }
Point.safeFrom("(1,2)"); // { success: true, data: Point((1,2)) }

//* To verify if a value is a point, use the `isPoint` method:
if (Point.isPoint(point1)) {
  console.log("point1 is a point");
}

//* Afterwards, you can get/set the properties of the point:
point1.x; // 1
point1.y; // 2

//* It has a `toString()` method that returns a string representation of the point:
point1.toString(); // "(1,2)"

//* It has a `toJSON()` method that returns a JSON representation of the point:
point1.toJSON(); // { x: 1, y: 2 }

//* It has a `equals()` method that returns whether two points are equal:
point1.equals(point2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
point1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
point1.safeEquals("abc"); // { success: false, error: Error }
point1.safeEquals(point2); // { success: true, equals: true, data: point2 }
point1.safeEquals("(3,4)"); // { success: true, equals: false, data: Point((3,4)) }
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