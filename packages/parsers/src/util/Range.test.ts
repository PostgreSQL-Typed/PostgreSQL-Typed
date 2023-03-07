import { describe, expect, it, test } from "vitest";

import type { ParseContext } from "../types/ParseContext.js";
import type { ParseReturnType } from "../types/ParseReturnType.js";
import { SafeEquals } from "../types/SafeEquals.js";
import { SafeFrom } from "../types/SafeFrom.js";
import { getParsedType } from "./getParsedType.js";
import { PGTPBase } from "./PGTPBase.js";
import { PGTPConstructorBase } from "./PGTPConstructorBase.js";
import { getRange, LowerRange, RangeConstructor, UpperRange } from "./Range.js";
import { INVALID, OK } from "./validation.js";

interface TestObject {
	test: string;
}

interface Test {
	test: string;

	toString(): string;
	toJSON(): TestObject;

	equals(string: string): boolean;
	equals(object: Test | TestObject): boolean;
	safeEquals(string: string): SafeEquals<Test>;
	safeEquals(object: Test | TestObject): SafeEquals<Test>;
}

interface TestConstructor {
	from(string: string): Test;
	from(object: Test | TestObject): Test;
	safeFrom(string: string): SafeFrom<Test>;
	safeFrom(object: Test | TestObject): SafeFrom<Test>;
	isTest(object: any): object is Test;
}

class TestConstructorClass extends PGTPConstructorBase<TestClass> implements TestConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<TestClass> {
		const [argument] = context.data,
			type = getParsedType(argument);

		if (type === "string") {
			if (argument === "fail") {
				this.setIssueForContext(context, {
					code: "invalid_string",
					expected: "a-z",
					received: argument,
				});
				return INVALID;
			}
			return OK(new TestClass(argument as string));
		}
		if (type === "number") return OK(new TestClass((argument as number).toString()));
		if (type === "bigint") return INVALID;
		if (type === "object") return OK(new TestClass((argument as TestObject).test));
		else {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: ["string", "number", "object"],
				received: type,
			});
			return INVALID;
		}
	}

	isTest(object: any): object is Test {
		return object instanceof TestClass;
	}
}

const testClass = new TestConstructorClass();

class TestClass extends PGTPBase<TestClass> {
	constructor(private _data: string) {
		super();
	}

	toString(): string {
		return this._data;
	}

	_equals(input: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: TestClass }> {
		const parsed = testClass.safeFrom(...input.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		// This is to test the fallback if no issue is set in the context
		if (!parsed.error.message.includes("nan")) this.setIssueForContext(input, parsed.error.issue);
		return INVALID;
	}

	get test(): string {
		return this._data;
	}

	toJSON(): TestObject {
		return { test: this._data };
	}
}

const TestRange: RangeConstructor<Test, TestObject> = getRange<Test, TestObject>(testClass, testClass.isTest, "TestRange");

describe("Lower and Upper range bounds", () => {
	it("enum should equal the correct values", () => {
		expect(["[", "("]).toStrictEqual([LowerRange.include, LowerRange.exclude]);
		expect(["]", ")"]).toStrictEqual([UpperRange.include, UpperRange.exclude]);
	});
});

describe("RangeConstructor", () => {
	test("getRange(...)", () => {
		expect(TestRange).toHaveProperty("from");
		expect(TestRange).toHaveProperty("safeFrom");
		expect(TestRange).toHaveProperty("isRange");
	});

	test("_parse(...)", () => {
		const invalidType = TestRange.safeFrom(BigInt("1") as any);
		expect(invalidType.success).toBe(false);
		if (invalidType.success) expect.fail();
		expect(invalidType.error.code).toBe("invalid_type");
		expect(invalidType.error.message).toBe("Expected 'string' | 'object' | 'array', received 'bigint'");

		//@ts-expect-error - This is to test the error
		const notEnoughArguments = TestRange.safeFrom();
		expect(notEnoughArguments.success).toBe(false);
		if (notEnoughArguments.success) expect.fail();
		expect(notEnoughArguments.error.code).toBe("too_small");
		expect(notEnoughArguments.error.message).toBe("Function must have exactly 1 argument(s)");

		//@ts-expect-error - This is to test the error
		const tooManyArguments = TestRange.safeFrom("a", "b");
		expect(tooManyArguments.success).toBe(false);
		if (tooManyArguments.success) expect.fail();
		expect(tooManyArguments.error.code).toBe("too_big");
		expect(tooManyArguments.error.message).toBe("Function must have exactly 1 argument(s)");
	});

	test("_parseString(...)", () => {
		const emptyRange = TestRange.safeFrom("empty");
		expect(emptyRange.success).toBe(true);
		if (!emptyRange.success) expect.fail();
		expect(emptyRange.data.empty).toBe(true);
		expect(emptyRange.data.toString()).toBe("empty");
		expect(emptyRange.data.toJSON()).toStrictEqual({
			lower: "[",
			upper: "]",
			value: null,
		});
		expect(emptyRange.data.lower).toBe("[");
		expect(emptyRange.data.upper).toBe("]");
		expect(emptyRange.data.value).toBe(null);
		expect(emptyRange.data.equals("empty")).toBe(true);

		const stringRange = TestRange.safeFrom("[a,c)");
		expect(stringRange.success).toBe(true);
		if (!stringRange.success) expect.fail();
		expect(stringRange.data.empty).toBe(false);
		expect(stringRange.data.toString()).toBe("[a,c)");
		expect(stringRange.data.toJSON().value).toHaveLength(2);
		expect(stringRange.data.lower).toBe("[");
		expect(stringRange.data.upper).toBe(")");
		expect(stringRange.data.value).toHaveLength(2);
		expect(stringRange.data.equals("[a,c)")).toBe(true);

		const invalidString1 = TestRange.safeFrom("a,c)");
		expect(invalidString1.success).toBe(false);
		if (invalidString1.success) expect.fail();
		expect(invalidString1.error.code).toBe("invalid_string");
		expect(invalidString1.error.message).toBe("Expected '[' | '(', received 'a'");

		const invalidString2 = TestRange.safeFrom("[a,c");
		expect(invalidString2.success).toBe(false);
		if (invalidString2.success) expect.fail();
		expect(invalidString2.error.code).toBe("invalid_string");
		expect(invalidString2.error.message).toBe("Expected ']' | ')', received 'c'");

		const invalidString3 = TestRange.safeFrom("");
		expect(invalidString3.success).toBe(false);
		if (invalidString3.success) expect.fail();
		expect(invalidString3.error.code).toBe("invalid_string");
		expect(invalidString3.error.message).toBe("Expected '[' | '(', received ''");

		const invalidString4 = TestRange.safeFrom("[)");
		expect(invalidString4.success).toBe(false);
		if (invalidString4.success) expect.fail();
		expect(invalidString4.error.code).toBe("too_small");
		expect(invalidString4.error.message).toBe("Array must contain exactly 2 element(s)");

		const invalidString5 = TestRange.safeFrom("[a,b,c)");
		expect(invalidString5.success).toBe(false);
		if (invalidString5.success) expect.fail();
		expect(invalidString5.error.code).toBe("too_big");
		expect(invalidString5.error.message).toBe("Array must contain exactly 2 element(s)");

		const invalidString6 = TestRange.safeFrom("[fail,b)");
		expect(invalidString6.success).toBe(false);
		if (invalidString6.success) expect.fail();
		expect(invalidString6.error.code).toBe("invalid_string");
		expect(invalidString6.error.message).toBe("Expected 'a-z', received 'fail'");

		const invalidString7 = TestRange.safeFrom("[a,fail)");
		expect(invalidString7.success).toBe(false);
		if (invalidString7.success) expect.fail();
		expect(invalidString7.error.code).toBe("invalid_string");
		expect(invalidString7.error.message).toBe("Expected 'a-z', received 'fail'");

		const invalidRangeBound = TestRange.safeFrom("[c,a)");
		expect(invalidRangeBound.success).toBe(false);
		if (invalidRangeBound.success) expect.fail();
		expect(invalidRangeBound.error.code).toBe("invalid_range_bound");
		expect(invalidRangeBound.error.message).toBe("Range lower bound ('c') must be less than or equal to range upper bound ('a')");
	});

	test("_parseArray(...)", () => {
		const validArray = TestRange.safeFrom([testClass.from("a"), testClass.from("c")]);
		expect(validArray.success).toBe(true);
		if (!validArray.success) expect.fail();
		expect(validArray.data.empty).toBe(false);
		expect(validArray.data.toString()).toBe("[a,c)");
		expect(validArray.data.toJSON().value).toHaveLength(2);
		expect(validArray.data.lower).toBe("[");
		expect(validArray.data.upper).toBe(")");
		expect(validArray.data.value).toHaveLength(2);
		expect(validArray.data.equals([testClass.from("a"), testClass.from("c")])).toBe(true);

		const invalidArray1 = TestRange.safeFrom(["a"] as any);
		expect(invalidArray1.success).toBe(false);
		if (invalidArray1.success) expect.fail();
		expect(invalidArray1.error.code).toBe("too_small");
		expect(invalidArray1.error.message).toBe("Array must contain exactly 2 element(s)");

		const invalidArray2 = TestRange.safeFrom(["a", "c", "e"] as any);
		expect(invalidArray2.success).toBe(false);
		if (invalidArray2.success) expect.fail();
		expect(invalidArray2.error.code).toBe("too_big");
		expect(invalidArray2.error.message).toBe("Array must contain exactly 2 element(s)");

		const invalidArray3 = TestRange.safeFrom(["fail", "c"] as any);
		expect(invalidArray3.success).toBe(false);
		if (invalidArray3.success) expect.fail();
		expect(invalidArray3.error.code).toBe("invalid_string");
		expect(invalidArray3.error.message).toBe("Expected 'a-z', received 'fail'");

		const invalidArray4 = TestRange.safeFrom(["a", "fail"] as any);
		expect(invalidArray4.success).toBe(false);
		if (invalidArray4.success) expect.fail();
		expect(invalidArray4.error.code).toBe("invalid_string");
		expect(invalidArray4.error.message).toBe("Expected 'a-z', received 'fail'");

		const invalidRangeBound = TestRange.safeFrom([testClass.from("c"), testClass.from("a")]);
		expect(invalidRangeBound.success).toBe(false);
		if (invalidRangeBound.success) expect.fail();
		expect(invalidRangeBound.error.code).toBe("invalid_range_bound");
		expect(invalidRangeBound.error.message).toBe("Range lower bound ('c') must be less than or equal to range upper bound ('a')");
	});

	test("_parseObject(...)", () => {
		const validObject = TestRange.safeFrom({
			lower: "[",
			upper: ")",
			value: [testClass.from("a"), testClass.from("c")],
		});
		expect(validObject.success).toBe(true);
		if (!validObject.success) expect.fail();
		expect(validObject.data.empty).toBe(false);
		expect(validObject.data.toString()).toBe("[a,c)");

		// @ts-expect-error - Testing invalid input
		const invalidObject3 = TestRange.safeFrom(testClass.from("a"), testClass.from("c"), testClass.from("e"));
		expect(invalidObject3.success).toBe(false);
		if (invalidObject3.success) expect.fail();
		expect(invalidObject3.error.code).toBe("too_big");
		expect(invalidObject3.error.message).toBe("Function must have at most 2 argument(s)");

		//Input should be [Range<DataType, DataTypeObject>]
		const invalidObject1 = TestRange.safeFrom(validObject.data as any, "hha" as any);
		expect(invalidObject1.success).toBe(false);
		if (invalidObject1.success) expect.fail();
		expect(invalidObject1.error.code).toBe("too_big");
		expect(invalidObject1.error.message).toBe("Function must have exactly 1 argument(s)");

		const fromRange = TestRange.safeFrom(validObject.data);
		expect(fromRange.success).toBe(true);
		if (!fromRange.success) expect.fail();
		expect(fromRange.data.empty).toBe(false);
		expect(fromRange.data.toString()).toBe("[a,c)");

		//Input should be [DataType, DataType]
		const invalidObject2 = TestRange.safeFrom(testClass.from("a") as any);
		expect(invalidObject2.success).toBe(false);
		if (invalidObject2.success) expect.fail();
		expect(invalidObject2.error.code).toBe("too_small");
		expect(invalidObject2.error.message).toBe("Function must have exactly 2 argument(s)");

		const invalidObject4 = TestRange.safeFrom(testClass.from("c"), "fail" as any);
		expect(invalidObject4.success).toBe(false);
		if (invalidObject4.success) expect.fail();
		expect(invalidObject4.error.code).toBe("invalid_string");
		expect(invalidObject4.error.message).toBe("Expected 'a-z', received 'fail'");

		const fromDataType = TestRange.safeFrom(testClass.from("a"), testClass.from("c"));
		expect(fromDataType.success).toBe(true);
		if (!fromDataType.success) expect.fail();
		expect(fromDataType.data.empty).toBe(false);
		expect(fromDataType.data.toString()).toBe("[a,c)");

		//Input should be [RangeObject<DataType> | RawRangeObject<DataTypeObject>]
		const invalidObject5 = TestRange.safeFrom({} as any, {} as any);
		expect(invalidObject5.success).toBe(false);
		if (invalidObject5.success) expect.fail();
		expect(invalidObject5.error.code).toBe("too_big");
		expect(invalidObject5.error.message).toBe("Function must have exactly 1 argument(s)");

		const invalidObject6 = TestRange.safeFrom({
			lower: "[",
			upper: ")",
			value: [testClass.from("a"), testClass.from("c")],
			g: "h",
		} as any);
		expect(invalidObject6.success).toBe(false);
		if (invalidObject6.success) expect.fail();
		expect(invalidObject6.error.code).toBe("unrecognized_keys");
		expect(invalidObject6.error.message).toBe("Unrecognized key in object: 'g'");

		const invalidObject7 = TestRange.safeFrom({
			upper: ")",
			value: [testClass.from("a"), testClass.from("c")],
		} as any);
		expect(invalidObject7.success).toBe(false);
		if (invalidObject7.success) expect.fail();
		expect(invalidObject7.error.code).toBe("missing_keys");
		expect(invalidObject7.error.message).toBe("Missing key in object: 'lower'");

		const invalidObject8 = TestRange.safeFrom({
			lower: 0 as any,
			upper: ")",
			value: [testClass.from("a"), testClass.from("c")],
		});
		expect(invalidObject8.success).toBe(false);
		if (invalidObject8.success) expect.fail();
		expect(invalidObject8.error.code).toBe("invalid_key_type");
		expect(invalidObject8.error.message).toBe("Expected 'string' for key 'lower', received 'number'");

		const invalidObject9 = TestRange.safeFrom({
			lower: "a" as any,
			upper: ")",
			value: [testClass.from("a"), testClass.from("c")],
		});
		expect(invalidObject9.success).toBe(false);
		if (invalidObject9.success) expect.fail();
		expect(invalidObject9.error.code).toBe("invalid_string");
		expect(invalidObject9.error.message).toBe("Expected '[' | '(', received 'a'");

		const invalidObject10 = TestRange.safeFrom({
			lower: "[",
			upper: "b" as any,
			value: [testClass.from("a"), testClass.from("c")],
		});
		expect(invalidObject10.success).toBe(false);
		if (invalidObject10.success) expect.fail();
		expect(invalidObject10.error.code).toBe("invalid_string");
		expect(invalidObject10.error.message).toBe("Expected ']' | ')', received 'b'");

		const fromRangeObjectNullValue = TestRange.safeFrom({
			lower: "[",
			upper: ")",
			value: null,
		});
		expect(fromRangeObjectNullValue.success).toBe(true);
		if (!fromRangeObjectNullValue.success) expect.fail();
		expect(fromRangeObjectNullValue.data.empty).toBe(true);
		expect(fromRangeObjectNullValue.data.toString()).toBe("empty");

		const fromRangeObject = TestRange.safeFrom({
			lower: "(",
			upper: "]",
			value: [testClass.from("a"), testClass.from("c")],
		});
		expect(fromRangeObject.success).toBe(true);
		if (!fromRangeObject.success) expect.fail();
		expect(fromRangeObject.data.empty).toBe(false);
		expect(fromRangeObject.data.toString()).toBe("(a,c]");

		const invalidRangeBound1 = TestRange.safeFrom(testClass.from("c"), testClass.from("a"));
		expect(invalidRangeBound1.success).toBe(false);
		if (invalidRangeBound1.success) expect.fail();
		expect(invalidRangeBound1.error.code).toBe("invalid_range_bound");
		expect(invalidRangeBound1.error.message).toBe("Range lower bound ('c') must be less than or equal to range upper bound ('a')");

		const invalidRangeBound2 = TestRange.safeFrom({
			lower: "(",
			upper: "]",
			value: [testClass.from("c"), testClass.from("a")],
		});
		expect(invalidRangeBound2.success).toBe(false);
		if (invalidRangeBound2.success) expect.fail();
		expect(invalidRangeBound2.error.code).toBe("invalid_range_bound");
		expect(invalidRangeBound2.error.message).toBe("Range lower bound ('c') must be less than or equal to range upper bound ('a')");
	});

	test("isRange(...)", () => {
		const validRange1 = TestRange.isRange(TestRange.from("(a,c]"));
		expect(validRange1).toBe(true);

		const invalidRange1 = TestRange.isRange("brr");
		expect(invalidRange1).toBe(false);
	});
});

describe("Range", () => {
	test("_equals(...)", () => {
		const validEquals1 = TestRange.from("(a,c]").safeEquals("(a,c]");
		expect(validEquals1.success).toBe(true);
		if (!validEquals1.success) expect.fail();
		expect(validEquals1.equals).toBe(true);

		const validEquals2 = TestRange.from("(a,c]").safeEquals("(a,c)");
		expect(validEquals2.success).toBe(true);
		if (!validEquals2.success) expect.fail();
		expect(validEquals2.equals).toBe(false);

		const invalidEquals1 = TestRange.from("(a,c]").safeEquals("brr");
		expect(invalidEquals1.success).toBe(false);
		if (invalidEquals1.success) expect.fail();
		expect(invalidEquals1.error.code).toBe("invalid_string");
	});

	test("_isWithinRange(...)", () => {
		const validWithin = TestRange.from("[a,h)").safeIsWithinRange("d");
		expect(validWithin.success).toBe(true);
		if (!validWithin.success) expect.fail();
		expect(validWithin.isWithinRange).toBe(true);

		const invalidWithin = TestRange.from("[a,h)").safeIsWithinRange("fail");
		expect(invalidWithin.success).toBe(false);
		if (invalidWithin.success) expect.fail();
		expect(invalidWithin.error.code).toBe("invalid_string");

		const invalidWithin2 = TestRange.from("[a,h)").safeIsWithinRange("z");
		expect(invalidWithin2.success).toBe(true);
		if (!invalidWithin2.success) expect.fail();
		expect(invalidWithin2.isWithinRange).toBe(false);
	});

	test("toString()", () => {
		expect(TestRange.from("(a,c]").toString()).toBe("(a,c]");
		expect(TestRange.from("[a,c)").toString()).toBe("[a,c)");
		expect(TestRange.from("[a,c]").toString()).toBe("[a,c]");
		expect(TestRange.from("(a,c)").toString()).toBe("(a,c)");
		expect(TestRange.from("empty").toString()).toBe("empty");
		expect(TestRange.from("[a,a)").toString()).toBe("empty");
		expect(TestRange.from("(a,a]").toString()).toBe("empty");
	});

	test("toJSON()", () => {
		const test1 = TestRange.from("(a,c]").toJSON();
		expect(test1.lower).toBe("(");
		expect(test1.upper).toBe("]");
		expect(test1.value).toHaveLength(2);
		expect(test1.value?.[0].test).toBe("a");
		expect(test1.value?.[1].test).toBe("c");
		expect(TestRange.from("empty").toJSON()).toEqual({
			lower: "[",
			upper: "]",
			value: null,
		});
	});

	test("get lower()", () => {
		expect(TestRange.from("(a,c]").lower).toBe("(");
		expect(TestRange.from("[a,c)").lower).toBe("[");
		expect(TestRange.from("[a,c]").lower).toBe("[");
		expect(TestRange.from("(a,c)").lower).toBe("(");
		expect(TestRange.from("empty").lower).toBe("[");
	});

	test("set lower(...)", () => {
		const test1 = TestRange.from("(a,c]");
		expect(test1.lower).toBe("(");
		test1.lower = "[";
		expect(test1.lower).toBe("[");
		expect(test1.toString()).toBe("[a,c]");

		const invalid1 = TestRange.from("(a,c]");
		expect(() => {
			invalid1.lower = "fail" as any;
		}).toThrowError("Expected '[' | '(', received 'fail'");

		const willMakeItEmpty = TestRange.from("(a,a)");
		expect(willMakeItEmpty.lower).toBe("(");
		expect(willMakeItEmpty.empty).toBe(false);
		willMakeItEmpty.lower = "[";
		expect(willMakeItEmpty.lower).toBe("[");
		expect(willMakeItEmpty.empty).toBe(true);
	});

	test("get upper()", () => {
		expect(TestRange.from("(a,c]").upper).toBe("]");
		expect(TestRange.from("[a,c)").upper).toBe(")");
		expect(TestRange.from("[a,c]").upper).toBe("]");
		expect(TestRange.from("(a,c)").upper).toBe(")");
		expect(TestRange.from("empty").upper).toBe("]");
	});

	test("set upper(...)", () => {
		const test1 = TestRange.from("(a,c]");
		expect(test1.upper).toBe("]");
		test1.upper = ")";
		expect(test1.upper).toBe(")");
		expect(test1.toString()).toBe("(a,c)");

		const invalid1 = TestRange.from("(a,c]");
		expect(() => {
			invalid1.upper = "fail" as any;
		}).toThrowError("Expected ']' | ')', received 'fail'");

		const willMakeItEmpty = TestRange.from("(a,a)");
		expect(willMakeItEmpty.upper).toBe(")");
		expect(willMakeItEmpty.empty).toBe(false);
		willMakeItEmpty.upper = "]";
		expect(willMakeItEmpty.upper).toBe("]");
		expect(willMakeItEmpty.empty).toBe(true);
	});

	test("get value()", () => {
		expect(TestRange.from("(a,c]").value).toHaveLength(2);
		expect(TestRange.from("(a,c]").value?.[0].test).toBe("a");
		expect(TestRange.from("(a,c]").value?.[1].test).toBe("c");
		expect(TestRange.from("empty").value).toBeNull();
	});

	test("set value(...)", () => {
		const test1 = TestRange.from("(a,c]");
		expect(test1.value).toHaveLength(2);
		expect(test1.value?.[0].test).toBe("a");
		expect(test1.value?.[1].test).toBe("c");
		test1.value = [testClass.from("b"), testClass.from("d")];
		expect(test1.value).toHaveLength(2);
		expect(test1.value?.[0].test).toBe("b");
		expect(test1.value?.[1].test).toBe("d");
		expect(test1.toString()).toBe("(b,d]");

		const test2 = TestRange.from("(a,c]");
		expect(test2.value).toHaveLength(2);
		expect(test2.value?.[0].test).toBe("a");
		expect(test2.value?.[1].test).toBe("c");
		test2.value = null;
		expect(test2.value).toBeNull();

		const invalid1 = TestRange.from("(a,c]");
		expect(() => {
			invalid1.value = ["fail"] as any;
		}).toThrowError("Array must contain exactly 2 element(s)");
		expect(() => {
			invalid1.value = ["fail", "fail", "fail"] as any;
		}).toThrowError("Array must contain exactly 2 element(s)");
		expect(() => {
			invalid1.value = ["fail", testClass.from("d")] as any;
		}).toThrowError("Expected 'a-z', received 'fail'");
		expect(() => {
			invalid1.value = [testClass.from("a"), "fail"] as any;
		}).toThrowError("Expected 'a-z', received 'fail'");
		expect(() => {
			invalid1.value = "fail" as any;
		}).toThrowError("Expected 'array', received 'string'");
		invalid1.value = [testClass.from("a"), testClass.from("d")];
		expect(invalid1.value).toHaveLength(2);
		expect(invalid1.value?.[0].test).toBe("a");
		expect(invalid1.value?.[1].test).toBe("d");
	});
});
