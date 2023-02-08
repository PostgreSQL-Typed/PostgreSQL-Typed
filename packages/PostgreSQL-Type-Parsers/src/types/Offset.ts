import type { OffsetDirection, OffsetDirectionType } from "./OffsetDirection.js";

export interface Offset {
	hour: number;
	minute: number;
	direction: OffsetDirection | OffsetDirectionType;
}
