import type { OffsetDirection, OffsetDirectionType } from "./OffsetDirection";

export interface Offset {
	hour: number;
	minute: number;
	direction: OffsetDirection | OffsetDirectionType;
}
