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
