import type { RootFilterOperators } from "../types/interfaces/RootFilterOperators";

export const isRootFilterOperator = <TSchema>(key: string): key is keyof RootFilterOperators<TSchema> => ["$AND", "$OR"].includes(key);
