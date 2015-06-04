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

	return Class;
});
