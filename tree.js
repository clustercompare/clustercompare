function enrichTreeWithLeaveSets(root) {
	if (!root.children) {
		root.children = [];
	}

	if (!root.children.length) {
		root.leaves = [ root ];
	} else {
		root.leaves = flatten(children(root).map(enrichTreeWithLeaveSets));
	}

	return root.leaves;
}

function children(node) {
	return node.children ? node.children : [];
}

function nodesDiff(node1, node2) {
	var intersection = intersect(node1.leaves, node2.leaves).length;
	var totalCount = merge(node1.leaves, node2.leaves).length;
	console.log(node1.qualifiedName + ' vs. ' + node2.qualifiedName + ': ' + intersection + ' / ' + totalCount);
	return  intersection / totalCount;
}

function nodesInTree(root) {
	return [root].concat(flatten(children(root).map(nodesInTree)));
}

function flatten(arr) {
	if (!arr.length) {
		return [];
	}
	return arr.reduce(concat);
}

function concat(a, b) {
	return a.concat(b);
}

function nodeSimilarityToTree(node, tree) {
	return max(nodesInTree(tree).map(function(otherNode) { return nodesDiff(node, otherNode)}));
}

function max(arr) {
	return Math.max.apply(null, arr);
}

function intersect(set1, set2) {
	return set1.filter(function(a) { return set2.indexOf(a) >= 0; });
}

function merge(set1, set2) {
	return set1.concat(intersect(set1, set2));
}
