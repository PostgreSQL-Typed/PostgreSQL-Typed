import type { FilterOperators } from "../interfaces/FilterOperators";

export type Condition<T> = T | FilterOperators<T>;
