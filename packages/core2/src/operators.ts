import { AnyColumn, bindIfParam, GetColumnData, Placeholder, SQL, sql, SQLWrapper } from "drizzle-orm";
export {
	and,
	between,
	between as btwn,
	eq,
	eq as equal,
	eq as equals,
	gt as greaterThan,
	gte as greaterThanOrEqual,
	gt,
	gte,
	ilike,
	inArray as in,
	inArray,
	eq as is,
	between as isBetween,
	gt as isGreaterThan,
	gte as isGreaterThanOrEqual,
	lt as isLessThan,
	lte as isLessThanOrEqual,
	ne as isNot,
	notBetween as isNotBetween,
	lt as lessThan,
	lte as lessThanOrEqual,
	like,
	lt,
	lte,
	notBetween as nbtwn,
	ne,
	ne as neq,
	notInArray as nin,
	not,
	notBetween,
	ne as notEqual,
	ne as notEquals,
	notIlike,
	notInArray as notIn,
	notInArray,
	notLike,
	or,
} from "drizzle-orm";

/**
 * Adds two values together.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars with a price greater than $10,500.
 * db.select().from(cars)
 *   .where(
 * 	   gt(cars.price, plus(10000, 500))
 *   )
 * ```
 */
export function plus<T>(left: SQL.Aliased<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function plus<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function plus(left: AnyColumn | SQL.Aliased, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} + ${bindIfParam(right, left)}`;
}

/**
 * Subtracts two values.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars with a price less than $10,500.
 * db.select().from(cars)
 *  .where(
 * 	lt(cars.price, minus(20000, 500))
 * )
 * ```
 */
export function minus<T>(left: SQL.Aliased<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function minus<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function minus(left: AnyColumn | SQL.Aliased, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} - ${bindIfParam(right, left)}`;
}

/**
 * Multiplies two values.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars with a price less than $10,000.
 * db.select().from(cars)
 * .where(
 * 	lt(cars.price, times(5000, 2))
 * )
 * ```
 */
export function times<T>(left: SQL.Aliased<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function times<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function times(left: AnyColumn | SQL.Aliased, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} * ${bindIfParam(right, left)}`;
}

/**
 * Divides two values.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars with a price greater than $10,000.
 * db.select().from(cars)
 * .where(
 * 	gt(cars.price, divide(20000, 2))
 * )
 * ```
 */
export function divide<T>(left: SQL.Aliased<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function divide<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function divide(left: AnyColumn | SQL.Aliased, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} / ${bindIfParam(right, left)}`;
}

/**
 * Test that two values are equal.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by Ford
 * db.select().from(cars)
 *   .where(sameAs(cars.make, 'Ford'))
 * ```
 *
 * @description Uses the `~=` operator.
 */
export function sameAs<T>(left: SQL.Aliased<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function sameAs<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function sameAs(left: AnyColumn | SQL.Aliased, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} ~= ${bindIfParam(right, left)}`;
}

/**
 * Count
 *
 * ## Examples
 *
 * ```ts
 * // Select the number of cars
 * db.select(count(cars.id)).from(cars)
 * ```
 */
export function count<T>(value: SQL.Aliased<T>): SQL<number>;
export function count<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function count(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql<number>`count(${value})::int`;
}

/**
 * Sum
 *
 * ## Examples
 *
 * ```ts
 * // Select the sum of all car prices
 * db.select(sum(cars.price)).from(cars)
 * ```
 */
export function sum<T>(value: SQL.Aliased<T>): SQL<number>;
export function sum<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function sum(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`sum(${value})::int`;
}

/**
 * Average
 *
 * ## Examples
 *
 * ```ts
 * // Select the average price of all cars
 * db.select(avg(cars.price)).from(cars)
 * ```
 */
export function avg<T>(value: SQL.Aliased<T>): SQL<number>;
export function avg<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function avg(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`avg(${value})::int`;
}

/**
 * Minimum
 *
 * ## Examples
 *
 * ```ts
 * // Select the minimum price of all cars
 * db.select(min(cars.price)).from(cars)
 * ```
 */
export function min<T>(value: SQL.Aliased<T>): SQL<number>;
export function min<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function min(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`min(${value})::int`;
}

/**
 * Maximum
 *
 * ## Examples
 *
 * ```ts
 * // Select the maximum price of all cars
 * db.select(max(cars.price)).from(cars)
 * ```
 */
export function max<T>(value: SQL.Aliased<T>): SQL<number>;
export function max<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function max(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`max(${value})::int`;
}

/**
 * Ascii
 *
 * ## Examples
 *
 * ```ts
 * // Select the ascii value of the first character of the car make
 * db.select(ascii(cars.make)).from(cars)
 * ```
 */
export function ascii<T>(value: SQL.Aliased<T>): SQL<string>;
export function ascii<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function ascii(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`ascii(${value})`;
}

/**
 * bit_length
 *
 * ## Examples
 *
 * ```ts
 * // Select the bit length of the car make
 * db.select(bit_length(cars.make)).from(cars)
 * ```
 */
export function bitLength<T>(value: SQL.Aliased<T>): SQL<number>;
export function bitLength<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function bitLength(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`bit_length(${value})::int`;
}

/**
 * char_length
 *
 * ## Examples
 *
 * ```ts
 * // Select the character length of the car make
 * db.select(char_length(cars.make)).from(cars)
 * ```
 */
export function charLength<T>(value: SQL.Aliased<T>): SQL<number>;
export function charLength<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function charLength(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`char_length(${value})::int`;
}

/**
 * lower
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make in lowercase
 * db.select(lower(cars.make)).from(cars)
 * ```
 */
export function lower<T>(value: SQL.Aliased<T>): SQL<string>;
export function lower<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function lower(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`lower(${value})`;
}

export const lcase = lower;

/**
 * upper
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make in uppercase
 * db.select(upper(cars.make)).from(cars)
 * ```
 */
export function upper<T>(value: SQL.Aliased<T>): SQL<string>;
export function upper<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function upper(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`upper(${value})`;
}

export const ucase = upper;

/**
 * length
 *
 * ## Examples
 *
 * ```ts
 * // Select the length of the car make
 * db.select(length(cars.make)).from(cars)
 * ```
 */
export function length<T>(value: SQL.Aliased<T>): SQL<number>;
export function length<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function length(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`length(${value})::int`;
}

/**
 * ltrim
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make with leading whitespace removed
 * db.select(ltrim(cars.make)).from(cars)
 * ```
 */
export function ltrim<T>(value: SQL.Aliased<T>): SQL<string>;
export function ltrim<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function ltrim(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`ltrim(${value})`;
}

/**
 * rtrim
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make with trailing whitespace removed
 * db.select(rtrim(cars.make)).from(cars)
 * ```
 */
export function rtrim<T>(value: SQL.Aliased<T>): SQL<string>;
export function rtrim<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function rtrim(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`rtrim(${value})`;
}

/**
 * trim
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make with leading and trailing whitespace removed
 * db.select(trim(cars.make)).from(cars)
 * ```
 */
export function trim<T>(value: SQL.Aliased<T>): SQL<string>;
export function trim<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function trim(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`trim(${value})`;
}

/**
 * replace
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make with all 'a' characters replaced with 'b'
 * db.select(replace(cars.make, 'a', 'b')).from(cars)
 * ```
 */
export function replace<T>(from: SQL.Aliased<T>, to: T | Placeholder | SQLWrapper | AnyColumn): SQL<string>;
export function replace<TColumn extends AnyColumn>(from: TColumn, to: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<string>;
export function replace(from: AnyColumn | SQL.Aliased, to: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<string> {
	return sql`replace(${from}, ${bindIfParam(to, from)})`;
}

/**
 * reverse
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make reversed
 * db.select(reverse(cars.make)).from(cars)
 * ```
 */
export function reverse<T>(value: SQL.Aliased<T>): SQL<string>;
export function reverse<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function reverse(value: AnyColumn | SQL.Aliased): SQL<string> {
	return sql`reverse(${value})`;
}

/**
 * substring
 *
 * ## Examples
 *
 * ```ts
 * // Select the first 3 characters of the car make
 * db.select(substring(cars.make, 1, 3)).from(cars)
 * ```
 */
export function substring<T>(value: SQL.Aliased<T>, start: number, length?: number): SQL<string>;
export function substring<TColumn extends AnyColumn>(value: TColumn, start: number, length?: number): SQL<string>;
export function substring(value: AnyColumn | SQL.Aliased, start: number, length?: number): SQL<string> {
	return length === undefined ? sql`substring(${value}, ${start})` : sql`substring(${value}, ${start}, ${length})`;
}

/**
 * left
 *
 * ## Examples
 *
 * ```ts
 * // Select the first 3 characters of the car make
 * db.select(left(cars.make, 3)).from(cars)
 * ```
 */
export function left<T>(value: SQL.Aliased<T>, length: number): SQL<string>;
export function left<TColumn extends AnyColumn>(value: TColumn, length: number): SQL<string>;
export function left(value: AnyColumn | SQL.Aliased, length: number): SQL<string> {
	return sql`left(${value}, ${length})`;
}

/**
 * right
 *
 * ## Examples
 *
 * ```ts
 * // Select the last 3 characters of the car make
 * db.select(right(cars.make, 3)).from(cars)
 * ```
 */
export function right<T>(value: SQL.Aliased<T>, length: number): SQL<string>;
export function right<TColumn extends AnyColumn>(value: TColumn, length: number): SQL<string>;
export function right(value: AnyColumn | SQL.Aliased, length: number): SQL<string> {
	return sql`right(${value}, ${length})`;
}

/**
 * repeat
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make repeated 3 times
 * db.select(repeat(cars.make, 3)).from(cars)
 * ```
 */
export function repeat<T>(value: SQL.Aliased<T>, count: number): SQL<string>;
export function repeat<TColumn extends AnyColumn>(value: TColumn, count: number): SQL<string>;
export function repeat(value: AnyColumn | SQL.Aliased, count: number): SQL<string> {
	return sql`repeat(${value}, ${count})`;
}
