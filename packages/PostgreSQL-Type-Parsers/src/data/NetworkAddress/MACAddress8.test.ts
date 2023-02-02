import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { MACAddress8 } from "./MACAddress8";

describe.todo("MACAddress8 Class", () => {
	it("should create a MAC address from a string", () => {
		const address1 = MACAddress8.from("08:00:2b:01:02:03:04:05");
		expect(address1).not.toBeNull();
		const address2 = MACAddress8.from("08002b0102030405");
		expect(address2).not.toBeNull();
		const address3 = MACAddress8.from("08.00.2b.01.02.03.04.05");
		expect(address3).not.toBeNull();
		const address4 = MACAddress8.from("08-00-2b-01-02-03-04-05");
		expect(address4).not.toBeNull();
		expect(MACAddress8.from(MACAddress8.from("08:00:2b:01:02:03:04:05"))).not.toBeNull();
	});

	it("should error when creating a MAC address from an invalid string", () => {
		expect(() => MACAddress8.from("08:00:2b:01:02:03:04:05:06:07")).toThrowError("Invalid MACAddress8, too many octets");
		expect(() => MACAddress8.from("08:00:2b:01:02:03")).toThrowError("Invalid MACAddress8, too few octets");
	});

	it("should create a MAC address from a number", () => {
		const address = MACAddress8.from(BigInt("576508035632137221"));
		expect(address).not.toBeNull();
	});

	it("should error when creating a MAC address from an invalid number", () => {
		expect(() => MACAddress8.from(BigInt("9576508035632137221"))).toThrowError("MACAddress8 must be 64-bit");
	});

	it("should create a MAC address from a object", () => {
		const address1 = MACAddress8.from({
			MACAddress8: "08:00:2b:01:02:03:04:05",
		});
		expect(address1).not.toBeNull();
		const address2 = MACAddress8.from({ MACAddress8: "08002b0102030405" });
		expect(address2).not.toBeNull();
	});

	it("should error when creating a MAC address from an invalid object", () => {
		expect(() => MACAddress8.from({ MACAddress8: 1 as any })).toThrowError("Invalid MACAddress8");
		expect(() => MACAddress8.from({ MACAddress8: "08002b01020304" })).toThrowError("Invalid MACAddress8, too few octets");
		expect(() => MACAddress8.from({ MACAddress8: "08:00:2b:01:02:03" })).toThrowError("Invalid MACAddress8, too few octets");
		expect(() => MACAddress8.from({ MACAddress8: "08002b010203040506" })).toThrowError("Invalid MACAddress8, too many octets");
		expect(() => MACAddress8.from({ MACAddress8: "08:00:2b:01:02:03:04:05:06:07" })).toThrowError("Invalid MACAddress8, too many octets");
		expect(() => MACAddress8.from({ MACAddress8: "08002b**02030405" })).toThrowError('Invalid MACAddress8, unrecognized character "*"');
		expect(() => MACAddress8.from({ MACAddress8: "08:00:2b:**:02:03:04:05" })).toThrowError('Invalid MACAddress8, unrecognized character "*"');
		expect(() => MACAddress8.from({ MACAddress8: ":00:2b:**:02:03:04:05" })).toThrowError(
			'Invalid MACAddress8, expected to find a hexadecimal number before ":"'
		);
		expect(() => MACAddress8.from({ MACAddress8: "08:00:2b:08b:02:03:04:05" })).toThrowError('Invalid MACAddress8, too many hexadecimal digits in "08b"');
		expect(() => MACAddress8.from({ MACAddress8: "08:00:2b:08:02:03:04:" })).toThrowError('Invalid MACAddress8, trailing ":"');
	});

	it("isMACAddress8()", () => {
		const address = MACAddress8.from("08:00:2b:01:02:03:04:05");
		expect(MACAddress8.isMACAddress8(address)).toBe(true);
		expect(MACAddress8.isMACAddress8({ MACAddress8: "08:00:2b:01:02:03:04:05" })).toBe(false);
	});

	it("toString()", () => {
		const address = MACAddress8.from("08:00:2b:01:02:03:04:05");
		expect(address.toString()).toBe("08:00:2b:01:02:03:04:05");
	});

	it("toLong()", () => {
		const address = MACAddress8.from("08:00:2b:01:02:03:04:05");
		expect(address.toLong()).toBe(BigInt("576508035632137221"));
	});

	it("toJSON()", () => {
		const address = MACAddress8.from("08:00:2b:01:02:03:04:05");
		expect(address.toJSON()).toEqual({
			MACAddress8: "08:00:2b:01:02:03:04:05",
		});
	});

	it("equals()", () => {
		const address = MACAddress8.from("08:00:2b:01:02:03:04:05");

		expect(address.equals(MACAddress8.from("08:00:2b:01:02:03:04:05"))).toBe(true);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:04:03:05"))).toBe(false);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:03:04:05").toJSON())).toBe(true);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:04:03:05").toJSON())).toBe(false);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:03:04:05").toLong())).toBe(true);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:04:03:05").toLong())).toBe(false);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:03:04:05").toString())).toBe(true);
		expect(address.equals(MACAddress8.from("08:00:2b:01:02:04:03:05").toString())).toBe(false);
	});

	it("get MACAddress8", () => {
		const address = MACAddress8.from("08:00:2b:01:02:04:03:05");
		expect(address.MACAddress8).toBe("08:00:2b:01:02:04:03:05");
	});

	it("set MACAddress8", () => {
		const address = MACAddress8.from("08:00:2b:01:02:04:03:05");
		address.MACAddress8 = "01:02:03:04:05:06:07:08";
		expect(address.MACAddress8).toBe("01:02:03:04:05:06:07:08");
		expect(() => (address.MACAddress8 = BigInt("576508035632137221") as any)).not.toThrowError();
		expect(() => (address.MACAddress8 = 1 as any)).toThrowError("Invalid MACAddress8");
		expect(() => (address.MACAddress8 = "01:02:03:04:05:06")).toThrowError("Invalid MACAddress8, too few octets");
		expect(() => (address.MACAddress8 = "01:02:03:04:05:06:07:08:09:10")).toThrowError("Invalid MACAddress8, too many octets");
		expect(() => (address.MACAddress8 = "01:02:03:**:05:06:07:08")).toThrowError('Invalid MACAddress8, unrecognized character "*"');
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "macaddr8.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestmacaddr8 (
					macaddr8 macaddr8 NULL,
					_macaddr8 _macaddr8 NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestmacaddr8 (macaddr8, _macaddr8)
				VALUES (
					'08:00:2b:01:02:03:04:05',
					'{08:00:2b:01:02:03:04:05, 01:02:03:04:05:06:07:08}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestmacaddr8
			`);

			expect(result.rows[0].macaddr8).toStrictEqual(MACAddress8.from("08:00:2b:01:02:03:04:05"));
			expect(result.rows[0]._macaddr8).toStrictEqual([MACAddress8.from("08:00:2b:01:02:03:04:05"), MACAddress8.from("01:02:03:04:05:06:07:08")]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestmacaddr8
		`);

		await client.end();

		if (error) throw error;
	});
});
