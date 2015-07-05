import NodeFactory from './NodeFactory';
import EventEmitter from 'node-event-emitter';
import * as Sets from './Sets';
import clusterings from './clusterings.json';

export default class Model extends EventEmitter {
	_trees = [];
	constructor() {
		super();
		this._project = location.search ? location.search.substring(1) : 'PMD';
		this._algorithms = clusterings;//['SD.Use', 'SD.Agg', 'CC.I', 'FO.AggE', 'CO.Bin', 'EC.Conf'];
		this._nodeKeyMap = new Map();
		this._nodeFactory = new NodeFactory();
		this._allLeaveKeys = new Set();
		this._load();
	}

	_load() {
		var treeNames = this._algorithms.slice(0);
		treeNames.push('packages');
		for (var name of treeNames) {
			this._fetchTree(name, tree => {
				this._trees.push(tree);
				if (this._trees.length == treeNames.length) {
					this._onReady();
				}
			});
		}
	}

	_fetchTree(name, success) {
		d3.json("data/" + this._project + "/" + name + ".json", (error, tree) => {
			if (error) {
				console.log(error);
				return;
			}
			tree.root = this._nodeFactory.createNodeRecursively(tree.root);
			tree.root.clustering = name;
			tree.root.project = this._project;
			Sets.mergeInto(this._allLeaveKeys, tree.root.leaveKeys);
			this._collectNodes(tree.root);
			success(tree);
		});
	}

	_collectNodes(node) {
		this._nodeKeyMap.set(node.key, node);
		for (var child of node.children) {
			this._collectNodes(child);
		}
	}

	_onReady() {
		this.emit('ready');
	}

	get trees() {
		return this._trees;
	}

	getTree(name) {
		var sel = this._trees.filter(t => t.couplingConcept == name);
		if (sel.length) {
			return sel[0];
		}
		throw new Error('Tree ' + name + ' does not exist');
	}

	get couplingTrees() {
		return this._trees.filter(tree => tree.couplingConcept != 'packages');
	}

	get packagesTree() {
		return this._trees.filter(tree => tree.couplingConcept == 'packages')[0];
	}

	get leaveKeys() {
		return this._allLeaveKeys;
	}

	mapKeysToNodes(keys) {
		var nodes = [];
		for (var key of keys) {
			nodes.push(this._nodeKeyMap.get(key));
		}
		return nodes;
	}
}
