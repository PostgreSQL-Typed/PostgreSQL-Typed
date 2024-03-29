/* eslint-disable unicorn/filename-case */
import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Character } from "../Character/Character.js";
import { CharacterVarying } from "../Character/CharacterVarying.js";
import { Name } from "../Character/Name.js";
import { Text } from "../Character/Text.js";
import { UUID } from "./UUID.js";

describe("UUIDConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(UUID.safeFrom("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").success).toBe(true);
		expect(UUID.safeFrom("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11").success).toBe(true);
		expect(UUID.safeFrom("{A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11}").success).toBe(true);
		expect(UUID.safeFrom("{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11}").success).toBe(true);
		expect(UUID.safeFrom("A0EEBC999C0B4EF8BB6D6BB9BD380A11").success).toBe(true);
		expect(UUID.safeFrom("a0eebc999c0b4ef8bb6d6bb9bd380a11").success).toBe(true);
		expect(UUID.safeFrom(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")).success).toBe(true);
		expect(UUID.safeFrom(UUID.from("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")).success).toBe(true);
		expect(UUID.safeFrom(Character.setN(36).from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")).success).toBe(true);
		expect(UUID.safeFrom(CharacterVarying.setN(36).from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")).success).toBe(true);
		expect(UUID.safeFrom(Name.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")).success).toBe(true);
		expect(UUID.safeFrom(Text.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")).success).toBe(true);
		expect(
			UUID.safeFrom({
				value: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
			}).success
		).toBe(true);
		expect(
			UUID.safeFrom({
				value: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = UUID.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["string", "object"],
				message: "Expected 'string' | 'object', received 'boolean'",
				received: "boolean",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = UUID.safeFrom(1, 2);
		expect(tooManyArguments.success).toEqual(false);
		if (tooManyArguments.success) expect.fail();
		else {
			expect(tooManyArguments.error.issue).toStrictEqual({
				code: "too_big",
				exact: true,
				maximum: 1,
				message: "Function must have exactly 1 argument(s)",
				received: 2,
				type: "arguments",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooFewArguments = UUID.safeFrom();
		expect(tooFewArguments.success).toEqual(false);
		if (tooFewArguments.success) expect.fail();
		else {
			expect(tooFewArguments.error.issue).toStrictEqual({
				code: "too_small",
				exact: true,
				message: "Function must have exactly 1 argument(s)",
				minimum: 1,
				received: 0,
				type: "arguments",
			});
		}

		const unrecognizedKeys = UUID.safeFrom({
			unrecognized: true,
			value: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
		} as any);
		expect(unrecognizedKeys.success).toEqual(false);
		if (unrecognizedKeys.success) expect.fail();
		else {
			expect(unrecognizedKeys.error.issue).toStrictEqual({
				code: "unrecognized_keys",
				keys: ["unrecognized"],
				message: "Unrecognized key in object: 'unrecognized'",
			});
		}

		const missingKeys = UUID.safeFrom({
			// value: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11",
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["value"],
				message: "Missing key in object: 'value'",
			});
		}

		const invalidKeys = UUID.safeFrom({
			value: 0,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				expected: "string",
				message: "Expected 'string' for key 'value', received 'number'",
				objectKey: "value",
				received: "number",
			});
		}
		//#endregion
	});

	test("generate(...)", () => {
		const uuid = UUID.generate();
		expect(uuid.value).toBeTypeOf("string");
	});

	test("isUUID(...)", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(UUID.isUUID(uuid)).toBe(true);
		expect(UUID.isUUID({ uuid: "A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11" })).toBe(false);
	});
});

describe("UUID", () => {
	test("_equals(...)", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");

		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"))).toBe(true);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11"))).toBe(false);
		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toJSON())).toBe(true);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toJSON())).toBe(false);
		expect(uuid.equals(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString())).toBe(true);
		expect(uuid.equals(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toString())).toBe(false);

		expect(uuid.safeEquals(1 as any).success).toBe(false);
	});

	test("toString()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.toString()).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	test("toJSON()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.toJSON()).toEqual({
			value: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
		});
	});

	test("get uuid()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.uuid).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	test("set uuid(...)", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		uuid.uuid = "A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11";
		expect(uuid.uuid).toBe("a0eebc99-8c0b-4ef8-bb6d-6bb9bd380a11");
		expect(() => {
			uuid.uuid = "invalid";
		}).toThrowError("Expected 'LIKE xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', received 'invalid'");
	});

	test("get value()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.value).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	test("set value(...)", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		uuid.value = "A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11";
		expect(uuid.value).toBe("a0eebc99-8c0b-4ef8-bb6d-6bb9bd380a11");
		expect(() => {
			uuid.value = "invalid";
		}).toThrowError("Expected 'LIKE xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', received 'invalid'");
	});

	test("get postgres()", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		expect(uuid.postgres).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
	});

	test("set postgres(...)", () => {
		const uuid = UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11");
		uuid.postgres = "A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11";
		expect(uuid.postgres).toBe("a0eebc99-8c0b-4ef8-bb6d-6bb9bd380a11");
		expect(() => {
			uuid.postgres = "invalid";
		}).toThrowError("Expected 'LIKE xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', received 'invalid'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/uuid.sql
		// too long
		expect(() => UUID.from("11111111-1111-1111-1111-111111111111F")).toThrowError();
		// too short
		expect(() => UUID.from("{11111111-1111-1111-1111-11111111111}")).toThrowError();
		// valid data but invalid format
		expect(() => UUID.from("111-11111-1111-1111-1111-111111111111")).toThrowError();
		expect(() => UUID.from("{22222222-2222-2222-2222-222222222222 ")).toThrowError();
		// invalid data
		expect(() => UUID.from("11111111-1111-1111-G111-111111111111")).toThrowError();
		expect(() => UUID.from("11+11111-1111-1111-1111-111111111111")).toThrowError();

		// inserting three input formats
		expect(() => UUID.from("11111111-1111-1111-1111-111111111111")).not.toThrowError();
		expect(() => UUID.from("{22222222-2222-2222-2222-222222222222}")).not.toThrowError();
		expect(() => UUID.from("3f3e3c3b3a3039383736353433a2313e")).not.toThrowError();

		// additional records
		expect(() => UUID.from("44444444-4444-4444-4444-444444444444")).not.toThrowError();
		expect(() => UUID.from("11111111-1111-1111-1111-111111111111")).not.toThrowError();
		expect(() => UUID.from("{22222222-2222-2222-2222-222222222222}")).not.toThrowError();
		expect(() => UUID.from("3f3e3c3b3a3039383736353433a2313e")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			application_name: "uuid.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		let error = null;
		try {
			await client.connect();

			//* PG has a native parser for the '_uuid' type
			types.setTypeParser(2951 as any, value => value);

			await client.query(`
				CREATE TABLE public.vitestuuid (
					uuid uuid NULL,
					_uuid _uuid NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<UUID>(UUID)(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11")),
				arraySerializer<UUID>(UUID, ",")([UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11"), UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11")]),
			];

			expect(singleInput).toBe("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
			expect(arrayInput).toBe("{a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11,a0eebc99-8c0b-4ef8-bb6d-6bb9bd380a11}");

			await client.query(
				`
				INSERT INTO public.vitestuuid (uuid, _uuid)
				VALUES (
					$1::uuid,
					$2::_uuid
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestuuid
			`);

			result.rows[0].uuid = parser<UUID>(UUID)(result.rows[0].uuid);
			result.rows[0]._uuid = arrayParser<UUID>(UUID)(result.rows[0]._uuid);

			expect(result.rows[0].uuid.toString()).toStrictEqual(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString());
			expect(result.rows[0]._uuid).toHaveLength(2);
			expect(result.rows[0]._uuid[0].toString()).toStrictEqual(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString());
			expect(result.rows[0]._uuid[1].toString()).toStrictEqual(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestuuid
		`);

		await client.end();

		if (error) throw error;
	});
});
