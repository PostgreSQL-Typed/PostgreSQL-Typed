export const pad = (num: number, places = 2): string => {
	return num.toString().padStart(places, "0");
};
