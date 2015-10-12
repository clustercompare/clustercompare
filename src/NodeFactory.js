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

	/**
	 * Creates instances of the correct classes of all the nodes in the given tree
	 */
	createNodeRecursively(nodeData, parent = null) {
		nodeData = TreeUtils.unpackOnlyChild(nodeData);
		var clazz = parent ? NodeFactory.determineNodeClass(nodeData) : RootNode;
		var node = new clazz(nodeData, parent);
		var children = nodeData.children;
		for (let childData of children) {
			node.children.push(this.createNodeRecursively(childData, node));
		}
		return node;
	}

	static determineNodeClass(nodeData) {
		if (nodeData.qualifiedName) {
			if (nodeData.children.length) {
				return Package;
			}
			return Class;
		}

		return Cluster;
	}
}
