import Class from './Class';
import Cluster from './Cluster';
import Package from './Package';
import RootNode from './RootNode';
import * as StringUtils from './StringUtils';
import * as TreeUtils from './TreeUtils';

export default class NodeFactory {
	constructor() {
		this._nodesByKey = new Map();
	}

	createNodeRecursively(nodeData, parent = null) {
		var clazz = NodeFactory.determineNodeClass(nodeData);
		var node = new clazz(nodeData, parent);
		var children = nodeData.children;
		for (let childData of children) {
			childData = TreeUtils.unpackOnlyChild(childData);
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
