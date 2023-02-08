/* eslint-disable unicorn/filename-case */
import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { MACAddress } from "./MACAddress.js";

describe.todo("MACAddress Class", () => {
	it("should create a MAC address from a string", () => {
		const address1 = MACAddress.from("08:00:2b:01:02:03");
		expect(address1).not.toBeNull();
		const address2 = MACAddress.from("08002b010203");
		expect(address2).not.toBeNull();
		const address3 = MACAddress.from("08.00.2b.01.02.03");
		expect(address3).not.toBeNull();
		const address4 = MACAddress.from("08-00-2b-01-02-03");
		expect(address4).not.toBeNull();
		expect(MACAddress.from(MACAddress.from("08:00:2b:01:02:03"))).not.toBeNull();
	});

	it("should error when creating a MAC address from an invalid string", () => {
		expect(() => MACAddress.from("08:00:2b:01:02:03:04:05")).toThrowError("Invalid MACAddress, too many octets");
		expect(() => MACAddress.from("08:00:2b:01")).toThrowError("Invalid MACAddress, too few octets");
	});

	it("should create a MAC address from a number", () => {
		const address = MACAddress.from(8_796_814_508_547);
		expect(address).not.toBeNull();
	});

	it("should error when creating a MAC address from an invalid number", () => {
		expect(() => MACAddress.from(1.5)).toThrowError("Invalid MACAddress");
		expect(() => MACAddress.from(998_796_814_508_547)).toThrowError("MACAddress must be 48-bit");
	});

	it("should create a MAC address from a object", () => {
		const address1 = MACAddress.from({ MACAddress: "08:00:2b:01:02:03" });
		expect(address1).not.toBeNull();
		const address2 = MACAddress.from({ MACAddress: "08002b010203" });
		expect(address2).not.toBeNull();
	});

	it("should error when creating a MAC address from an invalid object", () => {
		expect(() => MACAddress.from({ MACAddress: BigInt(1) as any })).toThrowError("Invalid MACAddress");
		expect(() => MACAddress.from({ MACAddress: "08002b0102" })).toThrowError("Invalid MACAddress, too few octets");
		expect(() => MACAddress.from({ MACAddress: "08:00:2b:01:02" })).toThrowError("Invalid MACAddress, too few octets");
		expect(() => MACAddress.from({ MACAddress: "08002b01020304" })).toThrowError("Invalid MACAddress, too many octets");
		expect(() => MACAddress.from({ MACAddress: "08:00:2b:01:02:03:04" })).toThrowError("Invalid MACAddress, too many octets");
		expect(() => MACAddress.from({ MACAddress: "08002b**0203" })).toThrowError('Invalid MACAddress, unrecognized character "*"');
		expect(() => MACAddress.from({ MACAddress: "08:00:2b:**:02:03" })).toThrowError('Invalid MACAddress, unrecognized character "*"');
		expect(() => MACAddress.from({ MACAddress: ":00:2b:**:02:03" })).toThrowError('Invalid MACAddress, expected to find a hexadecimal number before ":"');
		expect(() => MACAddress.from({ MACAddress: "08:00:2b:08b:02:03" })).toThrowError('Invalid MACAddress, too many hexadecimal digits in "08b"');
		expect(() => MACAddress.from({ MACAddress: "08:00:2b:08:02:03:" })).toThrowError('Invalid MACAddress, trailing ":"');
	});

	it("isMACAddress()", () => {
		const address = MACAddress.from("08:00:2b:01:02:03");
		expect(MACAddress.isMACAddress(address)).toBe(true);
		expect(MACAddress.isMACAddress({ MACAddress: "08:00:2b:01:02:03" })).toBe(false);
	});

	it("toString()", () => {
		const address = MACAddress.from("08:00:2b:01:02:03");
		expect(address.toString()).toBe("08:00:2b:01:02:03");
	});

	it("toLong()", () => {
		const address = MACAddress.from("08:00:2b:01:02:03");
		expect(address.toLong()).toBe(8_796_814_508_547);
	});

	it("toJSON()", () => {
		const address = MACAddress.from("08:00:2b:01:02:03");
		expect(address.toJSON()).toEqual({
			MACAddress: "08:00:2b:01:02:03",
		});
	});

	it("equals()", () => {
		const address = MACAddress.from("08:00:2b:01:02:03");

		expect(address.equals(MACAddress.from("08:00:2b:01:02:03"))).toBe(true);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:04"))).toBe(false);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:03").toJSON())).toBe(true);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:04").toJSON())).toBe(false);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:03").toLong())).toBe(true);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:04").toLong())).toBe(false);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:03").toString())).toBe(true);
		expect(address.equals(MACAddress.from("08:00:2b:01:02:04").toString())).toBe(false);
	});

	it("get MACAddress", () => {
		const address = MACAddress.from("08:00:2b:01:02:04");
		expect(address.MACAddress).toBe("08:00:2b:01:02:04");
	});

	it("set MACAddress", () => {
		const address = MACAddress.from("08:00:2b:01:02:04");
		address.MACAddress = "01:02:03:04:05:06";
		expect(address.MACAddress).toBe("01:02:03:04:05:06");
		expect(() => (address.MACAddress = 8_796_814_508_547 as any)).not.toThrowError();
		expect(() => (address.MACAddress = BigInt(1) as any)).toThrowError("Invalid MACAddress");
		expect(() => (address.MACAddress = "01:02:03:04")).toThrowError("Invalid MACAddress, too few octets");
		expect(() => (address.MACAddress = "01:02:03:04:05:06:07:08")).toThrowError("Invalid MACAddress, too many octets");
		expect(() => (address.MACAddress = "01:02:03:**:05:06")).toThrowError('Invalid MACAddress, unrecognized character "*"');
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "macaddr.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestmacaddr (
					macaddr macaddr NULL,
					_macaddr _macaddr NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestmacaddr (macaddr, _macaddr)
				VALUES (
					'08:00:2b:01:02:03',
					'{08:00:2b:01:02:03, 01:02:03:04:05:06}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestmacaddr
			`);

			expect(result.rows[0].macaddr).toStrictEqual(MACAddress.from("08:00:2b:01:02:03"));
			expect(result.rows[0]._macaddr).toStrictEqual([MACAddress.from("08:00:2b:01:02:03"), MACAddress.from("01:02:03:04:05:06")]);
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jestmacaddr
		`);

		await client.end();

		if (error) throw error;
	});
});
