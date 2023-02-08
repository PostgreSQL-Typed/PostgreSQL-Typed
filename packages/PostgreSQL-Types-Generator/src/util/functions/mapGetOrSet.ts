import { mapSetAndReturn } from "../functions/mapSetAndReturn.js";

export function mapGetOrSet<TKey, TValue>(
	map: {
		get(key: TKey): TValue | undefined;
		set(key: TKey, value: TValue): unknown;
	},
	key: TKey,
	value: () => TValue
) {
	const cached = map.get(key);
	if (cached !== undefined) return cached;
	return mapSetAndReturn(map, key, value());
}
