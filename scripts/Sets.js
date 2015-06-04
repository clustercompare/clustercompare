define(function() {
	function intersect(set1, set2) {
		var result = new Set();
		for (var value of set1) {
			if (set2.has(value)) {
				result.add(value);
			}
		}
		return result;
	}

	function merge(set1, set2) {
		var result = new Set();
		for (var value of set1) {
			result.add(value);
		}
		for (var value of set2) {
			result.add(value);
		}
		return result;
	}

	function mergeInto(setToModify, itemsToAdd) {
		for (var value of itemsToAdd) {
			setToModify.add(value);
		}
	}

	function subtractFrom(setToModify, itemsToRemove) {
		for (var value of itemsToRemove) {
			setToModify.delete(value);
		}
	}

	function subtract(left, right) {
		var result = new Set();
		for (var value of left) {
			if (!right.has(value)) {
				result.add(value);
			}
		}
		return result;
	}

	function containsAll(outer, inner) {
		for (var value of inner) {
			if (!outer.has(value)) {
				return false;
			}
		}
		return true;
	}

	function sorted(input) {
		var array = [];
		for (var value of input) {
			array.push(value);
		}
		array.sort();
		return new Set(array);
	}

	return {
		intersect: intersect,
		merge: merge,
		containsAll: containsAll,
		mergeInto: mergeInto,
		subtractFrom: subtractFrom,
		subtract: subtract,
		sorted: sorted
	};
});
