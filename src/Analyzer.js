import * as ArrayUtils from './ArrayUtils';

export default class Analyzer {
	constructor(model) {
		this.model = model;
	}

	countClusteringWins() {
		let trees = model.packagesTree.root.innerNodes.map(node => ArrayUtils.maxByValue(
			model.couplingTrees.map(tree => node.getMaxSimilarityInfo(tree.root)),
			info => info.similarity)); 
		return trees;

		return ArrayUtils.mapValues(ArrayUtils.groupBy(trees, tree => tree.root.clustering), list => list.length);
	}
}
