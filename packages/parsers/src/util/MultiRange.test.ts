import { getParsedType, INVALID, OK, type ParseReturnType } from "@postgresql-typed/util";
import { describe, expect, test } from "vitest";

import type { ParseContext } from "../types/ParseContext.js";
import { SafeEquals } from "../types/SafeEquals.js";
import { SafeFrom } from "../types/SafeFrom.js";
import { getMultiRange, MultiRangeConstructor } from "./MultiRange.js";
import { PgTPBase } from "./PgTPBase.js";
import { PgTPConstructorBase } from "./PgTPConstructorBase.js";
import { getRange, RangeConstructor } from "./Range.js";

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

class TestConstructorClass extends PgTPConstructorBase<TestClass> implements TestConstructor {
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

class TestClass extends PgTPBase<TestClass> {
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

	get value(): string {
		return this._data;
	}

	get postgres(): string {
		return this._data;
	}
}

const TestRange: RangeConstructor<Test, TestObject> = getRange<Test, TestObject>(testClass, testClass.isTest, "TestRange"),
	TestMultiRange: MultiRangeConstructor<Test, TestObject> = getMultiRange<Test, TestObject>(TestRange, TestRange.isRange, "TestMultiRange");

describe("MultiRangeConstructor", () => {
	test("getMultiRange(...)", () => {
		expect(TestMultiRange).toHaveProperty("from");
		expect(TestMultiRange).toHaveProperty("safeFrom");
		expect(TestMultiRange).toHaveProperty("isMultiRange");
	});

	test("_parse(...)", () => {
		const invalidType = TestMultiRange.safeFrom(BigInt("1") as any);
		expect(invalidType.success).toBe(false);
		if (invalidType.success) expect.fail();
		expect(invalidType.error.code).toBe("invalid_type");
		expect(invalidType.error.message).toBe("Expected 'string' | 'object' | 'array', received 'bigint'");

		//@ts-expect-error - This is to test the error
		const notEnoughArguments = TestMultiRange.safeFrom();
		expect(notEnoughArguments.success).toBe(false);
		if (notEnoughArguments.success) expect.fail();
		expect(notEnoughArguments.error.code).toBe("too_small");
		expect(notEnoughArguments.error.message).toBe("Function must have exactly 1 argument(s)");

		//@ts-expect-error - This is to test the error
		const tooManyArguments = TestMultiRange.safeFrom("a", "b");
		expect(tooManyArguments.success).toBe(false);
		if (tooManyArguments.success) expect.fail();
		expect(tooManyArguments.error.code).toBe("too_big");
		expect(tooManyArguments.error.message).toBe("Function must have exactly 1 argument(s)");
	});

	test("_parseString(...)", () => {
		const emptyRange = TestMultiRange.safeFrom("{}");
		expect(emptyRange.success).toBe(true);
		if (!emptyRange.success) expect.fail();
		expect(emptyRange.data.ranges).toStrictEqual([]);
		expect(emptyRange.data.toString()).toBe("{}");
		expect(emptyRange.data.toJSON()).toStrictEqual({ ranges: [] });
		expect(emptyRange.data.equals("{}")).toBe(true);

		const stringRange = TestMultiRange.safeFrom("{[a,c),[d,f)}");
		expect(stringRange.success).toBe(true);
		if (!stringRange.success) expect.fail();
		expect(stringRange.data.ranges).toHaveLength(2);
		expect(stringRange.data.toString()).toBe("{[a,c),[d,f)}");
		expect(stringRange.data.toJSON().ranges).toHaveLength(2);
		expect(stringRange.data.equals("{[a,c),[d,f)}")).toBe(true);

		const invalidString1 = TestMultiRange.safeFrom("[a,c)");
		expect(invalidString1.success).toBe(false);
		if (invalidString1.success) expect.fail();
		expect(invalidString1.error.code).toBe("invalid_string");
		expect(invalidString1.error.message).toBe("Expected '{', received '['");

		const invalidString2 = TestMultiRange.safeFrom("{[a,c)");
		expect(invalidString2.success).toBe(false);
		if (invalidString2.success) expect.fail();
		expect(invalidString2.error.code).toBe("invalid_string");
		expect(invalidString2.error.message).toBe("Expected '}', received ')'");

		const invalidString3 = TestMultiRange.safeFrom("");
		expect(invalidString3.success).toBe(false);
		if (invalidString3.success) expect.fail();
		expect(invalidString3.error.code).toBe("invalid_string");
		expect(invalidString3.error.message).toBe("Expected '{', received ''");

		const invalidString4 = TestMultiRange.safeFrom("{fail,[a,d)}");
		expect(invalidString4.success).toBe(false);
		if (invalidString4.success) expect.fail();
		expect(invalidString4.error.code).toBe("invalid_string");
		expect(invalidString4.error.message).toBe("Expected 'LIKE {[<DataType>,<DataType>),...}', received '{fail,[a,d)}'");

		const invalidString5 = TestMultiRange.safeFrom("{fa,il,[a,d)}");
		expect(invalidString5.success).toBe(false);
		if (invalidString5.success) expect.fail();
		expect(invalidString5.error.code).toBe("invalid_string");
		expect(invalidString5.error.message).toBe("Expected '[' | '(', received 'f'");
	});

	test("_parseArray(...)", () => {
		const validArray1 = TestMultiRange.safeFrom([TestRange.from("[a,c)"), TestRange.from("[d,f)")]);
		expect(validArray1.success).toBe(true);
		if (!validArray1.success) expect.fail();
		expect(validArray1.data.ranges).toHaveLength(2);
		expect(validArray1.data.toString()).toBe("{[a,c),[d,f)}");
		expect(validArray1.data.toJSON().ranges).toHaveLength(2);
		expect(validArray1.data.equals([TestRange.from("[a,c)"), TestRange.from("[d,f)")])).toBe(true);

		const validArray2 = TestMultiRange.safeFrom([]);
		expect(validArray2.success).toBe(true);
		if (!validArray2.success) expect.fail();
		expect(validArray2.data.ranges).toHaveLength(0);
		expect(validArray2.data.toString()).toBe("{}");
		expect(validArray2.data.toJSON().ranges).toHaveLength(0);
		expect(validArray2.data.equals([])).toBe(true);

		// @ts-expect-error - invalid array
		const invalidArray1 = TestMultiRange.safeFrom(["[fail,c)"]);
		expect(invalidArray1.success).toBe(false);
		if (invalidArray1.success) expect.fail();
		expect(invalidArray1.error.code).toBe("invalid_string");
		expect(invalidArray1.error.message).toBe("Expected 'a-z', received 'fail'");
	});

	test("_parseObject(...)", () => {
		const validObject1 = TestMultiRange.safeFrom({
			ranges: [TestRange.from("[a,c)"), TestRange.from("[d,f)")],
		});
		expect(validObject1.success).toBe(true);
		if (!validObject1.success) expect.fail();
		expect(validObject1.data.ranges).toHaveLength(2);
		expect(validObject1.data.toString()).toBe("{[a,c),[d,f)}");

		const validObject2 = TestMultiRange.safeFrom({
			ranges: [
				{
					lower: "[",
					upper: ")",
					values: [
						{
							test: "a",
						},
						{
							test: "c",
						},
					],
				},
			],
		});
		expect(validObject2.success).toBe(true);
		if (!validObject2.success) expect.fail();
		expect(validObject2.data.ranges).toHaveLength(1);
		expect(validObject2.data.toString()).toBe("{[a,c)}");

		// @ts-expect-error - invalid object
		const invalidObject3 = TestMultiRange.safeFrom(validObject2, {});
		expect(invalidObject3.success).toBe(false);
		if (invalidObject3.success) expect.fail();
		expect(invalidObject3.error.code).toBe("too_big");
		expect(invalidObject3.error.message).toBe("Function must have exactly 1 argument(s)");

		//Input should be [MultiRange<DataType, DataTypeObject>]
		// @ts-expect-error - invalid object
		const invalidObject1 = TestMultiRange.safeFrom(validObject1.data, "hha");
		expect(invalidObject1.success).toBe(false);
		if (invalidObject1.success) expect.fail();
		expect(invalidObject1.error.code).toBe("too_big");
		expect(invalidObject1.error.message).toBe("Function must have exactly 1 argument(s)");

		const fromRange = TestMultiRange.safeFrom(validObject1.data);
		expect(fromRange.success).toBe(true);
		if (!fromRange.success) expect.fail();

		//Input should be [Range<DataType, DataTypeObject>, Range<DataType, DataTypeObject>, ...]
		const fromOneDataType = TestMultiRange.safeFrom(TestRange.from("[a,c)"));
		expect(fromOneDataType.success).toBe(true);
		if (!fromOneDataType.success) expect.fail();
		expect(fromOneDataType.data.toString()).toBe("{[a,c)}");

		// @ts-expect-error - invalid object
		const invalidObject4 = TestMultiRange.safeFrom(TestRange.from("[a,c)"), "[fail,c)");
		expect(invalidObject4.success).toBe(false);
		if (invalidObject4.success) expect.fail();
		expect(invalidObject4.error.code).toBe("invalid_string");
		expect(invalidObject4.error.message).toBe("Expected 'a-z', received 'fail'");

		const fromDataType = TestMultiRange.safeFrom(TestRange.from("[a,c)"), "[d,f)" as any);
		expect(fromDataType.success).toBe(true);
		if (!fromDataType.success) expect.fail();
		expect(fromDataType.data.toString()).toBe("{[a,c),[d,f)}");

		//Input should be [MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>]
		// @ts-expect-error - invalid object
		const invalidObject5 = TestMultiRange.safeFrom({}, {});
		expect(invalidObject5.success).toBe(false);
		if (invalidObject5.success) expect.fail();
		expect(invalidObject5.error.code).toBe("too_big");
		expect(invalidObject5.error.message).toBe("Function must have exactly 1 argument(s)");

		const invalidObject6 = TestMultiRange.safeFrom({
			ranges: [TestRange.from("[a,c)"), TestRange.from("[d,f)")],
			// @ts-expect-error - invalid object
			g: "h",
		});
		expect(invalidObject6.success).toBe(false);
		if (invalidObject6.success) expect.fail();
		expect(invalidObject6.error.code).toBe("unrecognized_keys");
		expect(invalidObject6.error.message).toBe("Unrecognized key in object: 'g'");

		// @ts-expect-error - invalid object
		const invalidObject7 = TestMultiRange.safeFrom({});
		expect(invalidObject7.success).toBe(false);
		if (invalidObject7.success) expect.fail();
		expect(invalidObject7.error.code).toBe("missing_keys");
		expect(invalidObject7.error.message).toBe("Missing key in object: 'ranges'");

		// @ts-expect-error - invalid object
		const invalidObject8 = TestMultiRange.safeFrom({ ranges: 0 });
		expect(invalidObject8.success).toBe(false);
		if (invalidObject8.success) expect.fail();
		expect(invalidObject8.error.code).toBe("invalid_key_type");
		expect(invalidObject8.error.message).toBe("Expected 'array' for key 'ranges', received 'number'");

		const invalidObject9 = TestMultiRange.safeFrom({
			// @ts-expect-error - invalid object
			ranges: ["[a,fail)", TestRange.from("[d,f)")],
		});
		expect(invalidObject9.success).toBe(false);
		if (invalidObject9.success) expect.fail();
		expect(invalidObject9.error.code).toBe("invalid_string");
		expect(invalidObject9.error.message).toBe("Expected 'a-z', received 'fail'");
	});

	test("isMultiRange(...)", () => {
		const validRange1 = TestMultiRange.isMultiRange(TestMultiRange.from("{(a,c]}"));
		expect(validRange1).toBe(true);

		const invalidRange1 = TestMultiRange.isMultiRange("brr");
		expect(invalidRange1).toBe(false);
	});
});

describe("MultiRange", () => {
	test("_equals(...)", () => {
		const validEquals1 = TestMultiRange.from("{(a,c]}").safeEquals("{(a,c]}");
		expect(validEquals1.success).toBe(true);
		if (!validEquals1.success) expect.fail();
		expect(validEquals1.equals).toBe(true);

		const validEquals2 = TestMultiRange.from("{(a,c]}").safeEquals("{(a,c)}");
		expect(validEquals2.success).toBe(true);
		if (!validEquals2.success) expect.fail();
		expect(validEquals2.equals).toBe(false);

		const invalidEquals1 = TestMultiRange.from("{(a,c]}").safeEquals("brr");
		expect(invalidEquals1.success).toBe(false);
		if (invalidEquals1.success) expect.fail();
		expect(invalidEquals1.error.code).toBe("invalid_string");
	});

	test("toString()", () => {
		expect(TestMultiRange.from("{(a,c]}").toString()).toBe("{(a,c]}");
		expect(TestMultiRange.from("{[a,c)}").toString()).toBe("{[a,c)}");
		expect(TestMultiRange.from("{[a,c]}").toString()).toBe("{[a,c]}");
		expect(TestMultiRange.from("{(a,c)}").toString()).toBe("{(a,c)}");
		expect(TestMultiRange.from("{}").toString()).toBe("{}");
		expect(TestMultiRange.from("{[a,a)}").toString()).toBe("{empty}");
		expect(TestMultiRange.from("{(a,a]}").toString()).toBe("{empty}");
	});

	test("toJSON()", () => {
		const test1 = TestMultiRange.from("{(a,c]}").toJSON();
		expect(test1.ranges).toHaveLength(1);
		expect(test1.ranges[0].lower).toBe("(");
		expect(test1.ranges[0].upper).toBe("]");
		expect(test1.ranges[0].values).toHaveLength(2);
		expect(test1.ranges[0].values?.[0].test).toBe("a");
		expect(test1.ranges[0].values?.[1].test).toBe("c");
		expect(TestMultiRange.from(TestRange.from("empty")).toJSON()).toEqual({
			ranges: [{ lower: "[", upper: "]", values: null }],
		});

		const test2 = TestMultiRange.from("{}").toJSON();
		expect(test2.ranges).toHaveLength(0);
		expect(test2.ranges).toStrictEqual([]);
	});

	test("get ranges()", () => {
		expect(TestMultiRange.from("{(a,c]}").ranges).toHaveLength(1);
		expect(TestMultiRange.from("{(a,c]}").ranges[0].toString()).toBe("(a,c]");
		expect(TestMultiRange.from("{[a,c)}").ranges).toHaveLength(1);
		expect(TestMultiRange.from("{[a,c)}").ranges[0].toString()).toBe("[a,c)");
		expect(TestMultiRange.from("{[a,c]}").ranges).toHaveLength(1);
		expect(TestMultiRange.from("{[a,c]}").ranges[0].toString()).toBe("[a,c]");
		expect(TestMultiRange.from("{(a,c)}").ranges).toHaveLength(1);
		expect(TestMultiRange.from("{(a,c)}").ranges[0].toString()).toBe("(a,c)");
		expect(TestMultiRange.from("{}").ranges).toHaveLength(0);
	});

	test("set ranges(...)", () => {
		const test1 = TestMultiRange.from("{(a,c]}");
		expect(test1.ranges).toHaveLength(1);
		expect(test1.ranges?.[0].toString()).toBe("(a,c]");
		test1.ranges = [TestRange.from("(b,d]"), TestRange.from("(e,f]")];
		expect(test1.ranges).toHaveLength(2);
		expect(test1.ranges?.[0].toString()).toBe("(b,d]");
		expect(test1.ranges?.[1].toString()).toBe("(e,f]");
		expect(test1.toString()).toBe("{(b,d],(e,f]}");

		const test2 = TestMultiRange.from("{(a,c]}");
		expect(test2.ranges).toHaveLength(1);
		expect(test2.ranges?.[0].toString()).toBe("(a,c]");
		test2.ranges = [];
		expect(test2.ranges).toStrictEqual([]);

		const invalid1 = TestMultiRange.from("{(a,c]}");
		expect(() => {
			invalid1.ranges = "fail" as any;
		}).toThrowError("Expected 'array', received 'string'");
		expect(() => {
			invalid1.ranges = ["fail"] as any;
		}).toThrowError("Expected '[' | '(', received 'f'");
		invalid1.ranges = [TestRange.from("(b,d]"), TestRange.from("(e,f]")];
		expect(test1.ranges).toHaveLength(2);
		expect(test1.ranges?.[0].toString()).toBe("(b,d]");
		expect(test1.ranges?.[1].toString()).toBe("(e,f]");
		expect(test1.toString()).toBe("{(b,d],(e,f]}");
	});

	test("get value()", () => {
		expect(TestMultiRange.from("{(a,c]}").value).toBe("{(a,c]}");
		expect(TestMultiRange.from("{[a,c)}").value).toBe("{[a,c)}");
		expect(TestMultiRange.from("{[a,c]}").value).toBe("{[a,c]}");
		expect(TestMultiRange.from("{(a,c)}").value).toBe("{(a,c)}");
		expect(TestMultiRange.from("{}").value).toBe("{}");
		expect(TestMultiRange.from("{[a,a)}").value).toBe("{empty}");
		expect(TestMultiRange.from("{(a,a]}").value).toBe("{empty}");
	});

	test("set value(...)", () => {
		const test1 = TestMultiRange.from("{(a,c]}");
		expect(test1.value).toBe("{(a,c]}");
		test1.value = "{(b,d]}";
		expect(test1.value).toBe("{(b,d]}");

		const test2 = TestMultiRange.from("{(a,c]}");
		expect(test2.value).toBe("{(a,c]}");
		test2.value = "{}";
		expect(test2.value).toBe("{}");

		const invalid1 = TestMultiRange.from("{(a,c]}");
		expect(() => {
			invalid1.value = "fail" as any;
		}).toThrowError("Expected '{', received 'f'");
		expect(() => {
			invalid1.value = "{fail" as any;
		}).toThrowError("Expected '}', received 'l'");
		invalid1.value = "{(b,d]}";
		expect(test1.value).toBe("{(b,d]}");
	});

	test("get postgres()", () => {
		expect(TestMultiRange.from("{(a,c]}").postgres).toBe("{(a,c]}");
		expect(TestMultiRange.from("{[a,c)}").postgres).toBe("{[a,c)}");
		expect(TestMultiRange.from("{[a,c]}").postgres).toBe("{[a,c]}");
		expect(TestMultiRange.from("{(a,c)}").postgres).toBe("{(a,c)}");
		expect(TestMultiRange.from("{}").postgres).toBe("{}");
		expect(TestMultiRange.from("{[a,a)}").postgres).toBe("{empty}");
		expect(TestMultiRange.from("{(a,a]}").postgres).toBe("{empty}");
	});

	test("set postgres(...)", () => {
		const test1 = TestMultiRange.from("{(a,c]}");
		expect(test1.postgres).toBe("{(a,c]}");
		test1.postgres = "{(b,d]}";
		expect(test1.postgres).toBe("{(b,d]}");

		const test2 = TestMultiRange.from("{(a,c]}");
		expect(test2.postgres).toBe("{(a,c]}");
		test2.postgres = "{}";
		expect(test2.postgres).toBe("{}");

		const invalid1 = TestMultiRange.from("{(a,c]}");
		expect(() => {
			invalid1.postgres = "fail" as any;
		}).toThrowError("Expected '{', received 'f'");
		expect(() => {
			invalid1.postgres = "{fail" as any;
		}).toThrowError("Expected '}', received 'l'");
		invalid1.postgres = "{(b,d]}";
		expect(test1.postgres).toBe("{(b,d]}");
	});
});
