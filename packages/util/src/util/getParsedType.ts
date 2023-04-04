import { BigNumber } from "bignumber.js";
import { DateTime } from "luxon";

import { arrayToEnum } from "./arrayToEnum.js";

export const ParsedType = arrayToEnum([
	"array",
	"bigint",
	"bigNumber",
	"boolean",
	"function",
	"globalThis.Date",
	"infinity",
	"luxon.DateTime",
	"map",
	"nan",
	"null",
	"number",
	"object",
	"promise",
	"set",
	"string",
	"symbol",
	"undefined",
	"unknown",
]);

export type ParsedType = keyof typeof ParsedType;

export const getParsedType = (data: any): ParsedType => {
	const t = typeof data;

	switch (t) {
		case "bigint":
			return ParsedType.bigint;
		case "boolean":
			return ParsedType.boolean;
		case "function":
			return ParsedType.function;
		case "number":
			return Number.isNaN(data) ? ParsedType.nan : Number.isFinite(data) ? ParsedType.number : ParsedType.infinity;
		case "string":
			return ParsedType.string;
		case "symbol":
			return ParsedType.symbol;
		case "object":
			if (Array.isArray(data)) return ParsedType.array;
			if (data === null) return ParsedType.null;
			if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return ParsedType.promise;
			if (typeof Map !== "undefined" && data instanceof Map) return ParsedType.map;
			if (typeof Set !== "undefined" && data instanceof Set) return ParsedType.set;
			if (typeof Date !== "undefined" && data instanceof Date) return ParsedType["globalThis.Date"];
			if (data instanceof DateTime) return ParsedType["luxon.DateTime"];
			if (BigNumber.isBigNumber(data)) return ParsedType.bigNumber;
			return ParsedType.object;
		case "undefined":
			return ParsedType.undefined;
	}
};
