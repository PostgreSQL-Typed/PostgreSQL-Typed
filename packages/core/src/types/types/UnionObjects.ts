export type InnerObjectsToUnion<A extends object> = A[keyof A];

export type MergeUnionOfObjects<T extends object> = {
	[k in AllKeys<T>]: PickType<T, k>;
};

type AllKeys<T> = T extends any ? keyof T : never;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]: any } ? T[K] : never;
