export function intersect(set1, set2) {
	var result = new Set();
	for (var value of set1) {
		if (set2.has(value)) {
			result.add(value);
		}
	}
	return result;
}

export function merge(set1, set2) {
	var result = new Set();
	for (let value of set1) {
		result.add(value);
	}
	for (let value of set2) {
		result.add(value);
	}
	return result;
}

export function mergeInto(setToModify, itemsToAdd) {
	for (var value of itemsToAdd) {
		setToModify.add(value);
	}
}

export function subtractFrom(setToModify, itemsToRemove) {
	for (var value of itemsToRemove) {
		setToModify.delete(value);
	}
}

export function subtract(left, right) {
	var result = new Set();
	for (var value of left) {
		if (!right.has(value)) {
			result.add(value);
		}
	}
	return result;
}

export function containsAll(outer, inner) {
	for (var value of inner) {
		if (!outer.has(value)) {
			return false;
		}
	}
	return true;
}

export function sorted(input) {
	var array = [];
	for (var value of input) {
		array.push(value);
	}
	array.sort();
	return new Set(array);
}

export function equal(a, b) {
	return containsAll(a, b) && containsAll(b, a);
}
