<h1 align="center">
	Polygon
</h1>
<p align="center">
  The <code>Polygon</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON"><code>polygon</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON"><code>_polygon</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Polygon, Point } from "postgresql-type-parsers";

//* Polygons can be created in the following ways:
const polygon1 = Polygon.from("((1,2),(3,4))");
const polygon2 = Polygon.from([Point.from(1, 2), Point.from(3, 4)]);
const polygon3 = Polygon.from({
  points: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
});
const polygon4 = Polygon.from(Point.from(1, 2), Point.from(3, 4));
const polygon5 = Polygon.from({
  points: [Point.from(1, 2), Point.from(3, 4)],
});

//* If you pass an invalid value, it will throw an error:
Polygon.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Polygon.safeFrom("abc"); // { success: false, error: Error }
Polygon.safeFrom("((1,2),(3,4))"); // { success: true, data: Polygon(((1,2),(3,4))) }

//* To verify if a value is a polygon, use the `isPolygon` method:
if (Polygon.isPolygon(polygon1)) {
  console.log("polygon1 is a polygon");
}

//* Afterwards, you can get/set the properties of the polygon:
polygon1.points; // [ Point { x: 1, y: 2 }, Point { x: 3, y: 4 } ]

//* It has a `toString()` method that returns a string representation of the polygon:
polygon1.toString(); // "((1,2),(3,4))"

//* It has a `toJSON()` method that returns a JSON representation of the polygon:
polygon1.toJSON(); // { points: [ { x: 1, y: 2 }, { x: 3, y: 4 } ] }

//* It has a `equals()` method that returns whether two polygons are equal:
polygon1.equals(polygon2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
polygon1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
polygon1.safeEquals("abc"); // { success: false, error: Error }
polygon1.safeEquals(polygon2); // { success: true, equals: true, data: polygon2 }
polygon1.safeEquals("((1,2),(5,6))"); // { success: true, equals: false, data: Polygon(((1,2),(5,6))) }
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