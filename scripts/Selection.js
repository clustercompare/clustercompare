define(['EventEmitter', 'Sets'], function(EventEmitter, Sets) {
	function Selection() {
		EventEmitter.call(this);

		this.selectedKeys = new Set();
	}

	Selection.prototype = Object.create(EventEmitter.prototype);

	Selection.prototype.select = function(object) {
		if (object == null) {
			this.selectedKeys = new Set();
		} else {
			this.selectedKeys = object.getLeaveKeys();
		}
		this.emit('change');
	};

	Selection.prototype.getSelectedKeys = function() {
		return this.selectedKeys;
	};

	return Selection;
});
