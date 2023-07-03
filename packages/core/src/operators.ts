import { AnyColumn, bindIfParam, GetColumnData, Placeholder, SQL, sql, SQLWrapper } from "drizzle-orm";
export {
	and,
	asc,
	between,
	between as btwn,
	desc,
	eq,
	eq as equal,
	eq as equals,
	exists,
	gt as greaterThan,
	gte as greaterThanOrEqual,
	gt,
	gte,
	ilike,
	inArray,
	eq as is,
	between as isBetween,
	gt as isGreaterThan,
	gte as isGreaterThanOrEqual,
	lt as isLessThan,
	lte as isLessThanOrEqual,
	ne as isNot,
	notBetween as isNotBetween,
	isNotNull,
	isNull,
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
	notExists,
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
export function ascii<T>(value: SQL.Aliased<T>): SQL<number>;
export function ascii<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function ascii(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`ascii(${value})::int`;
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
export function replace<T>(column: SQL.Aliased<T>, from: string, to: string): SQL<string>;
export function replace<TColumn extends AnyColumn>(column: TColumn, from: string, to: string): SQL<string>;
export function replace(column: AnyColumn | SQL.Aliased, from: string, to: string): SQL<string> {
	return sql`replace(${column}, ${from}, ${to})`;
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
	return length === undefined ? sql`substring(${value}, ${start}::int)` : sql`substring(${value}, ${start}::int, ${length}::int)`;
}

export const substr = substring;

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
	return sql`left(${value}, ${length}::int)`;
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
	return sql`right(${value}, ${length}::int)`;
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
	return sql`repeat(${value}, ${count}::int)`;
}

/**
 * abs
 *
 * ## Examples
 *
 * ```ts
 * // Select the absolute value of the car price
 * db.select(abs(cars.price)).from(cars)
 * ```
 */
export function abs<T>(value: SQL.Aliased<T>): SQL<number>;
export function abs<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function abs(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`abs(${value})::int`;
}

/**
 * ceil
 *
 * ## Examples
 *
 * ```ts
 * // Select the ceiling of the car price
 * db.select(ceil(cars.price)).from(cars)
 * ```
 */
export function ceil<T>(value: SQL.Aliased<T>): SQL<number>;
export function ceil<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function ceil(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`ceil(${value})::int`;
}

export const ceiling = ceil;

/**
 * floor
 *
 * ## Examples
 *
 * ```ts
 * // Select the floor of the car price
 * db.select(floor(cars.price)).from(cars)
 * ```
 */
export function floor<T>(value: SQL.Aliased<T>): SQL<number>;
export function floor<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function floor(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`floor(${value})::int`;
}

/**
 * round
 *
 * ## Examples
 *
 * ```ts
 * // Select the car price rounded to the nearest integer
 * db.select(round(cars.price)).from(cars)
 * ```
 */
export function round<T>(value: SQL.Aliased<T>, decimals?: number): SQL<number>;
export function round<TColumn extends AnyColumn>(value: TColumn, decimals?: number): SQL<number>;
export function round(value: AnyColumn | SQL.Aliased, decimals?: number): SQL<number> {
	return decimals === undefined ? sql`round(${value}::numeric)::int` : sql`round(${value}::numeric, ${decimals}::int)::float`;
}

/**
 * sign
 *
 * ## Examples
 *
 * ```ts
 * // Select the sign of the car price
 * db.select(sign(cars.price)).from(cars)
 * ```
 */
export function sign<T>(value: SQL.Aliased<T>): SQL<number>;
export function sign<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function sign(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`sign(${value})::int`;
}

/**
 * sqrt
 *
 * ## Examples
 *
 * ```ts
 * // Select the square root of the car price
 * db.select(sqrt(cars.price)).from(cars)
 * ```
 */
export function sqrt<T>(value: SQL.Aliased<T>): SQL<number>;
export function sqrt<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function sqrt(value: AnyColumn | SQL.Aliased): SQL<number> {
	return sql`sqrt(${value})::int`;
}

/**
 * power
 *
 * ## Examples
 *
 * ```ts
 * // Select the car price to the power of 2
 * db.select(power(cars.price, 2)).from(cars)
 * ```
 */
export function power<T>(value: SQL.Aliased<T>, exponent: number): SQL<number>;
export function power<TColumn extends AnyColumn>(value: TColumn, exponent: number): SQL<number>;
export function power(value: AnyColumn | SQL.Aliased, exponent: number): SQL<number> {
	return sql`power(${value}, ${exponent}::int)::int`;
}

export const pow = power;

/**
 * pi
 *
 * ## Examples
 *
 * ```ts
 * // Select the value of pi
 * db.select(pi()).from(cars)
 * ```
 */
export function pi(): SQL<number> {
	return sql`pi()::float4`;
}

/**
 * lpad
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make padded to 10 characters with spaces
 * db.select(lpad(cars.make, 10, " ")).from(cars)
 * ```
 */
export function lpad<T>(value: SQL.Aliased<T>, length: number, pad: string): SQL<string>;
export function lpad<TColumn extends AnyColumn>(value: TColumn, length: number, pad: string): SQL<string>;
export function lpad(value: AnyColumn | SQL.Aliased, length: number, pad: string): SQL<string> {
	return sql`lpad(${value}, ${length}::int, ${pad})`;
}

/**
 * rpad
 *
 * ## Examples
 *
 * ```ts
 * // Select the car make padded to 10 characters with spaces
 * db.select(rpad(cars.make, 10, " ")).from(cars)
 * ```
 */
export function rpad<T>(value: SQL.Aliased<T>, length: number, pad: string): SQL<string>;
export function rpad<TColumn extends AnyColumn>(value: TColumn, length: number, pad: string): SQL<string>;
export function rpad(value: AnyColumn | SQL.Aliased, length: number, pad: string): SQL<string> {
	return sql`rpad(${value}, ${length}::int, ${pad})`;
}
