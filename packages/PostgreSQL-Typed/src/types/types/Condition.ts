import type { FilterOperators } from "../interfaces/FilterOperators.js";

export type Condition<T> = T | FilterOperators<T>;
