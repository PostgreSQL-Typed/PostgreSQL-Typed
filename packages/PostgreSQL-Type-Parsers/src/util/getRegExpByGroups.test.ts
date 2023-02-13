import { describe, expect, it } from "vitest";

import { getRegExpByGroups } from "./getRegExpByGroups.js";

describe("getRegExpByGroups", () => {
	it("should return a match function", () => {
		const test1 = getRegExpByGroups();
		expect(test1).toBeTypeOf("object");
		expect(test1).toHaveProperty("match");
		expect(test1.match).toBeTypeOf("function");
	});

	it("if no groups are provided, should return a match function that matches against the base", () => {
		const test1 = getRegExpByGroups();
		expect(test1.match("test")).toBeNull();

		const test2 = getRegExpByGroups<{
			hey: string;
		}>({ base: /^(?<hey>Hello)%others%$/ });
		expect(test2.match("Hello")).not.toBeNull();
		expect(test2.match("Hello")).toHaveProperty("hey");
		expect(test2.match("Hello")?.hey).toBe("Hello");
	});

	it("if only one group is provided, should return a match function that matches against that one group", () => {
		const test1 = getRegExpByGroups<{
			az: string;
		}>({
			groups: ["(?<az>[a-zA-Z]*)"],
		});
		expect(test1.match("Hello")).not.toBeNull();
		expect(test1.match("Hello")).toHaveProperty("az");
		expect(test1.match("Hello")?.az).toBe("Hello");

		expect(test1.match("Hello World")).toBeNull();
		expect(test1.match("1Hello")).toBeNull();
	});

	it("if multiple groups are provided, should return a match function that matches against the sorted groups", () => {
		const test1 = getRegExpByGroups<{
			letters: string;
			numbers: string;
			secondLetters: string;
			thirdLetters: string;
		}>({
			groups: ["(?<letters>[a-zA-Z]+)", "(?<numbers>\\s*[0-9]+)", "(?<secondLetters>\\s{2}[a-zA-Z]+)", "(?<thirdLetters>\\s*[a-zA-Z]+)"],
		});

		expect(test1.match("Hello")).not.toBeNull();
		expect(test1.match("Hello")).toHaveProperty("letters");
		expect(test1.match("Hello")).not.toHaveProperty("numbers");
		expect(test1.match("Hello")?.letters).toBe("Hello");

		expect(test1.match("Hello #")).toBeNull();

		expect(test1.match("1Hello")).not.toBeNull();
		expect(test1.match("1Hello")).toHaveProperty("letters");
		expect(test1.match("1Hello")).toHaveProperty("numbers");
		expect(test1.match("1Hello")?.letters).toBe("Hello");
		expect(test1.match("1Hello")?.numbers).toBe("1");

		expect(test1.match("1Hello #")).toBeNull();

		expect(test1.match("1Hello World")).not.toBeNull();
		expect(test1.match("1Hello World")).toHaveProperty("numbers");
		expect(test1.match("1Hello World")).toHaveProperty("letters");
		expect(test1.match("1Hello World")).toHaveProperty("thirdLetters");
		expect(test1.match("1Hello World")?.numbers).toBe("1");
		expect(test1.match("1Hello World")?.letters).toBe("Hello");
		expect(test1.match("1Hello World")?.thirdLetters).toBe(" World");

		expect(test1.match("1Hello  World Welcome")).not.toBeNull();
		expect(test1.match("1Hello  World Welcome")).toHaveProperty("numbers");
		expect(test1.match("1Hello  World Welcome")).toHaveProperty("letters");
		expect(test1.match("1Hello  World Welcome")).toHaveProperty("secondLetters");
		expect(test1.match("1Hello  World Welcome")).toHaveProperty("thirdLetters");
		expect(test1.match("1Hello  World Welcome")?.numbers).toBe("1");
		expect(test1.match("1Hello  World Welcome")?.letters).toBe("Hello");
		expect(test1.match("1Hello  World Welcome")?.secondLetters).toBe("  World");
		expect(test1.match("1Hello  World Welcome")?.thirdLetters).toBe(" Welcome");

		expect(test1.match("#")).toBeNull();
	});

	it("should return the first match if isOrCondition is true", () => {
		const test1 = getRegExpByGroups<{
			az: string;
			az2: string;
		}>({
			groups: ["(?<az>[a-zA-Z]*)", "(?<az2>[a-zA-Z]*)"],
			isOrCondition: true,
		});

		expect(test1.match("Hello")).not.toBeNull();
		expect(test1.match("Hello")).toHaveProperty("az");
		expect(test1.match("Hello")).not.toHaveProperty("az2");
		expect(test1.match("Hello")?.az).toBe("Hello");

		expect(test1.match("Hello World")).toBeNull();
	});
});
