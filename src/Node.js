import * as Utils from './Utils';
import * as Sets from './Sets';
import * as NodeComparison from './NodeComparison';

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

	get label() {
		return '';
	}

	get shortLabel() {
		return this.label;
	}

	indexOfChild(node) {
		return this.children.indexOf(node);
	}

	get indexInParent() {
		if (this.isRoot) {
			return 0;
		}
		return this.parent.indexOfChild(this);
	}

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

	get height() {
		if (!this.children.length) {
			return 1;
		}
		return 1 + Math.max.apply(null, this.children.map(c => c.height));
	}

	get root() {
		if (this.isRoot) {
			return this;
		}
		return this.parent.root;
	}

	get sortOrder() {
		if (this._overriddenSortOrder) {
			return this._overriddenSortOrder;
		}
		return this.globalIndex;
	}

	get leaveKeys() {
		if (!this._leaveKeys) {
			this._leaveKeys = this._generateLeaveKeySet();
		}
		return this._leaveKeys;
	}

	_generateLeaveKeySet() {
		var result = new Set();
		for (var child of this.children) {
			for (var leaveKey of child.leaveKeys) {
				result.add(leaveKey);
			}
		}
		return result;
	}

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

	get keyMap() {
		if (!this._keyMap) {
			this._keyMap = this._generateKeyMap();
		}
		return this._keyMap;
	}

	getDescendantByKey(key) {
		return this.keyMap.get(key);
	}

	get nodes() {
		if (!this._nodes) {
			this._nodes = [this];
			for (var child of this.children) {
				this._nodes = this._nodes.concat(child.nodes);
			}
		}
		return this._nodes;
	}

	getMaxSimilarity(otherNode) {
		return NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(this.leaveKeys, otherNode).similarity;
	}

	bary(pi1Fn) {
		return average(Array.from(this.leaves).map(c => pi1Fn(c)));
	}

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

function average(arr) {
	let sum = 0;
	let count = 0;
	for (var val of arr) {
		if (val !== null) {
			sum += val;
			count++;
		}
	}
	return sum / count;
}
