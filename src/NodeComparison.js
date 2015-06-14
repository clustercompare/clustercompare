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
	var intersection = Sets.intersect(leaveSet, node.getLeaveKeys()).size;

	if (!intersection) {
		// no way any node of this subtree could be similar to the other node
		return { similarity: 0, node: null };
	}

	var totalCount = Sets.merge(leaveSet, node.getLeaveKeys()).size;
	var similarity = intersection / totalCount;

	if (similarity == 1) {
		// already max
		return { similarity: 1, node: node };
	}

	var info = { similarity: similarity, node: node };
	for (var child of node.getChildren()) {
		var childInfo = getMaxSimilarityInfoOfLeaveSetToNode(leaveSet, child);
		if (childInfo.similarity > info.similarity) {
			info = childInfo;
		}
	}

	return info;
}
