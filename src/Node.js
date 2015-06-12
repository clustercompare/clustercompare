import * as Utils from './Utils';
import * as Sets from './Sets';

export default class Node {
	constructor(data) {
		this.data = data;

		this._children = [];
		this.children = this._children; // for d3 - but carefuly, might be removed by d3

		this._id = Utils.generateID();
	}

	// normalize nodes with one children the child itself
	normalizeOnlyChilds() {
		if (this.getChildren().length == 1) {
			var onlyChild = this.getChildren()[0];
			this.getChildren().length = 0;
			for (var grandchild of onlyChild.getChildren()) {
				this.getChildren().push(grandchild);
			}
			this._leaveKeys = null;
		}
		for (var child of this.getChildren()) {
			child.normalizeOnlyChilds();
		}
	}

	getChildren() {
		return this._children;
	}

	/**
	 * Gets an identifier for this object that is unique across the entire graph. Multiple nodes may
	 * share a key if they represent the same object
	 */
	getKey() {
		// default implementation - should be overriden if a node can occur in multiple graphs
		return this._id;
	}

	/**
	 * Gets an identifier for this node that is unique across the entire graph. Nodes do NOT share
	 * an id.
	 * @returns {*}
	 */
	getID() {
		return this._id;
	}

	isLeaf() {
		return !this._children.length;
	}

	isRoot() {
		return !this.parent;
	}

	getLabel() {
		if (this.isLeaf()) {
			return this.qualifiedName;
		}
		if (!this.parent) {
			return 'root';
		}
		if (!this.parent.parent) {
			return this._key;
		}
		return this.parent.getLabel() + '.' + this._key;
	}

	getDepth() {
		if (!this.getChildren().length) {
			return 1;
		}
		return 1 + Math.max.apply(null, this.getChildren().map(function (c) {
					return c.getDepth();
				}));
	}

	getParent() {
		return this.parent;
	}

	getRoot() {
		if (this.isRoot()) {
			return this;
		}
		return this.getParent().getRoot();
	}

	getLeaveKeys() {
		if (!this._leaveKeys) {
			this._leaveKeys = this._generateLeaveKeySet();
		}
		return this._leaveKeys;
	}

	_generateLeaveKeySet() {
		var result = new Set();
		for (var child of this.getChildren()) {
			for (var leaveKey of child.getLeaveKeys()) {
				result.add(leaveKey);
			}
		}
		return result;
	}

	getNodes() {
		if (!this._nodes) {
			this._nodes = [this];
			for (var child of this.getChildren()) {
				this._nodes = this._nodes.concat(child.getNodes());
			}
		}
		return this._nodes;
	}

	getMaxSimilarity(otherNode) {
		var intersection = Sets.intersect(this.getLeaveKeys(), otherNode.getLeaveKeys()).size;

		if (!intersection) {
			// no way any node of this subtree could be similar to the other node
			return 0;
		}

		var totalCount = Sets.merge(this.getLeaveKeys(), otherNode.getLeaveKeys()).size;
		var similarity = intersection / totalCount;

		if (similarity == 1) {
			// already max
			return 1;
		}

		for (var child of otherNode.getChildren()) {
			similarity = Math.max(similarity, this.getMaxSimilarity(child))
		}

		return similarity;
	}
}
