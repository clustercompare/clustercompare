define(['EventEmitter', 'Sets'], function(EventEmitter, Sets) {
	function Selection() {
		EventEmitter.call(this);

		this.selectedKeys = new Set();
	}

	Selection.prototype = Object.create(EventEmitter.prototype);

	Selection.prototype.selectKeys = function(keys) {
		this.selectedKeys = keys;
		this.emit('change');
	};

	Selection.prototype.select = function(object) {
		if (object == null) {
			this.selectKeys(new Set());
		} else {
			this.selectKeys(object.getLeaveKeys());
		}
	};

	Selection.prototype.addToSelection = function(node) {
		if (node == null) {
			return;
		}

		this.selectKeys(Sets.merge(this.selectedKeys, node.getLeaveKeys()));
	};

	Selection.prototype.removeFromSelection = function(node) {
		if (node == null) {
			return;
		}

		this.selectKeys(Sets.subtract(this.selectedKeys, node.getLeaveKeys()));
	};

	Selection.prototype.getSelectedKeys = function() {
		return this.selectedKeys;
	};

	Selection.prototype.isSelected = function(node) {
		return Sets.containsAll(this.getSelectedKeys(), node.getLeaveKeys());
	};

	return Selection;
});
