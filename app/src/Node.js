import * as Utils from './Utils';
import Sets from './Sets';
	function Node(data) {
		this.data = data;

		this._children = [];
		this.children = this._children; // for d3 - but carefuly, might be removed by d3

		this._id = Utils.generateID();
	}


	// normalize nodes with one children the child itself
	Node.prototype.normalizeOnlyChilds = function () {
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
	};

	Node.prototype.getChildren = function () {
		return this._children;
	};

	/**
	 * Gets an identifier for this object that is unique across the entire graph. Multiple nodes may
	 * share a key if they represent the same object
	 */
	Node.prototype.getKey = function () {
		// default implementation - should be overriden if a node can occur in multiple graphs
		return this._id;
	};

	/**
	 * Gets an identifier for this node that is unique across the entire graph. Nodes do NOT share
	 * an id.
	 * @returns {*}
	 */
	Node.prototype.getID = function() {
		return this._id;
	};

	Node.prototype.isLeaf = function () {
		return !this._children.length;
	};

	Node.prototype.isRoot = function() {
		return !this.parent;
	};

	Node.prototype.getLabel = function () {
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

	Node.prototype.getDepth = function () {
		if (!this.getChildren().length) {
			return 1;
		}
		return 1 + Math.max.apply(null, this.getChildren().map(function (c) {
					return c.getDepth();
				}));
	}

	Node.prototype.getLeaveKeys = function () {
		if (!this._leaveKeys) {
			this._leaveKeys = this._generateLeaveKeySet();
		}
		return this._leaveKeys;
	};

	Node.prototype._generateLeaveKeySet = function () {
		var result = new Set();
		for (var child of this.getChildren()) {
			for (var leaveKey of child.getLeaveKeys()) {
				result.add(leaveKey);
			}
		}
		return result;
	};

	Node.prototype.getNodes = function () {
		if (!this._nodes) {
			this._nodes = [this];
			for (var child of this.getChildren()) {
				this._nodes = this._nodes.concat(child.getNodes());
			}
		}
		return this._nodes;
	};

	Node.prototype.getMaxSimilarity = function (otherNode) {
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
	};


	export default Node;

