import * as Utils from './Utils';
import * as Sets from './Sets';
import * as NodeComparison from './NodeComparison';
import {average} from './ArrayUtils';

/**
 * Base class of any node
 */
export default class Node {
	constructor(data, parent = null) {
		this.data = data;
		this._parent = parent;

		this._children = [];

		this._id = Utils.generateID();
	}

	get children() {
		return this._children;
	}

	get hasChildren() {
		return this._children.length > 0;
	}

	replaceChildren(arr) {
		this._children.length = 0;
		for (let child of arr) {
			this._children.push(child);
		}
	}

	/**
	 * Gets an identifier for this object that is unique across the entire graph. Multiple nodes may
	 * share a key if they represent the same object
	 */
	get key() {
		// default implementation - should be overriden if a node can occur in multiple graphs
		return this._id;
	}

	/**
	 * Gets an identifier for this node that is unique across the entire graph. Nodes do NOT share
	 * an id.
	 * @returns {*}
	 */
	get id() {
		return this._id;
	}

	get parent() {
		return this._parent;
	}

	get neighbors() {
		let arr = this.children.slice();
		if (!this.isRoot) {
			arr.push(this.parent);
		}
		return arr;
	}

	get isLeaf() {
		return !this.children.length;
	}

	get isRoot() {
		return !this.parent;
	}

	get descendantsAndThis() {
		return [this].concat(this.descendants);
	}

	get descendants() {
		if (!this.hasChildren) {
			return [];
		}
		return Array.concat.apply(null, this.children.map(node => node.descendantsAndThis));
	}

	get innerNodes() {
		return this.descendants.filter(node => !node.isLeaf);
	}

	/**
	 * Gets the label to be shown on hover
	 */
	get label() {
		return '';
	}

	/**
	 * Gets the label to be shown inside the node
	 */
	get shortLabel() {
		return this.label;
	}

	/**
	 * Determines at which position a child node occurs
	 */
	indexOfChild(node) {
		return this.children.indexOf(node);
	}

	/**
	 * Determines the position of this node in its parent
	 */
	get indexInParent() {
		if (this.isRoot) {
			return 0;
		}
		return this.parent.indexOfChild(this);
	}

	/**
	 * Sets the globalIndex property of this node and all its children
	 * @param offset the globalIndex of this node, omit if called on the root node
	 */
	calculateGlobalIndices(offset = 0) {
		this.globalIndex = offset;
		if (this.isLeaf) {
			return offset + 1;
		}

		for (var child of this.children) {
			offset = child.calculateGlobalIndices(offset);
		}
		return offset;
	}

	/**
	 * Gets the length of the longest path from the root to any leaf (including root and leaf)
	 * @returns {number}
	 */
	get height() {
		if (!this.children.length) {
			return 1;
		}
		return 1 + Math.max.apply(null, this.children.map(c => c.height));
	}

	/**
	 * Finds the root node
	 */
	get root() {
		if (this.isRoot) {
			return this;
		}
		return this.parent.root;
	}

	/**
	 * Gets a value that should be used for this node when sorting a tree recursively
	 */
	get sortOrder() {
		if (this._overriddenSortOrder) {
			return this._overriddenSortOrder;
		}
		return this.globalIndex;
	}

	/**
	 * Gets a set of the keys of leaf nodes
	 */
	get leafKeys() {
		if (!this._leafKeys) {
			this._leafKeys = this._generateLeafKeySet();
		}
		return this._leafKeys;
	}

	_generateLeafKeySet() {
		var result = new Set();
		for (var child of this.children) {
			for (var leafKey of child.leafKeys) {
				result.add(leafKey);
			}
		}
		return result;
	}

	/**
	 * Gets the leaf nodes of this node as Set
	 */
	get leaves() {
		if (!this._leaves) {
			this._leaves = this._generateLeafSet();
		}
		return this._leaves;
	}

	_generateLeafSet() {
		var result = new Set();
		if (this.isLeaf) {
			result.add(this);
		}
		for (var child of this.children) {
			for (var leaf of child.leaves) {
				result.add(leaf);
			}
		}
		return result;
	}

	/**
	 * Generates a map of a node key to the node object
	 */
	_generateKeyMap() {
		var result = new Map();
		for (let child of this.children) {
			result.set(child.key, child);
			for (let [key, value] of child.keyMap) {
				result.set(key, value);
			}
		}
		return result;
	}

	/**
	 * Gets a Map that maps node keys of descendants to node objects
	 */
	get keyMap() {
		if (!this._keyMap) {
			this._keyMap = this._generateKeyMap();
		}
		return this._keyMap;
	}

	/**
	 * Finds a node that is a descendant of this node by key
	 */
	getDescendantByKey(key) {
		return this.keyMap.get(key);
	}

	/**
	 * Gets all descendants
	 */
	get nodes() {
		if (!this._nodes) {
			this._nodes = [this];
			for (var child of this.children) {
				this._nodes = this._nodes.concat(child.nodes);
			}
		}
		return this._nodes;
	}

	/**
	 * Gets the maximum similarity of this node to the given other node or any of its descendants
	 */
	getMaxSimilarity(otherNode) {
<<<<<<< b238de7a6c3bd110a364e14f473752f0f4825ce7
		return this.getMaxSimilarityInfo(otherNode).similarity;
	}

	/**
	 * Gets the maximum similarity of this node to the given other node or any of its descendants
	 * @return { similarity, node, totalCount, intersection }
	 */
	getMaxSimilarityInfo(otherNode) {
		return NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(this.leaveKeys, otherNode);
=======
		return NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(this.leafKeys, otherNode).similarity;
>>>>>>> Fix typo leaveKeys -> leafKeys
	}

	bary(pi1Fn) {
		return average(Array.from(this.leaves).map(c => pi1Fn(c)));
	}

	/**
	 * Sorts the descendants of this node to most closely match the given other tree
	 */
	recursiveHierarchySort(otherRoot) {
		this._overriddenSortOrder = this.bary(n => {
			let otherNode = otherRoot.getDescendantByKey(n.key);
			if (otherNode) {
				return otherNode.globalIndex;
			}
			return 0;
		});
		for (let child of this.children) {
			child.recursiveHierarchySort(otherRoot);
		}
	}
}
