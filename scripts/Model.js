define(['NodeFactory', 'EventEmitter', 'Sets'], function(NodeFactory, EventEmitter, Sets) {
	var algorithms = ['SD.Use', 'SD.Agg', 'CC.I', 'FO.AggE', 'CO.Bin', 'EC.Conf'];
	var project = location.search ? location.search.substring(1) : 'PMD';
	var trees = [];
	var nodeFactory = new NodeFactory();
	var allLeaveKeys = new Set();

	function load() {
		var treeNames = algorithms.slice(0);
		treeNames.push('packages');
		treeNames.forEach(function(name) {
			fetchTree(name, function(tree) {
				trees.push(tree);
				if (trees.length == treeNames.length) {
					onReady();
				}
			});
		})
	}

	function fetchTree(name, success) {
		d3.json("data/" + project + "/" + name + ".json", function (error, tree) {
			if (error) {
				console.log(error);
				return;
			}
			tree.root = nodeFactory.createNodeRecursively(tree.root);
			Sets.mergeInto(allLeaveKeys, tree.root.getLeaveKeys());
			success(tree);
		});
	}

	function onReady() {
		Model.emit('ready');
	}

	var Model = new EventEmitter();

	Model.getTrees = function() { return trees; };

	Model.getTree = function(name) {
		var sel = trees.filter(function(t) { return t.couplingConcept == name});
		if (sel.length) {
			return sel[0];
		}
		throw new Error('Tree ' + name + ' does not exist');
	};

	Model.getCouplingTrees = function() {
		return trees.filter(function(tree) { return tree.couplingConcept != 'packages'; });
	};

	Model.getLeaveKeys = function() {
		return allLeaveKeys;
	};

	load();

	window.trees = trees;

	return Model;
});
