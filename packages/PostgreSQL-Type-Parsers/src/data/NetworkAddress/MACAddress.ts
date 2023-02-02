import { parseInteger } from "jsprim";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface MACAddressObject {
	MACAddress: string;
}

interface MACAddress {
	toString(): string;
	toLong(): number;
	toJSON(): MACAddressObject;
	equals(otherMACAddress: string | number | MACAddress | MACAddressObject): boolean;

	MACAddress: string;
}

interface MACAddressConstructor {
	from(integer: number): MACAddress;
	from(data: MACAddress | MACAddressObject): MACAddress;
	from(str: string): MACAddress;
	/**
	 * Returns `true` if `obj` is a `MACAddress`, `false` otherwise.
	 */
	isMACAddress(obj: any): obj is MACAddress;
}

const MACAddress: MACAddressConstructor = {
	from(arg: string | number | MACAddress | MACAddressObject): MACAddress {
		if (typeof arg === "string" || typeof arg === "number") return new MACAddressClass(arg);
		else if (MACAddress.isMACAddress(arg)) return new MACAddressClass(arg.toJSON().MACAddress);
		else return new MACAddressClass(arg.MACAddress);
	},
	isMACAddress(obj: any): obj is MACAddress {
		return obj instanceof MACAddressClass;
	},
};

class MACAddressClass implements MACAddress {
	private _MACAddress: number;

	constructor(data: string | number) {
		switch (typeof data) {
			case "string":
				this._MACAddress = this._parseString(data);
				break;
			case "number":
				this._MACAddress = this._parseLong(data);
				break;
			default:
				throw new Error("Invalid MACAddress");
		}
	}

	private _parseLong(input: number): number {
		if (input !== Math.floor(input)) throw new Error("Invalid MACAddress");
		if (input < 0 || input > 0xffffffffffff) throw new Error("MACAddress must be 48-bit");
		return input;
	}

	private _parseString(input: string): number {
		input = input.toLowerCase();

		let position = 0,
			value = 0,
			octet = "",
			seperator: string | null = null,
			chr: string | undefined;

		function isDigit(c: string) {
			return /^[a-f0-9]$/.test(c);
		}

		function isSep(sep?: string) {
			if (seperator !== null) return sep === seperator;
			if (sep !== ":" && sep !== "-" && sep !== ".") return false;
			seperator = sep;
			return true;
		}

		function process() {
			if (octet.length === 0) throw new Error(`Invalid MACAddress, expected to find a hexadecimal number before ${JSON.stringify(seperator)}`);
			else if (octet.length > 2) throw new Error(`Invalid MACAddress, too many hexadecimal digits in ${JSON.stringify(octet)}`);
			else if (position < 6) {
				const tmp = parseInteger(octet, { base: 16 });
				if (tmp instanceof Error) throw new Error(`Invalid MACAddress, "${octet}" is not a valid hexadecimal number`);

				value *= 0x100;
				value += tmp;
				position += 1;
				octet = "";
			} else throw new Error("Invalid MACAddress, too many octets");
		}

		for (const element of input) {
			chr = element;
			if (isSep(chr)) process();
			else if (isDigit(chr)) octet += chr;
			else throw new Error(`Invalid MACAddress, unrecognized character ${JSON.stringify(chr)}`);
		}

		if (isSep(chr)) throw new Error(`Invalid MACAddress, trailing ${JSON.stringify(seperator)}`);

		if (position === 0) {
			if (octet.length < 12) throw new Error("Invalid MACAddress, too few octets");
			else if (octet.length > 12) throw new Error("Invalid MACAddress, too many octets");

			const tmp = parseInteger(octet, { base: 16 });
			if (tmp instanceof Error) throw new Error(`Invalid MACAddress, "${octet}" is not a valid hexadecimal number`);

			value = tmp;
		} else {
			process();
			if (position < 6) throw new Error("Invalid MACAddress, too few octets");
			else if (position > 6) throw new Error("Invalid MACAddress, too many octets");
		}
		return value;
	}

	toString(): string {
		let result = "";
		const fields = [
			/*
			 * JavaScript converts numbers to 32-bit integers when doing bitwise
			 * arithmetic, so we have to handle the first two parts of the number
			 * differently.
			 */
			(this._MACAddress / 0x010000000000) & 0xff,
			(this._MACAddress / 0x000100000000) & 0xff,

			(this._MACAddress >>> 24) & 0xff,
			(this._MACAddress >>> 16) & 0xff,
			(this._MACAddress >>> 8) & 0xff,
			this._MACAddress & 0xff,
		];

		for (const [i, field] of fields.entries()) {
			if (i !== 0) result += ":";

			const octet = field.toString(16);
			if (octet.length === 1) result += "0";
			result += octet;
		}

		return result;
	}

	toJSON(): MACAddressObject {
		return {
			MACAddress: this.toString(),
		};
	}

	toLong(): number {
		return this._MACAddress;
	}

	equals(otherMACAddress: string | number | MACAddress | MACAddressObject): boolean {
		if (typeof otherMACAddress === "string") return otherMACAddress.toLowerCase() === this.toString().toLowerCase();
		else if (typeof otherMACAddress === "number") return otherMACAddress === this.toLong();
		else if (MACAddress.isMACAddress(otherMACAddress)) return otherMACAddress.toString().toLowerCase() === this.toString().toLowerCase();
		else return otherMACAddress.MACAddress.toLowerCase() === this.toString().toLowerCase();
	}

	get MACAddress(): string {
		return this.toString();
	}

	set MACAddress(data: string) {
		switch (typeof data) {
			case "string":
				this._MACAddress = this._parseString(data);
				break;
			case "number":
				this._MACAddress = this._parseLong(data);
				break;
			default:
				throw new Error("Invalid MACAddress");
		}
	}
}

types.setTypeParser(DataType.macaddr as any, parser(MACAddress));
types.setTypeParser(DataType._macaddr as any, arrayParser(MACAddress, ","));

export { MACAddress, MACAddressObject };
