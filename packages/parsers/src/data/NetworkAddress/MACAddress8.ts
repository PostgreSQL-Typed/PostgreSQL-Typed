/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/oids";
import { parseInteger } from "jsprim";
import { types } from "pg";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";

interface MACAddress8Object {
	MACAddress8: string;
}

interface MACAddress8 {
	toString(): string;
	toLong(): bigint;
	toJSON(): MACAddress8Object;
	equals(otherMACAddress8: string | bigint | MACAddress8 | MACAddress8Object): boolean;

	MACAddress8: string;
}

interface MACAddress8Constructor {
	from(integer: bigint): MACAddress8;
	from(data: MACAddress8 | MACAddress8Object): MACAddress8;
	from(string: string): MACAddress8;
	/**
	 * Returns `true` if `object` is a `MACAddress8`, `false` otherwise.
	 */
	isMACAddress8(object: any): object is MACAddress8;
}

const MACAddress8: MACAddress8Constructor = {
	from(argument: string | bigint | MACAddress8 | MACAddress8Object): MACAddress8 {
		if (typeof argument === "string" || typeof argument === "bigint") return new MACAddress8Class(argument);
		else if (MACAddress8.isMACAddress8(argument)) return new MACAddress8Class(argument.toJSON().MACAddress8);
		else return new MACAddress8Class(argument.MACAddress8);
	},
	isMACAddress8(object: any): object is MACAddress8 {
		return object instanceof MACAddress8Class;
	},
};

class MACAddress8Class implements MACAddress8 {
	private _MACAddress8: bigint;

	constructor(data: string | bigint) {
		switch (typeof data) {
			case "string":
				this._MACAddress8 = this._parseString(data);
				break;
			case "bigint":
				this._MACAddress8 = this._parseLong(data);
				break;
			default:
				throw new Error("Invalid MACAddress8");
		}
	}

	private _parseLong(input: bigint): bigint {
		if (input < 0 || input > BigInt("9223372036854775807")) throw new Error("MACAddress8 must be 64-bit");

		return input;
	}
	private _isDigit(c: string) {
		return /^[\da-f]$/.test(c);
	}

	private _parseString(input: string): bigint {
		input = input.toLowerCase();

		let position = 0,
			value = BigInt(0),
			octet = "",
			seperator: string | null = null,
			chr: string | undefined;

		function isSeparator(separator?: string) {
			if (seperator !== null) return separator === seperator;
			if (separator !== ":" && separator !== "-" && separator !== ".") return false;
			seperator = separator;
			return true;
		}

		function process() {
			if (octet.length === 0) throw new Error(`Invalid MACAddress8, expected to find a hexadecimal number before ${JSON.stringify(seperator)}`);
			else if (octet.length > 2) throw new Error(`Invalid MACAddress8, too many hexadecimal digits in ${JSON.stringify(octet)}`);
			else if (position < 8) {
				const temporary = parseInteger(octet, { base: 16 });
				if (temporary instanceof Error) throw new Error(`Invalid MACAddress8, "${octet}" is not a valid hexadecimal number`);

				value *= BigInt(0x1_00);
				value += BigInt(temporary);
				position += 1;
				octet = "";
			} else throw new Error("Invalid MACAddress8, too many octets");
		}

		for (const element of input) {
			chr = element;
			if (isSeparator(chr)) process();
			else if (this._isDigit(chr)) octet += chr;
			else throw new Error(`Invalid MACAddress8, unrecognized character ${JSON.stringify(chr)}`);
		}

		if (isSeparator(chr)) throw new Error(`Invalid MACAddress8, trailing ${JSON.stringify(seperator)}`);

		if (position === 0) {
			if (octet.length < 16) throw new Error("Invalid MACAddress8, too few octets");
			else if (octet.length > 16) throw new Error("Invalid MACAddress8, too many octets");

			return this._parseString((octet.match(/.{1,2}/g) || []).join(":"));
		} else {
			process();

			if (position !== 8) throw new Error("Invalid MACAddress8, too few octets");
		}
		return value;
	}

	toString(): string {
		let result = "";
		const fields = [
			(this._MACAddress8 / BigInt("0x100000000000000")) & BigInt(0xff),
			(this._MACAddress8 / BigInt(0x1_00_00_00_00_00_00)) & BigInt(0xff),
			(this._MACAddress8 / BigInt(0x01_00_00_00_00_00)) & BigInt(0xff),
			(this._MACAddress8 / BigInt(0x00_01_00_00_00_00)) & BigInt(0xff),

			(this._MACAddress8 >> BigInt(24)) & BigInt(0xff),
			(this._MACAddress8 >> BigInt(16)) & BigInt(0xff),
			(this._MACAddress8 >> BigInt(8)) & BigInt(0xff),
			this._MACAddress8 & BigInt(0xff),
		];

		for (const [index, field] of fields.entries()) {
			if (index !== 0) result += ":";

			const octet = field.toString(16);
			if (octet.length === 1) result += "0";
			result += octet;
		}

		return result;
	}

	toJSON(): MACAddress8Object {
		return {
			MACAddress8: this.toString(),
		};
	}

	toLong(): bigint {
		return this._MACAddress8;
	}

	equals(otherMACAddress8: string | bigint | MACAddress8 | MACAddress8Object): boolean {
		if (typeof otherMACAddress8 === "string") return otherMACAddress8.toLowerCase() === this.toString().toLowerCase();
		else if (typeof otherMACAddress8 === "bigint") return otherMACAddress8 === this.toLong();
		else if (MACAddress8.isMACAddress8(otherMACAddress8)) return otherMACAddress8.toString().toLowerCase() === this.toString().toLowerCase();
		else return otherMACAddress8.MACAddress8.toLowerCase() === this.toString().toLowerCase();
	}

	get MACAddress8(): string {
		return this.toString();
	}

	set MACAddress8(data: string) {
		switch (typeof data) {
			case "string":
				this._MACAddress8 = this._parseString(data);
				break;
			case "bigint":
				this._MACAddress8 = this._parseLong(data);
				break;
			default:
				throw new Error("Invalid MACAddress8");
		}
	}
}

types.setTypeParser(OID.macaddr8 as any, parser(MACAddress8));
types.setTypeParser(OID._macaddr8 as any, arrayParser(MACAddress8, ","));

export { MACAddress8, MACAddress8Object };
