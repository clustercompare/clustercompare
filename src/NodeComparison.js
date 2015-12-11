import * as Sets from './Sets'
import LimitedPriorityQueue from './LimitedPriorityQueue.js';

export function getSimilarityOfLeaves(leafSet1, leafSet2) {
	var intersection = Sets.intersect(leafSet1, leafSet2).size;

	if (!intersection) {
		return 0;
	}

	var totalCount = Sets.merge(leafSet1, leafSet2).size;
	return intersection / totalCount;
}

export function getTopSimilaritiesOfLeaveSetToNode(leafSet, node, limit) {
	let queue = new LimitedPriorityQueue(info => info.similarity, limit);
	getTopSimilaritiesOfLeaveSetToNodeInternal(leafSet, node, queue);
	return queue.items;
}

export function getSimilaritiesAboveThresholdOfLeaveSetToNode(leafSet, node, threshold) {
	let items = getTopSimilaritiesOfLeaveSetToNode(leafSet, node, Math.ceil(1 / threshold));
	items = items.filter(item => item.similarity >= threshold);
	return items;
}

function getTopSimilaritiesOfLeaveSetToNodeInternal(leafSet, node, queue) {
	var intersection = Sets.intersect(leafSet, node.leafKeys).size;
	if (!intersection) {
		// no way any node of this subtree could be similar to the other node
		return;
	}

	// no similarity to leaf nodes
	if (node.isLeaf) {
		return;
	}

	// similarity of root nodes is never interesting
	if (!node.isRoot) {
		var totalCount = Sets.merge(leafSet, node.leafKeys).size;
		var similarity = intersection / totalCount;

		queue.enqueue({
			similarity: similarity,
			node: node,
			totalCount: totalCount,
			intersection: intersection
		});
		if (similarity == 1) {
			// already max
			return;
		}
	}

	for (let child of node.children) {
		getTopSimilaritiesOfLeaveSetToNodeInternal(leafSet, child, queue);
	}
}

export function getMaxSimilarityInfoOfLeaveSetToNode(leafSet, node) {
	let items = getTopSimilaritiesOfLeaveSetToNode(leafSet, node, 1);
	if (!items.length) {
		return { similarity: 0, node: null, totalCount: 0, intersection: 0 };
	}
	return items[0];
}
