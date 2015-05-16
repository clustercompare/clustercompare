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

	return {
		intersect: intersect,
		merge: merge
	};
});
