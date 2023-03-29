export const isJoinType = (
	value: any
): value is "CROSS" | "NATURAL" | "NATURAL INNER" | "NATURAL LEFT" | "NATURAL RIGHT" | "INNER" | "LEFT" | "RIGHT" | "FULL" | "FULL OUTER" =>
	["CROSS", "NATURAL", "NATURAL INNER", "NATURAL LEFT", "NATURAL RIGHT", "INNER", "LEFT", "RIGHT", "FULL", "FULL OUTER"].includes(value);
