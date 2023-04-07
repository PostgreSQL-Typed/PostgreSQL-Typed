export const joinTypes = ["CROSS", "NATURAL", "NATURAL INNER", "NATURAL LEFT", "NATURAL RIGHT", "INNER", "LEFT", "RIGHT", "FULL", "FULL OUTER"];

export const isJoinType = (
	value: any
): value is "CROSS" | "NATURAL" | "NATURAL INNER" | "NATURAL LEFT" | "NATURAL RIGHT" | "INNER" | "LEFT" | "RIGHT" | "FULL" | "FULL OUTER" =>
	joinTypes.includes(value);
