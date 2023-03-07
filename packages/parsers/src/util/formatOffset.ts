import type { Offset } from "../types/Offset.js";
import { OffsetDirection } from "../types/OffsetDirection.js";
import { pad } from "./pad.js";

export const formatOffset = (offset: Offset, options?: { returnZ?: boolean; returnEmpty?: boolean }): string => {
	const { hour, minute, direction } = offset;
	if (hour === 0 && minute === 0) {
		if (options?.returnZ) return "Z";
		if (options?.returnEmpty) return "";
		return "+00:00";
	}
	return `${direction === OffsetDirection.minus ? "-" : "+"}${pad(hour)}:${pad(minute)}`;
};
