define(['Node'], function(Node) {
	function InnerNode(data) {
		Node.call(this, data);
	}

	InnerNode.prototype = Object.create(Node.prototype);

	return InnerNode;
});
