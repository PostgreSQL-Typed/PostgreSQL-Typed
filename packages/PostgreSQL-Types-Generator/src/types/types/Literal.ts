type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// We want to ensure that a literal string/enum value is used:
// https://stackoverflow.com/a/56375136/272958
type CheckForUnion<T> = [T] extends [UnionToIntersection<T>] ? unknown : never;

/**
 * Only accept a single type, not a union of types
 */
export type Literal<TValue> = TValue & CheckForUnion<TValue>;
