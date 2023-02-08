export const pad = (number: number, places = 2): string => {
	// Pad a number with leading zeros (even if has a decimal point)
	// e.g. pad(1) === "01"
	// e.g. pad(1, 3) === "001"
	// e.g. pad(1.1) === "01.1"
	const numberString = String(number),
		decimalIndex = numberString.indexOf(".");
	if (decimalIndex === -1) return numberString.padStart(places, "0");
	const [int, dec] = numberString.split(".");
	return `${int.padStart(places, "0")}.${dec}`;
};
