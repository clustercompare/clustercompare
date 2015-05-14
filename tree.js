function Node(data) {
	for (key of Object.getOwnPropertyNames(data)) {
		this[key] = data[key];
	}

	this.children = this.children.map(function (childData) {
		return new Node(childData)
	});
	this._children = this.children; // d3 likes to remove empty children properties
	this._key = this.key
}


// normalize nodes with one children the child itself
Node.prototype.normalizeOnlyChilds = function() {
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		child.normalizeOnlyChilds();
		if (child.children.length == 1) {
			var grandchild = this.children[i].children[0];
			if (!grandchild.isLeaf()) {
				grandchild._key = child._key + '.' + grandchild._key;
			}
			this.children[i] = grandchild;
		}
	}
};

Node.prototype.getChildren = function() {
	return this._children;
};

Node.prototype.getKey = function() {
	return this.qualifiedName;
};

Node.prototype.isLeaf = function() {
	return !this._children.length;
};

Node.prototype.getLabel = function() {
	if (this.isLeaf()) {
		return this.qualifiedName;
	}
	if (!this.parent) {
		return 'root';
	}
	if(!this.parent.parent) {
		return this._key;
	}
	return this.parent.getLabel() + '.' + this._key;
}

Node.prototype.getDepth = function() {
	if (!this.getChildren().length) {
		return 1;
	}
	return 1 + Math.max.apply(null, this.getChildren().map(function(c) { return c.getDepth(); }));
}

Node.prototype.getLeaveKeys = function(){
	if (!this._leaveKeys) {
		this._leaveKeys = this._generateLeaveKeySet();
	}
	return this._leaveKeys;
};

Node.prototype._generateLeaveKeySet = function() {
	if (!this.getChildren().length) {
		return new Set([this.getKey()]);
	}

	var result = new Set();
	for (var child of this.getChildren()) {
		for (var leaveKey of child.getLeaveKeys()) {
			result.add(leaveKey);
		}
	}
	return result;
};

Node.prototype.getNodes = function() {
	if (!this._nodes) {
		this._nodes = [ this ];
		for (var child of this.getChildren()) {
			this._nodes = this._nodes.concat(child.getNodes());
		}
	}
	return this._nodes;
};

Node.prototype.getMaxSimilarity = function(otherNode) {
	var intersection = intersect(this.getLeaveKeys(), otherNode.getLeaveKeys()).size;

	if (!intersection) {
		// no way any node of this subtree could be similar to the other node
		return 0;
	}

	var totalCount = merge(this.getLeaveKeys(), otherNode.getLeaveKeys()).size;
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

function intersect(set1, set2) {
	var result = new Set();
	for (var value of set1) {
		if (set2.has(value)) {
			result.add(value);
		}
	}
	return result;
}

function merge(set1, set2) {
	var result = new Set();
	for (var value of set1) {
		result.add(value);
	}
	for (var value of set2) {
		result.add(value);
	}
	return result;
}

