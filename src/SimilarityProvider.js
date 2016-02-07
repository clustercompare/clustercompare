import * as NodeComparison from './NodeComparison';
import EventEmitter from 'node-event-emitter';

export default class SimilarityProvider extends EventEmitter {
	_packagesRoot = null;
	_clusteringRoots;
	_analysisResultByClusteringKey = {};
	_packagesAnalysisResult = null;
	_analyzed = false;
	_analyzing = false;
	_analysisScheduled = false;
	_model;

	constructor(model) {
		super();
		this._model = model;
	}

	set packagesRoot(packagesRoot) {
		this._packagesRoot = packagesRoot;
		this._analyzed = false;
		this._analyzeIfScheduled();
	}

	set clusteringRoots(clusteringRoots) {
		this._clusteringRoots = clusteringRoots;
		this._analyzed = false;
		this._analyzeIfScheduled();
	}

	scheduleAnalysis() {
		this._analysisScheduled = true;
		// try if it is possible right now
		this._analyze();
	}

	_analyzeIfScheduled() {
		if (this._analysisScheduled) {
			this._analyze();
		}
	}

	_analyze() {
		if (this._analyzed || this._analyzing) {
			return;
		}
		if (!this._packagesRoot || !this._clusteringRoots) {
			return;
		}
		this.emit('analyzing');
		this._analyzing = true;
		this._analysisScheduled = false;

		let worker = new Worker('assets/worker.js');
		worker.addEventListener('message', e => {
			let data = e.data;
			switch (data.type) {
				case 'results':
					this._analysisResultByClusteringKey = data.results.analysisResultByClusteringKey;
					this._packagesAnalysisResult = data.results.packagesAnalysisResult;
					this.emit('analyzed');
					this._analyzed = true;
					this._analyzing = false;
					this._analyzeIfScheduled();
					break;
			}
		});
		worker.postMessage({
			command: 'analyze',
			packagesRoot: this._packagesRoot,
			clusteringRoots: this._clusteringRoots
		});
	}

	_getAnalysisResult(clusteringRoot) {
		this._analyze();
		if (!this._analyzed) {
			return null;
		}
		return this._analysisResultByClusteringKey[clusteringRoot.clustering];
	}

	_getPackagesAnalysisResult() {
		this._analyze();
		if (!this._analyzed) {
			return null;
		}
		return this._packagesAnalysisResult;
	}

	getSimilarityInfo(node) {
		let info = this.getSimilarityInfo0(node);
		// map the nodes to real Node instances
		if (info && info.node) {
			info.node = this._model.getNodeByID(info.node._id);
		}
		return info;
	}

	getSimilarityInfo0(node) {
		if (node.isLeaf) {
			return { similarity: 0 };
		}

		if (node.root.isPrimaryHierarchy) {
			let result = this._getPackagesAnalysisResult();
			if (!result) {
				return null;
			}
			return result.similarityInfoByNodeKey[node.key];
		}

		let result = this._getAnalysisResult(node.root);
		if (!result) {
			return null;
		}
		let info = result.similarityInfoByNodeKey[node.key];
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
