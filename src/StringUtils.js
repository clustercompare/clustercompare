export function	isNumeric(string) {
	return string.match(/[0-9]*/) !== null;
}

export function getSubstringAfterLastOccurrence(string, deliminiter) {
	var index = string.lastIndexOf(deliminiter);
	if (index <= 0) {
		return string;
	}
	return string.substr(index + 1);
}

export function compare(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
}

export function repeat(string, count) {
	return Array(count + 1).join(string);
}

// A, B, ..., Z, ZA, ZB, ... ZZ, ZZA, ZZB, ... (0 = A)
export function numberToBase26(number) {
	let zs = Math.floor(number / 26);
	let lastDigit = number % 26;
	let lastLetter = String.fromCharCode('A'.charCodeAt(0) + lastDigit);
	return repeat('Z', zs) + lastLetter;
}
