import InnerNode from './InnerNode';
	function Cluster(data) {
		InnerNode.call(this, data);
	}

	Cluster.prototype = Object.create(InnerNode.prototype);

	export default Cluster;

