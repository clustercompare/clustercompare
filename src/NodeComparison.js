import * as Sets from './Sets'

export function getSimilarityOfLeaves(leaveSet1, leaveSet2) {
	var intersection = Sets.intersect(leaveSet1, leaveSet2).size;

	if (!intersection) {
		return 0;
	}

	var totalCount = Sets.merge(leaveSet1, leaveSet2).size;
	return intersection / totalCount;
}

export function getMaxSimilarityInfoOfLeaveSetToNode(leaveSet, node) {
	var info = { similarity: 0, node: null, totalCount: 0, intersection: 0 };
	var intersection = Sets.intersect(leaveSet, node.leaveKeys).size;
	if (!intersection) {
		// no way any node of this subtree could be similar to the other node
		return info;
	}

	// similarity of root nodes is never interesting
	if (!node.isRoot) {
		var totalCount = Sets.merge(leaveSet, node.leaveKeys).size;
		var similarity = intersection / totalCount;

		info = {
			similarity: similarity,
			node: node,
			totalCount: totalCount,
			intersection: intersection
		};
		if (similarity == 1) {
			// already max
			return info;
		}
	}

	for (var child of node.children) {
		var childInfo = getMaxSimilarityInfoOfLeaveSetToNode(leaveSet, child);
		if (childInfo.similarity > info.similarity) {
			info = childInfo;
		}
	}

	return info;
}
