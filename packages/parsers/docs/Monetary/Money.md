<h1 align="center">
	Money
</h1>
<p align="center">
  The <code>Money</code> parser is used to represet the <a href="https://www.postgresql.org/docs/current/datatype-money.html"><code>money</code></a> and <a href="https://www.postgresql.org/docs/current/datatype-money.html"><code>_money</code></a> types.
</p>
<br/>

<!-- Usage -->
<h2 align="center">
	Usage
</h2>

```ts
import { Money } from "@postgresql-typed/parsers";
import { BigNumber } from "bignumber.js";

//* Moneys can be created in the following ways:
const money1 = Money.from(1);
const money2 = Money.from({
  money: "1",
});
const money3 = Money.from("1");
const money4 = Money.from(BigInt("1"));
const money5 = Money.from(BigNumber(1));
const money6 = Money.from("$123,456.78");

//* If you pass an invalid value, it will throw an error:
Money.from("abc"); // throws an error

//* You can also use the `safeFrom` method to return a `success` boolean instead of throwing an error:
Money.safeFrom("abc"); // { success: false, error: Error }
Money.safeFrom("1"); // { success: true, data: Money(1) }

//* To verify if a value is an Money, use the `isMoney` method:
if (Money.isMoney(money1)) {
  console.log("money1 is an Money");
}

//* Afterwards, you can get/set the properties of the Money:
money1.money; // BigNumber(1)

//* It has a `toString()` method that returns a string representation of the Money:
money1.toString(); // "1.00" (It will always have two decimal places)

//* It has a `toBigNumber()` method that returns a big number representation of the Money:
money1.toBigNumber(); // BigNumber(1)

//* It has a `toJSON()` method that returns a JSON representation of the Money:
money1.toJSON(); // { money: "1.00" }

//* It has a `equals()` method that returns whether two moneys are equal:
money1.equals(money2); // true

//* If you pass an invalid value (a value that would not be accepted by the `from` method), it will throw an error:
money1.equals("abc"); // throws an error

//* You can also use the `safeEquals` method to return a `success` boolean instead of throwing an error:
money1.safeEquals("abc"); // { success: false, error: Error }
money1.safeEquals(money2); // { success: true, equals: true, data: money2 }
money1.safeEquals("2"); // { success: true, equals: false, data: Money(2) }
```

<p align="center">
  <!-- Back to main README button -->
  <a href="../../README.md">
    <img src="https://img.shields.io/badge/-Back%20to%20main%20README-blue" alt="Back to main README" />
  </a>
</p>