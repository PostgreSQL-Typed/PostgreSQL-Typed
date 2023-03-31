export interface FilterOperators<TValue> {
	$EQUAL?: TValue;
	$NOT_EQUAL?: TValue;
	$LESS_THAN?: TValue;
	$LESS_THAN_OR_EQUAL?: TValue;
	$GREATER_THAN?: TValue;
	$GREATER_THAN_OR_EQUAL?: TValue;
	$LIKE?: string;
	$NOT_LIKE?: string;
	$ILIKE?: string;
	$NOT_ILIKE?: string;
	$IN?: readonly TValue[];
	$NOT_IN?: readonly TValue[];
	$BETWEEN?: [TValue, TValue];
	$NOT_BETWEEN?: [TValue, TValue];
	$IS_NULL?: true;
	$IS_NOT_NULL?: true;
}
