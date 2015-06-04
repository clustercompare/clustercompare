define(['Node'], function(Node) {
	function RootNode(data) {
		Node.call(this, data);
	}

	RootNode.prototype = Object.create(Node.prototype);

	RootNode.prototype.getLabel = function() {
		return 'root';
	}

	return RootNode;
});
