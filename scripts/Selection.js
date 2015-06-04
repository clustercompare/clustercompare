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

	Selection.prototype.addToSelection = function(node) {
		if (node == null) {
			return;
		}

		this.selectedKeys = Sets.merge(this.selectedKeys, node.getLeaveKeys());
		this.emit('change');
	};

	Selection.prototype.removeFromSelection = function(node) {
		if (node == null) {
			return;
		}

		this.selectedKeys = Sets.subtract(this.selectedKeys, node.getLeaveKeys());
		this.emit('change');
	};

	Selection.prototype.getSelectedKeys = function() {
		return this.selectedKeys;
	};

	Selection.prototype.isSelected = function(node) {
		return Sets.containsAll(this.getSelectedKeys(), node.getLeaveKeys());
	};

	return Selection;
});
