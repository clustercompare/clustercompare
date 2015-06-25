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
}
