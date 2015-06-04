define(['InnerNode'], function(InnerNode) {
	function Cluster(data) {
		InnerNode.call(this, data);
	}

	Cluster.prototype = Object.create(InnerNode.prototype);

	return Cluster;
});
