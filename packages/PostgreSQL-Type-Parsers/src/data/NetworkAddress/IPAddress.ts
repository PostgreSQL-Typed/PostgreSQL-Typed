import { Address4, Address6 } from "ip-address";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { IPVersion, IPVersionType } from "../../types/IPType";
import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface IPAddressObject {
	IPAddress: string;
}

interface IPAddress {
	toString(): string;
	toJSON(): IPAddressObject;
	equals(otherIPAddress: string | IPAddress | IPAddressObject): boolean;

	IPAddress: string;
	readonly IPAddressMinusSuffix: string;
	readonly version: IPVersion | IPVersionType;
	readonly subnet: string;
	readonly subnetMask: number;
	readonly startAddress: IPAddress;
	readonly endAddress: IPAddress;

	/**
	 * @param otherIPAddress The IP address to compare to.
	 * @returns `true` if the given IP address is in the subnet of this IP address.
	 */
	contains(otherIPAddress: string | IPAddress | IPAddressObject): boolean;

	toIPAddress4(): Address4 | null;
	toIPAddress6(): Address6 | null;
}

interface IPAddressConstructor {
	from(data: IPAddress | IPAddressObject): IPAddress;
	from(str: string): IPAddress;
	/**
	 * Returns `true` if `obj` is a `IPAddress`, `false` otherwise.
	 */
	isIPAddresss(obj: any): obj is IPAddress;
}

const IPAddress: IPAddressConstructor = {
	from(arg: string | IPAddress | IPAddressObject): IPAddress {
		if (typeof arg === "string") {
			return new IPAddressClass({
				IPAddress: arg,
			});
		} else if (IPAddress.isIPAddresss(arg)) return new IPAddressClass(arg.toJSON());
		else return new IPAddressClass(arg);
	},
	isIPAddresss(obj: any): obj is IPAddress {
		return obj instanceof IPAddressClass;
	},
};

class IPAddressClass implements IPAddress {
	private _IPAddress: Address4 | Address6;

	constructor(data: IPAddressObject) {
		try {
			this._IPAddress = new Address4(data.IPAddress);
			return;
		} catch {}
		try {
			this._IPAddress = new Address6(data.IPAddress);
			return;
		} catch {}
		throw new Error("Invalid IP Address string");
	}

	toString(): string {
		return this._IPAddress.address;
	}

	toJSON(): IPAddressObject {
		return {
			IPAddress: this._IPAddress.address,
		};
	}

	equals(otherIPAddress: string | IPAddress | IPAddressObject): boolean {
		if (typeof otherIPAddress === "string") return otherIPAddress.toLowerCase() === this._IPAddress.address.toLowerCase();
		else return otherIPAddress.IPAddress.toLowerCase() === this._IPAddress.address.toLowerCase();
	}

	get IPAddress(): string {
		return this._IPAddress.address;
	}

	set IPAddress(IPAddress: string) {
		try {
			this._IPAddress = new Address4(IPAddress);
			return;
		} catch {}
		try {
			this._IPAddress = new Address6(IPAddress);
			return;
		} catch {}
		throw new Error("Invalid IP Address");
	}

	get IPAddressMinusSuffix(): string {
		return this._IPAddress.addressMinusSuffix ?? this._IPAddress.address;
	}

	get version(): IPVersion | IPVersionType {
		return this._IPAddress.v4 ? IPVersion.IPv4 : IPVersion.IPv6;
	}

	get subnet(): string {
		return this._IPAddress.subnet;
	}

	get subnetMask(): number {
		return this._IPAddress.subnetMask;
	}

	get startAddress(): IPAddress {
		return IPAddress.from(this._IPAddress.startAddress().address);
	}

	get endAddress(): IPAddress {
		return IPAddress.from(this._IPAddress.endAddress().address);
	}

	contains(otherIPAddress: string | IPAddress | IPAddressObject): boolean {
		let address: Address4 | Address6;
		if (typeof otherIPAddress === "string") {
			try {
				address = new Address4(otherIPAddress);
			} catch {}
			try {
				address ??= new Address6(otherIPAddress);
			} catch {
				return false;
			}
		} else {
			try {
				address = new Address4(otherIPAddress.IPAddress);
			} catch {}
			try {
				address ??= new Address6(otherIPAddress.IPAddress);
			} catch {
				return false;
			}
		}

		return address.isInSubnet(this._IPAddress);
	}

	toIPAddress4(): Address4 | null {
		return this._IPAddress.v4 ? (this._IPAddress as Address4) : null;
	}

	toIPAddress6(): Address6 | null {
		return this._IPAddress.v4 ? null : (this._IPAddress as Address6);
	}
}

types.setTypeParser(DataType.inet as any, parser(IPAddress));
types.setTypeParser(DataType._inet as any, arrayParser(IPAddress, ","));
types.setTypeParser(DataType.cidr as any, parser(IPAddress));
types.setTypeParser(DataType._cidr as any, arrayParser(IPAddress, ","));

export { IPAddress, IPAddressObject };
