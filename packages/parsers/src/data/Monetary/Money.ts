import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import type { BigNumber } from "bignumber.js";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { getBigNumber } from "../../util/getBigNumber.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";

const bigNumber = getBigNumber("-92233720368547758.08", "92233720368547758.07");

interface MoneyObject {
	value: string;
}

interface Money {
	money: BigNumber;

	value: string;

	toString(): string;
	toBigNumber(): BigNumber;
	toJSON(): MoneyObject;

	equals(string: string): boolean;
	equals(number: number): boolean;
	equals(bigInt: bigint): boolean;
	equals(bigNumber: BigNumber): boolean;
	equals(object: Money | MoneyObject): boolean;
	safeEquals(string: string): SafeEquals<Money>;
	safeEquals(number: number): SafeEquals<Money>;
	safeEquals(bigInt: bigint): SafeEquals<Money>;
	safeEquals(bigNumber: BigNumber): SafeEquals<Money>;
	safeEquals(object: Money | MoneyObject): SafeEquals<Money>;
}

interface MoneyConstructor {
	from(string: string): Money;
	from(number: number): Money;
	from(bigInt: bigint): Money;
	from(bigNumber: BigNumber): Money;
	from(object: Money | MoneyObject): Money;
	safeFrom(string: string): SafeFrom<Money>;
	safeFrom(number: number): SafeFrom<Money>;
	safeFrom(bigInt: bigint): SafeFrom<Money>;
	safeFrom(bigNumber: BigNumber): SafeFrom<Money>;
	safeFrom(object: Money | MoneyObject): SafeFrom<Money>;
	/**
	 * Returns `true` if `object` is a `Money`, `false` otherwise.
	 */
	isMoney(object: any): object is Money;
}

class MoneyConstructorClass extends PGTPConstructorBase<Money> implements MoneyConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Money> {
		if (context.data.length !== 1) {
			this.setIssueForContext(
				context,
				context.data.length > 1
					? {
							code: "too_big",
							type: "arguments",
							maximum: 1,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 1,
							exact: true,
					  }
			);
			return INVALID;
		}

		const [argument] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType.bigNumber, ParsedType.bigint],
			parsedType = getParsedType(argument);

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case ParsedType.object:
				return this._parseObject(context, argument as MoneyObject);
			default:
				return this._parseString(context, argument as string);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Money> {
		const parsedNumber = bigNumber(argument);
		if (parsedNumber.success) return OK(new MoneyClass(parsedNumber.data));
		this.setIssueForContext(context, parsedNumber.error);
		return INVALID;
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Money> {
		if (this.isMoney(argument)) return OK(new MoneyClass(argument.money));
		const parsedObject = hasKeys<MoneyObject>(argument, [["value", "string"]]);
		if (parsedObject.success) return this._parseString(context, parsedObject.obj.value);

		switch (true) {
			case parsedObject.otherKeys.length > 0:
				this.setIssueForContext(context, {
					code: "unrecognized_keys",
					keys: parsedObject.otherKeys,
				});
				break;
			case parsedObject.missingKeys.length > 0:
				this.setIssueForContext(context, {
					code: "missing_keys",
					keys: parsedObject.missingKeys,
				});
				break;
			case parsedObject.invalidKeys.length > 0:
				this.setIssueForContext(context, {
					code: "invalid_key_type",
					...parsedObject.invalidKeys[0],
				});
				break;
		}
		return INVALID;
	}

	isMoney(object: any): object is Money {
		return object instanceof MoneyClass;
	}
}

const Money: MoneyConstructor = new MoneyConstructorClass();

class MoneyClass extends PGTPBase<Money> implements Money {
	constructor(private _money: BigNumber) {
		super();
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Money }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Money.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		const money = this._money.toString();
		//* Should always have a decimal point, with 2 decimal places
		if (money.includes(".")) {
			const [int, decimal] = money.split(".");
			//* If it has more than 2 decimal places, round it
			if (decimal.length > 2) return `${int}.${Math.round(Number(`0.${decimal}`) * 100)}`;
			return `${int}.${decimal.padEnd(2, "0")}`;
		} else return `${money}.00`;
	}

	toBigNumber(): BigNumber {
		return this._money;
	}

	toJSON(): MoneyObject {
		return {
			value: this.toString(),
		};
	}

	get money(): BigNumber {
		return this._money;
	}

	set money(money: BigNumber) {
		const parsed = Money.safeFrom(money);
		if (parsed.success) this._money = parsed.data.toBigNumber();
		else throw parsed.error;
	}

	get value(): string {
		return this.toString();
	}

	set value(money: string) {
		const parsed = Money.safeFrom(money);
		if (parsed.success) this._money = parsed.data.money;
		else throw parsed.error;
	}
}

export { Money, MoneyConstructor, MoneyObject };
