import Node from './Node';
	function RootNode(data) {
		Node.call(this, data);
	}

	RootNode.prototype = Object.create(Node.prototype);

	RootNode.prototype.getLabel = function() {
		return 'root';
	}

	export default RootNode;

