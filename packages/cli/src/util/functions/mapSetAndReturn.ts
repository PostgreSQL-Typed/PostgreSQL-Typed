export function mapSetAndReturn<TKey, TValue>(
	map: {
		set(key: TKey, value: TValue): unknown;
	},
	key: TKey,
	value: TValue
) {
	map.set(key, value);
	return value;
}
