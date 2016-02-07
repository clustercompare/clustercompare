/* global self */
importScripts('polyfill.js');

import * as NodeComparison from './NodeComparison';
import Node from './Node';
import Class from './Class';
import Cluster from './Cluster';
import Package from './Package';
import RootNode from './RootNode';

self.addEventListener('message', e => {
	let data = e.data;
	switch (data.command) {
		case 'analyze':
			let worker = new SimilarityProviderWorker(restorePrototypes(data.packagesRoot), restorePrototypes(data.clusteringRoots));
			worker.analyze();
			self.postMessage({ type: 'results', results: worker.results });
			break;
	}
});

class SimilarityProviderWorker {
	_analysisResultByClusteringKey = {};
	_packagesAnalysisResult = null;

	constructor(packagesRoot, clusteringRoots) {
		this._packagesRoot = packagesRoot;
		this._clusteringRoots = clusteringRoots;
	}

	analyze() {
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
			let currentInfo = {node: null, similarity: null};
			for (let clusteringRoot of this._clusteringRoots) {
				let similarityInfo = NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(packageNode.leafKeys, clusteringRoot);
				if (!similarityInfo || !similarityInfo.node) {
					continue;
				}

				if (currentInfo.similarity >= similarityInfo.similarity) {
					continue;
				}

				currentInfo = similarityInfo;
			}
			result.similarityInfoByNodeKey[packageNode.key] = currentInfo;
			if (currentInfo.node) {
				// back reference for similarity node
				result.winnerIDs[currentInfo.node.id] = true;
			}
		}
		return result;
	}

	get results() {
		return {
			analysisResultByClusteringKey: this._analysisResultByClusteringKey,
			packagesAnalysisResult: this._packagesAnalysisResult
		};
	}
}

function restorePrototypes(node) {
	if (typeof node != 'object' || !node || node instanceof Node) {
		return node;
	}

	let result = node;
	if ('constructorName' in node) {
		let constructor = getConstructor(node.constructorName);
		node.__proto__ = constructor.prototype;
		//result = Object.create(constructor.prototype);
	}
	for (let key in node) {
		if (node.hasOwnProperty(key)) {
			result[key] = restorePrototypes(node[key]);
		}
	}
	return result;
}

function getConstructor(name) {
	console.log(name);
	switch (name) {
		case 'Node':
			return Node;
		case 'RootNode':
			return RootNode;
		case 'Class':
			return Class;
		case 'Cluster':
			return Cluster;
		case 'Package':
			return Package;
		default:
			return Object;
	}
}
