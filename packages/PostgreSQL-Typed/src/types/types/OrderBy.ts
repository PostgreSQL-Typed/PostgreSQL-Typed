export type OrderByDirection = "ASC" | "DESC";
export type OrderByNulls = "NULLS FIRST" | "NULLS LAST";

export type OrderBy = OrderByDirection | OrderByNulls | [OrderByDirection, OrderByNulls];
