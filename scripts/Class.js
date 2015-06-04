define(['Node'], function(Node) {
	function Class(data) {
		Node.call(this, data);
	}

	Class.prototype = Object.create(Node.prototype);

	Class.prototype.getKey = function() {
		return this.data.qualifiedName.replace(/\./g, '_');
	};

	Class.prototype.getLabel = function() {
		return this.data.qualifiedName;
	};

	Class.prototype._generateLeaveKeySet = function() {
		return new Set([this.getKey()]);
	};

	return Class;
});
