import Class from './Class';
import Cluster from './Cluster';
import Package from './Package';
import RootNode from './RootNode';
import * as StringUtils from './StringUtils';

function unpackOnlyChilds(nodes) {
	if (nodes.length == 1) {
		var node = nodes[0];
		for (var child of nodes[0].children) {
			child.key = node.key + '.' + child.key;
		}
		return unpackOnlyChilds(node.children);
	}
	return nodes;
}

export default class NodeFactory {
	constructor() {
		this._nodesByKey = new Map();
	}

	createNodeRecursively(nodeData, parent = null) {
		var clazz = NodeFactory.determineNodeClass(nodeData);
		var node = new clazz(nodeData, parent);
		var children = unpackOnlyChilds(nodeData.children);
		for (let childData of children) {
			node.children.push(this.createNodeRecursively(childData, node));
		}
		return node;
	}

	static determineNodeClass(nodeData) {
		if (nodeData.qualifiedName == 'root') {
			return RootNode;
		}

		if (nodeData.qualifiedName) {
			if (nodeData.children.length) {
				return Package;
			}
			return Class;
		}

		return Cluster;
	}
}
