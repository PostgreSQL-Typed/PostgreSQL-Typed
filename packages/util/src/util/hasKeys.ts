import { getParsedType, ParsedType } from "./getParsedType.js";

export const hasKeys = <T>(
	object: object,
	keys: readonly [string, ParsedType | ParsedType[]][]
):
	| {
			success: true;
			obj: T;
	  }
	| {
			success: false;
			otherKeys: string[];
			missingKeys: string[];
			invalidKeys: {
				objectKey: string;
				expected: ParsedType | ParsedType[];
				received: ParsedType;
			}[];
	  } => {
	const objectKeys = Object.keys(object),
		otherKeys = objectKeys.filter(key => !keys.some(([k]) => k === key)),
		missingKeys = keys.filter(([k, v]) => !objectKeys.includes(k) && !v.includes("undefined")).map(([k]) => k),
		invalidKeys = keys
			.map(
				([k, t]):
					| {
							objectKey: string;
							expected: ParsedType | ParsedType[];
							received: ParsedType;
					  }
					| undefined => {
					if (!(k in object) && !t.includes("undefined")) {
						return {
							objectKey: k,
							expected: t,
							received: "undefined",
						};
					}
					const objectType = getParsedType((object as Record<string, unknown>)[k]);
					if (Array.isArray(t) && t.includes(objectType)) return undefined;
					else if (objectType === t) return undefined;
					return {
						objectKey: k,
						expected: t,
						received: objectType,
					};
				}
			)
			.filter((v): v is Exclude<typeof v, undefined> => v !== undefined);

	if (otherKeys.length > 0 || missingKeys.length > 0 || invalidKeys.length > 0) {
		return {
			success: false,
			otherKeys,
			missingKeys,
			invalidKeys,
		};
	}

	if (objectKeys.length === 0) {
		return {
			success: false,
			otherKeys,
			missingKeys: keys.map(([k]) => k),
			invalidKeys,
		};
	}

	return {
		success: true,
		obj: object as T,
	};
};
