require.config({
	paths: {
		"EventEmitter": "../bower_components/eventEmitter/EventEmitter",
		"pako": "../bower_components/pako/dist/pako"
	}
});

define(['Icicle', 'Model', 'Selection', 'SelectionHistory'], function(Icicle, Model, Selection, SelectionHistory) {
	Model.on('ready', function() {
		var mainSelection = new Selection();
		var hoverSelection = new Selection();
		var selectionHistory = new SelectionHistory(Model.getLeaveKeys());

		var packagesTree = Model.getTree('packages');
		var icicles = [];
		icicles.push(new Icicle(packagesTree, '#icicles', function(node) {
			return Math.max.apply(null, Model.getCouplingTrees().map(function(tree) { return node.getMaxSimilarity(tree.root); }));
		}));
		Model.getCouplingTrees().forEach(function(tree) {
			icicles.push(new Icicle(tree, '#icicles', function(node) { return node.getMaxSimilarity(packagesTree.root) }));
		});

		icicles.forEach(function(icicle) {
			icicle.on('nodehover', function(node) {
				hoverSelection.select(node.isRoot() ? null : node);
			});
			icicle.on('mouseleave', function() {
				hoverSelection.select(null);
			});
			icicle.on('nodeclick', function(node, e) {
				if (e.ctrlKey) {
					if (node.isRoot()) {
						return;
					}
					if (mainSelection.isSelected(node)) {
						mainSelection.removeFromSelection(node);
					} else {
						mainSelection.addToSelection(node);
					}
				} else {
					mainSelection.select(node.isRoot()? null : node);
				}
			});
		});

		$('#icicles').click(function(e) {
			if (e.ctrlKey) {
				return;
			}
			mainSelection.select(null);
		});

		mainSelection.on('change', function() {
			icicles.forEach(function(icicle) {
				icicle.updateSelection('main', mainSelection.getSelectedKeys());
			});
			selectionHistory.push(mainSelection.getSelectedKeys());
		});
		hoverSelection.on('change', function() {
			icicles.forEach(function(icicle) {
				icicle.updateSelection('hover', hoverSelection.getSelectedKeys());
			});
		});

		selectionHistory.on('change', function(keys) {
			mainSelection.selectKeys(keys);
		});
		selectionHistory.init();
	});

	// project selection
	var project = location.search ? location.search.substring(1) : 'PMD';
	$('#project').change(function () {
		project = $(this).val();
		location.search = '?' + project;
		//update();
	});

	$.get('data/projects.json', function (projects) {
		$('#project').empty().append(projects.projects.map(function (project) {
			return $('<option>').val(project.id).text(project.name)[0];
		}));
		$('#project').val(project);
	});
});
