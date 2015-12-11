import * as NodeComparison from './NodeComparison';

export default class SimilarityProvider {
	_packagesRoot = null;
	_analysisResultByClusteringKey = {};
	_packagesAnalysisResult = null;
	_clusteringRoots;
	_winnerKeys = [];
	_analyzed = false;

	set packagesRoot(packagesRoot) {
		this._packagesRoot = packagesRoot;
		this._analyzed = false;
	}

	set clusteringRoots(clusteringRoots) {
		this._clusteringRoots = clusteringRoots;
		this._analyzed = false;
	}

	_analyze() {
		if (this._analyzed) {
			return;
		}
		// need to set this here because during analysis, the variable is checked
		this._analyzed = true;

		for (let clusteringRoot of this._clusteringRoots) {
			if (!(clusteringRoot.clustering in this._analysisResultByClusteringKey)) {
				this._analysisResultByClusteringKey[clusteringRoot.clustering] =
					this._analyzeClustering(clusteringRoot);
			}
		}
		this._packagesAnalysisResult = this._analyzePackages();
	}

	_analyzeClustering(clusteringRoot) {
		console.log('analyze ' + clusteringRoot.clustering);
		let result = {
			similarityInfoByNodeKey: {},
			similarityInfoByPackageNodeKey: {}
		};
		for (let node of clusteringRoot.descendantsAndThis) {
			// constant leaf set of clustering node, walks through complete packages tree
			let similarityInfo = NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(
				node.leafKeys, this._packagesRoot);
			result.similarityInfoByNodeKey[node.key] = similarityInfo;

			// collect by package node
			if (!similarityInfo.node) {
				continue;
			}
			let existingPackageEntry = result.similarityInfoByPackageNodeKey[similarityInfo.node.key];
			if (existingPackageEntry && existingPackageEntry.similarity >= similarityInfo.similarity) {
				// there is already a package in the clustering tree that matches the package better
				continue;
			}

			// store the other direction: packages node points to clustering node
			let mirroredSimilarityInfo = Object.create(similarityInfo);
			mirroredSimilarityInfo.node = node;
			result.similarityInfoByPackageNodeKey[similarityInfo.node.key] = mirroredSimilarityInfo;
		}
		return result;
	}

	_analyzePackages() {
		let result = {
			similarityInfoByNodeKey: {},
			winnerIDs: {}
		};

		for (let packageNode of this._packagesRoot.descendantsAndThis) {
			let currentInfo = { node: null, similarity: null };
			let clusteringResultOfWinner = null;
			for (let clusteringRoot of this._clusteringRoots) {
				let clusteringResult = this._getAnalysisResult(clusteringRoot);
				let similarityInfo = clusteringResult.similarityInfoByPackageNodeKey[packageNode.key];
				if (!similarityInfo || !similarityInfo.node) {
					continue;
				}

				if (currentInfo.similarity >= similarityInfo.similarity) {
					continue;
				}

				currentInfo = similarityInfo;
				clusteringResultOfWinner = clusteringResult;
			}
			result.similarityInfoByNodeKey[packageNode.key] = currentInfo;
			if (currentInfo.node) {
				// back reference for similarity node
				result.winnerIDs[currentInfo.node.id] = true;
			}
		}
		return result;
	}

	_getAnalysisResult(clusteringRoot) {
		this._analyze();
		return this._analysisResultByClusteringKey[clusteringRoot.clustering];
	}

	_getPackagesAnalysisResult() {
		this._analyze();
		return this._packagesAnalysisResult;
	}

	getSimilarityInfo(node) {
		if (node.root.isPrimaryHierarchy) {
			return this._getPackagesAnalysisResult().similarityInfoByNodeKey[node.key];
		}

		let info = this._getAnalysisResult(node.root).similarityInfoByNodeKey[node.key];
		info = Object.create(info);
		info.isWinner =  node.id in this._getPackagesAnalysisResult().winnerIDs;
		return info;
	}

	/**
	 * Gets the similarity value of a node
	 *  - if it is in the primary hierarchy, this is the maximum similarity to a node of any secondary hierarchy
	 *  - if it is in a secondary hierarchy, this is the maximum similarity to a node of the primary hierarchy
	 * @param node
	 */
	getSimilarityValue(node) {
		let info = this.getSimilarityInfo(node);
		if (!info) {
			return null;
		}
		return info.similarity;
	}

	/**
	 * Gets the
	 * @param node
	 */
	getMostSimilarNode(node) {
		let info = this.getSimilarityInfo(node);
		if (!info) {
			return null;
		}
		return info.node;
	}
}
