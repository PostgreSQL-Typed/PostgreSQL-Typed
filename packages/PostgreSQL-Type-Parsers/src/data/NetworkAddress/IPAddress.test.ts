/* eslint-disable unicorn/filename-case */
import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { IPAddress } from "./IPAddress.js";

describe.todo("IPAddress Class", () => {
	it("should create a IP address from a string", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1).not.toBeNull();
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2).not.toBeNull();
		expect(IPAddress.from(IPAddress.from("192.168.100.128/25"))).not.toBeNull();
	});

	it("should error when creating a IP address from an invalid string", () => {
		expect(() => IPAddress.from("The Netherlands")).toThrowError("Invalid IP Address string");
	});

	it("should create a IP address from a object", () => {
		const ip1 = IPAddress.from({
			IPAddress: "192.168.100.128/25",
		});
		expect(ip1).not.toBeNull();
		const ip2 = IPAddress.from({
			IPAddress: "2001:db8:85a3:8d3:1319:8a2e:370:7348/64",
		});
		expect(ip2).not.toBeNull();
	});

	it("should error when creating a IP address from an invalid object", () => {
		expect(() =>
			IPAddress.from({
				IPAddress: "The Netherlands",
			})
		).toThrowError("Invalid IP Address string");
	});

	it("isIPAddresss()", () => {
		const ip = IPAddress.from("192.168.100.128/25");
		expect(IPAddress.isIPAddresss(ip)).toBe(true);
		expect(
			IPAddress.isIPAddresss({
				IPAddress: "192.168.100.128/25",
			})
		).toBe(false);
	});

	it("toString()", () => {
		const ip = IPAddress.from("192.168.100.128/25");
		expect(ip.toString()).toBe("192.168.100.128/25");
	});

	it("toJSON()", () => {
		const ip = IPAddress.from("192.168.100.128/25");
		expect(ip.toJSON()).toEqual({
			IPAddress: "192.168.100.128/25",
		});
	});

	it("equals()", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");

		expect(ip1.equals(IPAddress.from("192.168.100.128/25"))).toBe(true);
		expect(ip1.equals(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64"))).toBe(false);
		expect(ip1.equals(IPAddress.from("192.168.100.128/25").toJSON())).toBe(true);
		expect(ip1.equals(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64").toJSON())).toBe(false);
		expect(ip1.equals(IPAddress.from("192.168.100.128/25").toString())).toBe(true);
		expect(ip1.equals(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64").toString())).toBe(false);

		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");

		expect(ip2.equals(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64"))).toBe(true);
		expect(ip2.equals(IPAddress.from("192.168.100.128/25"))).toBe(false);
		expect(ip2.equals(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64").toJSON())).toBe(true);
		expect(ip2.equals(IPAddress.from("192.168.100.128/25").toJSON())).toBe(false);
		expect(ip2.equals(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64").toString())).toBe(true);
		expect(ip2.equals(IPAddress.from("192.168.100.128/25").toString())).toBe(false);
	});

	it("get IPAddress", () => {
		const ip = IPAddress.from("192.168.100.128/25");
		expect(ip.IPAddress).toBe("192.168.100.128/25");
	});

	it("set IPAddress", () => {
		const ip = IPAddress.from("192.168.100.128/25");
		ip.IPAddress = "2001:db8:85a3:8d3:1319:8a2e:370:7348/64";
		expect(ip.IPAddress).toBe("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(() => (ip.IPAddress = "The Netherlands")).toThrowError("Invalid IP Address");
	});

	it("get IPAddressMinusSuffix", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1.IPAddressMinusSuffix).toBe("192.168.100.128");
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.IPAddressMinusSuffix).toBe("2001:db8:85a3:8d3:1319:8a2e:370:7348");
		const ip3 = IPAddress.from("192.168.100.128");
		expect(ip3.IPAddressMinusSuffix).toBe("192.168.100.128");
		const ip4 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348");
		expect(ip4.IPAddressMinusSuffix).toBe("2001:db8:85a3:8d3:1319:8a2e:370:7348");
	});

	it("get version", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1.version).toBe("IPv4");
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.version).toBe("IPv6");
	});

	it("get subnet", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1.subnet).toBe("/25");
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.subnet).toBe("/64");
	});

	it("get subnetMask", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1.subnetMask).toBe(25);
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.subnetMask).toBe(64);
	});

	it("get startAddress", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1.startAddress.IPAddress).toBe(IPAddress.from("192.168.100.128").IPAddress);
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.startAddress.IPAddress).toBe(IPAddress.from("2001:0db8:85a3:08d3:0000:0000:0000:0000").IPAddress);
	});

	it("get endAddress", () => {
		const ip1 = IPAddress.from("192.168.100.128/25");
		expect(ip1.endAddress.IPAddress).toBe(IPAddress.from("192.168.100.255").IPAddress);
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.endAddress.IPAddress).toBe(IPAddress.from("2001:0db8:85a3:08d3:ffff:ffff:ffff:ffff").IPAddress);
	});

	it("contains()", () => {
		const ip1 = IPAddress.from("192.168.1.1/24");
		expect(ip1.contains(IPAddress.from("192.168.1.128"))).toBe(true);
		expect(ip1.contains(IPAddress.from("192.168.0.128"))).toBe(false);
		expect(ip1.contains("192.168.1.128")).toBe(true);
		expect(ip1.contains("192.168.0.128")).toBe(false);
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.contains(IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:8a2e"))).toBe(true);
		expect(ip2.contains(IPAddress.from("2001:db8:7348:8d3:1319:7348:370:7348"))).toBe(false);
		expect(ip2.contains("2001:db8:85a3:8d3:1319:8a2e:370:8a2e")).toBe(true);
		expect(ip2.contains("2001:db8:7348:8d3:1319:7348:370:7348")).toBe(false);
		expect(ip2.contains("The Netherlands")).toBe(false);
		expect(ip2.contains({ IPAddress: "The Netherlands" })).toBe(false);
	});

	it("toIPAddress4()", () => {
		const ip1 = IPAddress.from("192.168.1.1/24");
		expect(ip1.toIPAddress4()).not.toBeNull();
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.toIPAddress4()).toBeNull();
	});

	it("toIPAddress6()", () => {
		const ip1 = IPAddress.from("192.168.1.1/24");
		expect(ip1.toIPAddress6()).toBeNull();
		const ip2 = IPAddress.from("2001:db8:85a3:8d3:1319:8a2e:370:7348/64");
		expect(ip2.toIPAddress6()).not.toBeNull();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "ipaddress.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestipaddress (
					inet inet NULL,
					_inet _inet NULL,
          cidr cidr NULL,
          _cidr _cidr NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestipaddress (inet, _inet, cidr, _cidr)
				VALUES (
					'192.168.0/24',
					'{192.168.0/24, 2001:4f8:3:ba::/64}',
          '192.168.0/24',
					'{192.168.0/24, 2001:4f8:3:ba::/64}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestipaddress
			`);

			expect(result.rows[0].inet?.IPAddress).toStrictEqual(IPAddress.from("192.168.0.0/24").IPAddress);
			expect(result.rows[0]._inet).toStrictEqual([IPAddress.from("192.168.0.0/24").IPAddress, IPAddress.from("2001:4f8:3:ba::/64").IPAddress]);
			expect(result.rows[0].cidr?.IPAddress).toStrictEqual(IPAddress.from("192.168.0.0/24").IPAddress);
			expect(result.rows[0]._cidr).toStrictEqual([IPAddress.from("192.168.0.0/24").IPAddress, IPAddress.from("2001:4f8:3:ba::/64").IPAddress]);
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jestipaddress
		`);

		await client.end();

		if (error) throw error;
	});
});
