export const pad = (num: number, places = 2): string => {
	// Pad a number with leading zeros (even if has a decimal point)
	// e.g. pad(1) === "01"
	// e.g. pad(1, 3) === "001"
	// e.g. pad(1.1) === "01.1"
	const numStr = String(num),
		decimalIndex = numStr.indexOf(".");
	if (decimalIndex === -1) return numStr.padStart(places, "0");
	const [int, dec] = numStr.split(".");
	return `${int.padStart(places, "0")}.${dec}`;
};
