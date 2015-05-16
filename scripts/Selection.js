define(['EventEmitter', 'Sets'], function(EventEmitter, Sets) {
	var Selection = new EventEmitter();

	var selectedKeys = new Set();
	var hoveredObject = null;

	Selection.select = function(object) {
		selectedKeys = object.getLeaveKeys();
		Selection.emit('change');
	};

	Selection.isSelected = function(object) {
		if (object.isLeaf()) {
			return selectedKeys.has(object.getKey());
		}
		return Sets.containsAll(selectedKeys, object.getLeaveKeys());
	};

	return Selection;
});
