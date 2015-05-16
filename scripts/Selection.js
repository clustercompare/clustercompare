define(['EventEmitter'], function(EventEmitter) {
	var Selection = new EventEmitter();

	var selectecdObject = null;
	var hoveredObject = null;

	Selection.select = function(object) {
		selectecdObject = object;
		Selection.emit('change');
	};

	Selection.isSelected = function(object) {
		if (!selectecdObject || !object) {
			return false;
		}

		return object.getKey() == selectecdObject.getKey();
	}

	return Selection;
});
