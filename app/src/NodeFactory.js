import Class from './Class';
import Cluster from './Cluster';
import Package from './Package';
import RootNode from './RootNode';
import * as StringUtils from './StringUtils';

function unpackOnlyChilds(nodes) {
	if (nodes.length == 1) {
		return unpackOnlyChilds(nodes[0].children);
	}
	return nodes;
}

export default class NodeFactory {
	constructor() {
		this._nodesByKey = new Map();
	}

	createNodeRecursively(nodeData) {
		var self = this;
		var clazz = NodeFactory.determineNodeClass(nodeData);
		var node = new clazz(nodeData);
		var children = unpackOnlyChilds(nodeData.children);
		children.map(function (childData) {
			node.getChildren().push(self.createNodeRecursively(childData));
		});
		return node;
	}

	static determineNodeClass(nodeData) {
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
	}
}
