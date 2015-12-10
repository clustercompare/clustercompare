import * as ArrayUtils from './ArrayUtils';

export default class Analyzer {
	constructor(model) {
		this.model = model;
	}

	countClusteringWins() {
		let infos = model.packagesTree.root.innerNodes.map(node => ArrayUtils.maxByValue(
			model.coupling3rees.map(tree => node.getMaxSimilarityInfo(tree.root)),
			info => info.similarity));
		return ArrayUtils.mapValues(ArrayUtils.groupBy(infos, info => info.node.root.clustering), list => list.length);
	}

	getClusteringWinsAsCSV() {
			let map = this.countClusteringWins();
			let result = '';
			let keys = model.clusterings.instances.map(i => i.key);
			let headerCSV = keys.join(',');
			let valuesCSV = keys.map(key => map[key] || 0).join(',');
			return headerCSV + "\n" + valuesCSV;
	}
}
