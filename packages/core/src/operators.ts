import { type AnyColumn, bindIfParam, type GetColumnData, isSQLWrapper, type Placeholder, type SQL, sql, type SQLWrapper } from "drizzle-orm";

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
export function plus<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function plus<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function plus(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} + ${bindIfParam(right, left as SQL.Aliased)}`;
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
export function minus<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function minus<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function minus(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} - ${bindIfParam(right, left as SQL.Aliased)}`;
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
export function times<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function times<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function times(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} * ${bindIfParam(right, left as SQL.Aliased)}`;
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
export function divide<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function divide<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL<number>;
export function divide(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL<number> {
	return sql`${left} / ${bindIfParam(right, left as SQL.Aliased)}`;
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
export function sameAs<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function sameAs<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function sameAs(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} ~= ${bindIfParam(right, left as SQL.Aliased)}`;
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
export function count<T>(value?: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function count<TColumn extends AnyColumn>(value?: TColumn): SQL<number>;
export function count(value?: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	if (value === undefined) return sql`count(*)::int`;
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
export function sum<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function sum<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function sum(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function avg<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function avg<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function avg(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function min<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function min<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function min(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function max<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function max<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function max(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function ascii<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function ascii<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function ascii(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function bitLength<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function bitLength<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function bitLength(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function charLength<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function charLength<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function charLength(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function lower<T>(value: SQL.Aliased<T> | SQL<T>): SQL<string>;
export function lower<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function lower(value: AnyColumn | SQL.Aliased | SQL): SQL<string> {
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
export function upper<T>(value: SQL.Aliased<T> | SQL<T>): SQL<string>;
export function upper<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function upper(value: AnyColumn | SQL.Aliased | SQL): SQL<string> {
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
export function length<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function length<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function length(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function ltrim<T>(value: SQL.Aliased<T> | SQL<T>): SQL<string>;
export function ltrim<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function ltrim(value: AnyColumn | SQL.Aliased | SQL): SQL<string> {
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
export function rtrim<T>(value: SQL.Aliased<T> | SQL<T>): SQL<string>;
export function rtrim<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function rtrim(value: AnyColumn | SQL.Aliased | SQL): SQL<string> {
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
export function trim<T>(value: SQL.Aliased<T> | SQL<T>): SQL<string>;
export function trim<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function trim(value: AnyColumn | SQL.Aliased | SQL): SQL<string> {
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
export function replace<T>(column: SQL.Aliased<T> | SQL<T>, from: string, to: string): SQL<string>;
export function replace<TColumn extends AnyColumn>(column: TColumn, from: string, to: string): SQL<string>;
export function replace(column: AnyColumn | SQL.Aliased | SQL, from: string, to: string): SQL<string> {
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
export function reverse<T>(value: SQL.Aliased<T> | SQL<T>): SQL<string>;
export function reverse<TColumn extends AnyColumn>(value: TColumn): SQL<string>;
export function reverse(value: AnyColumn | SQL.Aliased | SQL): SQL<string> {
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
export function substring<T>(value: SQL.Aliased<T> | SQL<T>, start: number, length?: number): SQL<string>;
export function substring<TColumn extends AnyColumn>(value: TColumn, start: number, length?: number): SQL<string>;
export function substring(value: AnyColumn | SQL.Aliased | SQL, start: number, length?: number): SQL<string> {
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
export function left<T>(value: SQL.Aliased<T> | SQL<T>, length: number): SQL<string>;
export function left<TColumn extends AnyColumn>(value: TColumn, length: number): SQL<string>;
export function left(value: AnyColumn | SQL.Aliased | SQL, length: number): SQL<string> {
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
export function right<T>(value: SQL.Aliased<T> | SQL<T>, length: number): SQL<string>;
export function right<TColumn extends AnyColumn>(value: TColumn, length: number): SQL<string>;
export function right(value: AnyColumn | SQL.Aliased | SQL, length: number): SQL<string> {
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
export function repeat<T>(value: SQL.Aliased<T> | SQL<T>, count: number): SQL<string>;
export function repeat<TColumn extends AnyColumn>(value: TColumn, count: number): SQL<string>;
export function repeat(value: AnyColumn | SQL.Aliased | SQL, count: number): SQL<string> {
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
export function abs<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function abs<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function abs(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function ceil<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function ceil<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function ceil(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function floor<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function floor<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function floor(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function round<T>(value: SQL.Aliased<T> | SQL<T>, decimals?: number): SQL<number>;
export function round<TColumn extends AnyColumn>(value: TColumn, decimals?: number): SQL<number>;
export function round(value: AnyColumn | SQL.Aliased | SQL, decimals?: number): SQL<number> {
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
export function sign<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function sign<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function sign(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function sqrt<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function sqrt<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function sqrt(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
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
export function power<T>(value: SQL.Aliased<T> | SQL<T>, exponent: number): SQL<number>;
export function power<TColumn extends AnyColumn>(value: TColumn, exponent: number): SQL<number>;
export function power(value: AnyColumn | SQL.Aliased | SQL, exponent: number): SQL<number> {
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
export function lpad<T>(value: SQL.Aliased<T> | SQL<T>, length: number, pad: string): SQL<string>;
export function lpad<TColumn extends AnyColumn>(value: TColumn, length: number, pad: string): SQL<string>;
export function lpad(value: AnyColumn | SQL.Aliased | SQL, length: number, pad: string): SQL<string> {
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
export function rpad<T>(value: SQL.Aliased<T> | SQL<T>, length: number, pad: string): SQL<string>;
export function rpad<TColumn extends AnyColumn>(value: TColumn, length: number, pad: string): SQL<string>;
export function rpad(value: AnyColumn | SQL.Aliased | SQL, length: number, pad: string): SQL<string> {
	return sql`rpad(${value}, ${length}::int, ${pad})`;
}

/**
 * extractCentury
 *
 * ## Examples
 *
 * ```ts
 * // Select the century from the car's date
 * db.select(extractCentury(cars.date)).from(cars)
 * ```
 */
export function extractCentury<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractCentury<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractCentury(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(century from ${value})::float`;
}

/**
 * extractDay
 *
 * ## Examples
 *
 * ```ts
 * // Select the day from the car's date
 * db.select(extractDay(cars.date)).from(cars)
 * ```
 */
export function extractDay<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractDay<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractDay(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(day from ${value})::float`;
}

/**
 * extractDecade
 *
 * ## Examples
 *
 * ```ts
 * // Select the decade from the car's date
 * db.select(extractDecade(cars.date)).from(cars)
 * ```
 */
export function extractDecade<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractDecade<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractDecade(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(decade from ${value})::float`;
}

/**
 * extractDow
 *
 * ## Examples
 *
 * ```ts
 * // Select the day of the week from the car's date
 * db.select(extractDow(cars.date)).from(cars)
 * ```
 */
export function extractDow<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractDow<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractDow(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(dow from ${value})::float`;
}

/**
 * extractDoy
 *
 * ## Examples
 *
 * ```ts
 * // Select the day of the year from the car's date
 * db.select(extractDoy(cars.date)).from(cars)
 * ```
 */
export function extractDoy<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractDoy<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractDoy(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(doy from ${value})::float`;
}

/**
 * extractEpoch
 *
 * ## Examples
 *
 * ```ts
 * // Select the epoch from the car's date
 * db.select(extractEpoch(cars.date)).from(cars)
 * ```
 */
export function extractEpoch<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractEpoch<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractEpoch(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(epoch from ${value})::float`;
}

/**
 * extractHour
 *
 * ## Examples
 *
 * ```ts
 * // Select the hour from the car's date
 * db.select(extractHour(cars.date)).from(cars)
 * ```
 */
export function extractHour<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractHour<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractHour(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(hour from ${value})::float`;
}

/**
 * extractIsoDow
 *
 * ## Examples
 *
 * ```ts
 * // Select the ISO day of the week from the car's date
 * db.select(extractIsoDow(cars.date)).from(cars)
 * ```
 */
export function extractIsoDow<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractIsoDow<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractIsoDow(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(isodow from ${value})::float`;
}

/**
 * extractIsoYear
 *
 * ## Examples
 *
 * ```ts
 * // Select the ISO year from the car's date
 * db.select(extractIsoYear(cars.date)).from(cars)
 * ```
 */
export function extractIsoYear<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractIsoYear<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractIsoYear(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(isoyear from ${value})::float`;
}

/**
 * extractMicroseconds
 *
 * ## Examples
 *
 * ```ts
 * // Select the microseconds from the car's date
 * db.select(extractMicroseconds(cars.date)).from(cars)
 * ```
 */
export function extractMicroseconds<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractMicroseconds<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractMicroseconds(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(microseconds from ${value})::float`;
}

/**
 * extractMillennium
 *
 * ## Examples
 *
 * ```ts
 * // Select the millennium from the car's date
 * db.select(extractMillennium(cars.date)).from(cars)
 * ```
 */
export function extractMillennium<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractMillennium<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractMillennium(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(millennium from ${value})::float`;
}

/**
 * extractMilliseconds
 *
 * ## Examples
 *
 * ```ts
 * // Select the milliseconds from the car's date
 * db.select(extractMilliseconds(cars.date)).from(cars)
 * ```
 */
export function extractMilliseconds<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractMilliseconds<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractMilliseconds(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(milliseconds from ${value})::float`;
}

/**
 * extractMinute
 *
 * ## Examples
 *
 * ```ts
 * // Select the minute from the car's date
 * db.select(extractMinute(cars.date)).from(cars)
 * ```
 */
export function extractMinute<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractMinute<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractMinute(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(minute from ${value})::float`;
}

/**
 * extractMonth
 *
 * ## Examples
 *
 * ```ts
 * // Select the month from the car's date
 * db.select(extractMonth(cars.date)).from(cars)
 * ```
 */
export function extractMonth<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractMonth<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractMonth(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(month from ${value})::float`;
}

/**
 * extractQuarter
 *
 * ## Examples
 *
 * ```ts
 * // Select the quarter from the car's date
 * db.select(extractQuarter(cars.date)).from(cars)
 * ```
 */
export function extractQuarter<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractQuarter<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractQuarter(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(quarter from ${value})::float`;
}

/**
 * extractSecond
 *
 * ## Examples
 *
 * ```ts
 * // Select the second from the car's date
 * db.select(extractSecond(cars.date)).from(cars)
 * ```
 */
export function extractSecond<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractSecond<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractSecond(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(second from ${value})::float`;
}

/**
 * extractTimezone
 *
 * ## Examples
 *
 * ```ts
 * // Select the timezone from the car's date
 * db.select(extractTimezone(cars.date)).from(cars)
 * ```
 */
export function extractTimezone<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractTimezone<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractTimezone(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(timezone from ${value})::float`;
}

/**
 * extractTimezoneHour
 *
 * ## Examples
 *
 * ```ts
 * // Select the timezone hour from the car's date
 * db.select(extractTimezoneHour(cars.date)).from(cars)
 * ```
 */
export function extractTimezoneHour<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractTimezoneHour<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractTimezoneHour(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(timezone_hour from ${value})::float`;
}

/**
 * extractTimezoneMinute
 *
 * ## Examples
 *
 * ```ts
 * // Select the timezone minute from the car's date
 * db.select(extractTimezoneMinute(cars.date)).from(cars)
 * ```
 */
export function extractTimezoneMinute<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractTimezoneMinute<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractTimezoneMinute(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(timezone_minute from ${value})::float`;
}

/**
 * extractWeek
 *
 * ## Examples
 *
 * ```ts
 * // Select the week from the car's date
 * db.select(extractWeek(cars.date)).from(cars)
 * ```
 */
export function extractWeek<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractWeek<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractWeek(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(week from ${value})::float`;
}

/**
 * extractUnix
 *
 * ## Examples
 *
 * ```ts
 * // Select the year from the car's date
 * db.select().from(cars).where(gt(extractUnix(cars.date), Date.now() + 1000 * 60))
 * ```
 */
export function extractUnix<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractUnix<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractUnix(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`(extract(epoch from ${value})::float * 1000)::float`;
}

/**
 * extractYear
 *
 * ## Examples
 *
 * ```ts
 * // Select the year from the car's date
 * db.select(extractYear(cars.date)).from(cars)
 * ```
 */
export function extractYear<T>(value: SQL.Aliased<T> | SQL<T>): SQL<number>;
export function extractYear<TColumn extends AnyColumn>(value: TColumn): SQL<number>;
export function extractYear(value: AnyColumn | SQL.Aliased | SQL): SQL<number> {
	return sql`extract(year from ${value})::float`;
}

/**
 * Test that two values are equal.
 *
 * Remember that the SQL standard dictates that
 * two NULL values are not equal, so if you want to test
 * whether a value is null, you may want to use
 * `isNull` instead.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by Ford
 * db.select().from(cars)
 *   .where(eq(cars.make, 'Ford'))
 * ```
 *
 * @see isNull for a way to test equality to NULL.
 */
export function eq<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function eq<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function eq(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} = ${bindIfParam(right, left as AnyColumn)}`;
}

export const equal = eq;
export const equals = eq;
export const is = eq;

/**
 * Test that two values are not equal.
 *
 * Remember that the SQL standard dictates that
 * two NULL values are not equal, so if you want to test
 * whether a value is not null, you may want to use
 * `isNotNull` instead.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars not made by Ford
 * db.select().from(cars)
 *   .where(ne(cars.make, 'Ford'))
 * ```
 *
 * @see isNotNull for a way to test whether a value is not null.
 */
export function ne<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function ne<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function ne(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} <> ${bindIfParam(right, left as AnyColumn)}`;
}

export const notEqual = ne;
export const notEquals = ne;
export const isNot = ne;
export const neq = ne;

/**
 * Combine a list of conditions with the `and` operator. Conditions
 * that are equal `undefined` are automatically ignored.
 *
 * ## Examples
 *
 * ```ts
 * db.select().from(cars)
 *   .where(
 *     and(
 *       eq(cars.make, 'Volvo'),
 *       eq(cars.year, 1950),
 *     )
 *   )
 * ```
 */
export function and(...conditions: (SQL | undefined)[]): SQL | undefined;
export function and(...unfilteredConditions: (SQL | undefined)[]): SQL | undefined {
	const conditions = unfilteredConditions.filter((c): c is Exclude<typeof c, undefined> => c !== undefined);

	if (conditions.length === 0) return undefined;

	if (conditions.length === 1) return conditions[0];

	const chunks: SQL[] = [sql.raw("(")];
	for (const [index, condition] of conditions.entries()) {
		if (index === 0) chunks.push(condition);
		else chunks.push(sql` and `, condition);
	}
	chunks.push(sql`)`);

	return sql.fromList(chunks);
}

/**
 * Combine a list of conditions with the `or` operator. Conditions
 * that are equal `undefined` are automatically ignored.
 *
 * ## Examples
 *
 * ```ts
 * db.select().from(cars)
 *   .where(
 *     or(
 *       eq(cars.make, 'GM'),
 *       eq(cars.make, 'Ford'),
 *     )
 *   )
 * ```
 */
export function or(...conditions: (SQL | undefined)[]): SQL | undefined;
export function or(...unfilteredConditions: (SQL | undefined)[]): SQL | undefined {
	const conditions = unfilteredConditions.filter((c): c is Exclude<typeof c, undefined> => c !== undefined);

	if (conditions.length === 0) return undefined;

	if (conditions.length === 1) return conditions[0];

	const chunks: SQL[] = [sql.raw("(")];
	for (const [index, condition] of conditions.entries()) {
		if (index === 0) chunks.push(condition);
		else chunks.push(sql` or `, condition);
	}
	chunks.push(sql`)`);

	return sql.fromList(chunks);
}

/**
 * Negate the meaning of an expression using the `not` keyword.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars _not_ made by GM or Ford.
 * db.select().from(cars)
 *   .where(not(inArray(cars.make, ['GM', 'Ford'])))
 * ```
 */
export function not(condition: SQL): SQL {
	return sql`not ${condition}`;
}

/**
 * Test that the first expression passed is greater than
 * the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made after 2000.
 * db.select().from(cars)
 *   .where(gt(cars.year, 2000))
 * ```
 *
 * @see gte for greater-than-or-equal
 */
export function gt<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function gt<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function gt(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} > ${bindIfParam(right, left as AnyColumn)}`;
}

export const greaterThan = gt;
export const isGreaterThan = gt;

/**
 * Test that the first expression passed is greater than
 * or equal to the second expression. Use `gt` to
 * test whether an expression is strictly greater
 * than another.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made on or after 2000.
 * db.select().from(cars)
 *   .where(gte(cars.year, 2000))
 * ```
 *
 * @see gt for a strictly greater-than condition
 */
export function gte<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function gte<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function gte(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} >= ${bindIfParam(right, left as AnyColumn)}`;
}

export const greaterThanOrEqual = gte;
export const isGreaterThanOrEqual = gte;

/**
 * Test that the first expression passed is less than
 * the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made before 2000.
 * db.select().from(cars)
 *   .where(lt(cars.year, 2000))
 * ```
 *
 * @see lte for greater-than-or-equal
 */
export function lt<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function lt<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function lt(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} < ${bindIfParam(right, left as AnyColumn)}`;
}

export const lessThan = lt;
export const isLessThan = lt;

/**
 * Test that the first expression passed is less than
 * or equal to the second expression.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made before 2000.
 * db.select().from(cars)
 *   .where(lte(cars.year, 2000))
 * ```
 *
 * @see lt for a strictly less-than condition
 */
export function lte<T>(left: SQL.Aliased<T> | SQL<T>, right: T | Placeholder | SQLWrapper | AnyColumn): SQL;
export function lte<TColumn extends AnyColumn>(left: TColumn, right: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper | AnyColumn): SQL;
export function lte(left: AnyColumn | SQL.Aliased | SQL, right: unknown | Placeholder | SQLWrapper | AnyColumn): SQL {
	return sql`${left} <= ${bindIfParam(right, left as AnyColumn)}`;
}

export const lessThanOrEqual = lte;
export const isLessThanOrEqual = lte;

/**
 * Test whether the first parameter, a column or expression,
 * has a value from a list passed as the second argument.
 *
 * ## Throws
 *
 * The argument passed in the second array can’t be empty:
 * if an empty is provided, this method will throw.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by Ford or GM.
 * db.select().from(cars)
 *   .where(inArray(cars.make, ['Ford', 'GM']))
 * ```
 *
 * @see notInArray for the inverse of this test
 */
/* c8 ignore next 11 */
export function inArray<T>(column: SQL.Aliased<T> | SQL<T>, values: (T | Placeholder)[] | Placeholder | SQLWrapper): SQL;
export function inArray<TColumn extends AnyColumn>(column: TColumn, values: (GetColumnData<TColumn, "raw"> | Placeholder)[] | Placeholder | SQLWrapper): SQL;
export function inArray(column: AnyColumn | SQL.Aliased | SQL, values: (unknown | Placeholder)[] | Placeholder | SQLWrapper): SQL {
	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("inArray requires at least one value");

		return sql`${column} in ${values.map(v => bindIfParam(v, column as AnyColumn))}`;
	}

	return sql`${column} in ${bindIfParam(values, column as AnyColumn)}`;
}

/**
 * Test whether the first parameter, a column or expression,
 * has a value that is not present in a list passed as the
 * second argument.
 *
 * ## Throws
 *
 * The argument passed in the second array can’t be empty:
 * if an empty is provided, this method will throw.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made by any company except Ford or GM.
 * db.select().from(cars)
 *   .where(notInArray(cars.make, ['Ford', 'GM']))
 * ```
 *
 * @see inArray for the inverse of this test
 */
/* c8 ignore next 13 */
export function notInArray<T>(column: SQL.Aliased<T> | SQL<T>, values: (T | Placeholder)[] | Placeholder | SQLWrapper): SQL;
export function notInArray<TColumn extends AnyColumn>(column: TColumn, values: (GetColumnData<TColumn, "raw"> | Placeholder)[] | Placeholder | SQLWrapper): SQL;
export function notInArray(column: AnyColumn | SQL.Aliased | SQL, values: (unknown | Placeholder)[] | Placeholder | SQLWrapper): SQL {
	if (isSQLWrapper(values)) return sql`${column} not in ${values}`;

	if (Array.isArray(values)) {
		if (values.length === 0) throw new Error("inArray requires at least one value");

		return sql`${column} not in ${values.map(v => bindIfParam(v, column as AnyColumn))}`;
	}

	return sql`${column} not in ${bindIfParam(values, column as AnyColumn)}`;
}

export const notIn = notInArray;
export const nin = notInArray;

/**
 * Test whether an expression is NULL. By the SQL standard,
 * NULL is neither equal nor not equal to itself, so
 * it's recommended to use `isNull` and `notIsNull` for
 * comparisons to NULL.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars that have no discontinuedAt date.
 * db.select().from(cars)
 *   .where(isNull(cars.discontinuedAt))
 * ```
 *
 * @see isNotNull for the inverse of this test
 */
export function isNull(column: AnyColumn | Placeholder | SQLWrapper): SQL {
	return sql`${column} is null`;
}

/**
 * Test whether an expression is not NULL. By the SQL standard,
 * NULL is neither equal nor not equal to itself, so
 * it's recommended to use `isNull` and `notIsNull` for
 * comparisons to NULL.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars that have been discontinued.
 * db.select().from(cars)
 *   .where(isNotNull(cars.discontinuedAt))
 * ```
 *
 * @see isNull for the inverse of this test
 */
export function isNotNull(column: AnyColumn | Placeholder | SQLWrapper): SQL {
	return sql`${column} is not null`;
}

/**
 * Test whether a subquery evaluates to have any rows.
 *
 * ## Examples
 *
 * ```ts
 * // Users whose `homeCity` column has a match in a cities
 * // table.
 * db
 *   .select()
 *   .from(users)
 *   .where(
 *     exists(db.select()
 *       .from(cities)
 *       .where(eq(users.homeCity, cities.id))),
 *   );
 * ```
 *
 * @see notExists for the inverse of this test
 */
/* c8 ignore next 3 */
export function exists(subquery: SQLWrapper): SQL {
	return sql`exists (${subquery})`;
}

/**
 * Test whether a subquery doesn't include any result
 * rows.
 *
 * ## Examples
 *
 * ```ts
 * // Users whose `homeCity` column doesn't match
 * // a row in the cities table.
 * db
 *   .select()
 *   .from(users)
 *   .where(
 *     notExists(db.select()
 *       .from(cities)
 *       .where(eq(users.homeCity, cities.id))),
 *   );
 * ```
 *
 * @see exists for the inverse of this test
 */
/* c8 ignore next 3 */
export function notExists(subquery: SQLWrapper): SQL {
	return sql`not exists (${subquery})`;
}

/**
 * Test whether an expression is between two values. This
 * is an easier way to express range tests, which would be
 * expressed mathematically as `x <= a <= y` but in SQL
 * would have to be like `a >= x AND a <= y`.
 *
 * Between is inclusive of the endpoints: if `column`
 * is equal to `min` or `max`, it will be TRUE.
 *
 * ## Examples
 *
 * ```ts
 * // Select cars made between 1990 and 2000
 * db.select().from(cars)
 *   .where(between(cars.year, 1990, 2000))
 * ```
 *
 * @see notBetween for the inverse of this test
 */
export function between<T>(column: SQL.Aliased, min: T | Placeholder | SQLWrapper, max: T | Placeholder | SQLWrapper): SQL;
export function between<TColumn extends AnyColumn>(
	column: TColumn,
	min: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper,
	max: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper
): SQL;
export function between(column: AnyColumn | SQL.Aliased | SQL, min: unknown | Placeholder | SQLWrapper, max: unknown | Placeholder | SQLWrapper): SQL {
	return sql`${column} between ${bindIfParam(min, column as AnyColumn)} and ${bindIfParam(max, column as AnyColumn)}`;
}

export const btwn = between;
export const isBetween = between;

/**
 * Test whether an expression is not between two values.
 *
 * This, like `between`, includes its endpoints, so if
 * the `column` is equal to `min` or `max`, in this case
 * it will evaluate to FALSE.
 *
 * ## Examples
 *
 * ```ts
 * // Exclude cars made in the 1970s
 * db.select().from(cars)
 *   .where(notBetween(cars.year, 1970, 1979))
 * ```
 *
 * @see between for the inverse of this test
 */
export function notBetween<T>(column: SQL.Aliased, min: T | Placeholder | SQLWrapper, max: T | Placeholder | SQLWrapper): SQL;
export function notBetween<TColumn extends AnyColumn>(
	column: TColumn,
	min: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper,
	max: GetColumnData<TColumn, "raw"> | Placeholder | SQLWrapper
): SQL;
export function notBetween(column: AnyColumn | SQL.Aliased | SQL, min: unknown | Placeholder | SQLWrapper, max: unknown | Placeholder | SQLWrapper): SQL {
	return sql`${column} not between ${bindIfParam(min, column as AnyColumn)} and ${bindIfParam(max, column as AnyColumn)}`;
}

export const nbtwn = notBetween;
export const notBtwn = notBetween;
export const isNotBetween = notBetween;

/**
 * Compare a column to a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars with 'Turbo' in their names.
 * db.select().from(cars)
 *   .where(like(cars.name, '%Turbo%'))
 * ```
 *
 * @see ilike for a case-insensitive version of this condition
 */
export function like(column: AnyColumn, value: string | Placeholder | SQLWrapper): SQL {
	return sql`${column} like ${value}`;
}

/**
 * The inverse of like - this tests that a given column
 * does not match a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars that don't have "ROver" in their name.
 * db.select().from(cars)
 *   .where(notLike(cars.name, '%Rover%'))
 * ```
 *
 * @see like for the inverse condition
 * @see notIlike for a case-insensitive version of this condition
 */
export function notLike(column: AnyColumn, value: string | Placeholder | SQLWrapper): SQL {
	return sql`${column} not like ${value}`;
}

/**
 * Case-insensitively compare a column to a pattern,
 * which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * Unlike like, this performs a case-insensitive comparison.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars with 'Turbo' in their names.
 * db.select().from(cars)
 *   .where(ilike(cars.name, '%Turbo%'))
 * ```
 *
 * @see like for a case-sensitive version of this condition
 */
export function ilike(column: AnyColumn, value: string | Placeholder | SQLWrapper): SQL {
	return sql`${column} ilike ${value}`;
}

/**
 * The inverse of ilike - this case-insensitively tests that a given column
 * does not match a pattern, which can include `%` and `_`
 * characters to match multiple variations. Including `%`
 * in the pattern matches zero or more characters, and including
 * `_` will match a single character.
 *
 * ## Examples
 *
 * ```ts
 * // Select all cars that don't have "Rover" in their name.
 * db.select().from(cars)
 *   .where(notLike(cars.name, '%Rover%'))
 * ```
 *
 * @see ilike for the inverse condition
 * @see notLike for a case-sensitive version of this condition
 */
export function notIlike(column: AnyColumn, value: string | Placeholder | SQLWrapper): SQL {
	return sql`${column} not ilike ${value}`;
}

/**
 * Used in sorting, this specifies that the given
 * column or expression should be sorted in ascending
 * order. By the SQL standard, ascending order is the
 * default, so it is not usually necessary to specify
 * ascending sort order.
 *
 * ## Examples
 *
 * ```ts
 * // Return cars, starting with the oldest models
 * // and going in ascending order to the newest.
 * db.select().from(cars)
 *   .orderBy(asc(cars.year));
 * ```
 *
 * @see desc to sort in descending order
 */
/* c8 ignore next 3 */
export function asc(column: AnyColumn | SQLWrapper): SQL {
	return sql`${column} asc`;
}

/**
 * Used in sorting, this specifies that the given
 * column or expression should be sorted in descending
 * order.
 *
 * ## Examples
 *
 * ```ts
 * // Select users, with the most recently created
 * // records coming first.
 * db.select().from(users)
 *   .orderBy(desc(users.createdAt));
 * ```
 *
 * @see asc to sort in ascending order
 */
/* c8 ignore next 3 */
export function desc(column: AnyColumn | SQLWrapper): SQL {
	return sql`${column} desc`;
}
