import Node from './Node';
	function InnerNode(data) {
		Node.call(this, data);
	}

	InnerNode.prototype = Object.create(Node.prototype);

	export default InnerNode;

