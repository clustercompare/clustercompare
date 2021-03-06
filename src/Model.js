import NodeFactory from './NodeFactory';
import EventEmitter from 'node-event-emitter';
import * as Sets from './Sets';
import Clusterings from './Clusterings';
import * as StringUtils from './StringUtils';

/*
 * Provides access to all clusterings and their nodes
 */
export default class Model extends EventEmitter {
	_trees = [];
	_isReady = false;

	constructor(project) {
		super();
		this._project = project || (location.search ? location.search.substring(1) : 'PMD');
		this._clusterings = new Clusterings();
		this._algorithms = this._clusterings.instanceKeys;
		this._nodeKeyMap = new Map();
		this._nodeIDMap = new Map();
		this._nodeFactory = new NodeFactory();
		this._allLeafKeys = new Set();
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
			tree.root.isPrimaryHierarchy = name == 'packages';
			tree.root.project = this._project;
			Sets.mergeInto(this._allLeafKeys, tree.root.leafKeys);
			this._collectNodes(tree.root);
			success(tree);
		});
	}

	_collectNodes(node) {
		this._nodeKeyMap.set(node.key, node);
		this._nodeIDMap.set(node.id, node);
		for (var child of node.children) {
			this._collectNodes(child);
		}
	}

	_onReady() {
		this.packagesTree.root.calculateGlobalIndices();
		for (let tree of this.couplingTrees) {
			tree.root.recursiveHierarchySort(this.packagesTree.root);
			tree.root.calculateGlobalIndices();
		}

		function compare(a, b) {
			if (a == 'packages') {
				return -1;
			}
			if (b == 'packages') {
				return 1;
			}
			return StringUtils.compare(a, b);
		}
		this._trees.sort((a, b) => compare(a.couplingConcept, b.couplingConcept));
		this._isReady = true;
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

	get leafKeys() {
		return this._allLeafKeys;
	}

	mapKeysToNodes(keys) {
		var nodes = [];
		for (var key of keys) {
			nodes.push(this._nodeKeyMap.get(key));
		}
		return nodes;
	}

	getNodeByKey(key) {
		return this._nodeKeyMap.get(key);
	}

	getNodeByID(id) {
		return this._nodeIDMap.get(id);
	}

	get clusterings() {
		return this._clusterings;
	}

	get isReady() {
		return this._isReady;
	}

	loadMatrix(name, callback) {
		d3.json("data/" + this._project + "/" + name + ".matrix.json", (error, matrix) => {
			if (error) {
				console.log(error);
				return;
			}
			callback(matrix);
		});
	}

	get commonClassNamePrefixLength() {
		if (this._commonClassNamePrefixLength === undefined)  {
			let commonPrefix = null;
			for (let className of this.packagesTree.root.leavesInOrder.map(l => l.data.qualifiedName)) {
				if (commonPrefix === null) {
					commonPrefix = className;
				} else if (commonPrefix.indexOf(className) != 0) {
					// need to shorten
					for (let i = 0; i < commonPrefix.length; i++) {
						if (className[i] != commonPrefix[i]) {
							commonPrefix = commonPrefix.substr(0, i);
							break;
						}
					}
				}
			}
			this._commonClassNamePrefixLength = commonPrefix.length;
		}
		return this._commonClassNamePrefixLength;
	}

	get project() {
		return this._project;
	}
}
