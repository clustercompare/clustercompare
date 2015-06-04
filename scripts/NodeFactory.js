define(['Class', 'Cluster', 'Package', 'RootNode', 'StringUtils'], function(Class, Cluster, Package, RootNode, StringUtils) {
	function NodeFactory() {
		this._nodesByKey = new Map();
	}

	NodeFactory.prototype.createNodeRecursively = function(nodeData) {
		var self = this;
		var clazz = NodeFactory.determineNodeClass(nodeData);
		var node = new clazz(nodeData);
		nodeData.children.map(function (childData) {
			node.getChildren().push(self.createNodeRecursively(childData));
		});
		return node;
	};

	NodeFactory.determineNodeClass = function(nodeData) {
		if (nodeData.qualifiedName == 'root') {
			return RootNode;
		}

		if (nodeData.qualifiedName) {
			return Class;
		}

		if (StringUtils.isNumeric(nodeData.key)) {
			return Cluster;
		}

		return Package;
	};

	return NodeFactory;
});
