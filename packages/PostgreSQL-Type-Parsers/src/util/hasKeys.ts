import { getParsedType, ParsedType } from "./getParsedType";

export const hasKeys = <T>(
	obj: object,
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
	const objKeys = Object.keys(obj),
		otherKeys = objKeys.filter(key => !keys.some(([k]) => k === key)),
		missingKeys = keys.filter(([k, v]) => !objKeys.includes(k) && !v.includes("undefined")).map(([k]) => k),
		invalidKeys = keys
			.map(
				([k, t]): {
					objectKey: string;
					expected: ParsedType | ParsedType[];
					received: ParsedType;
				} | null => {
					if (!(k in obj) && !t.includes("undefined")) {
						return {
							objectKey: k,
							expected: t,
							received: "undefined",
						};
					}
					const objType = getParsedType((obj as Record<string, unknown>)[k]);
					if (Array.isArray(t) && t.includes(objType)) return null;
					else if (objType === t) return null;
					return {
						objectKey: k,
						expected: t,
						received: objType,
					};
				}
			)
			.filter((v): v is Exclude<typeof v, null> => v !== null);

	if (otherKeys.length || missingKeys.length || invalidKeys.length) {
		return {
			success: false,
			otherKeys,
			missingKeys,
			invalidKeys,
		};
	}

	if (!objKeys.length) {
		return {
			success: false,
			otherKeys,
			missingKeys: keys.map(([k]) => k),
			invalidKeys,
		};
	}
	return {
		success: true,
		obj: obj as T,
	};
};
