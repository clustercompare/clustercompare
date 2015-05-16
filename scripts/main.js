require.config({
	paths: {
		"EventEmitter": "../bower_components/eventEmitter/EventEmitter"
	}
});

define(['Icicle', 'Model'], function(Icicle, Model) {
	Model.on('ready', function() {
		var packagesTree = Model.getTree('packages');
		Icicle.create(packagesTree, '#icicles', function(node) {
			return Math.max.apply(null, Model.getCouplingTrees().map(function(tree) { return node.getMaxSimilarity(tree.root); }));
		});
		Model.getCouplingTrees().forEach(function(tree) {
			Icicle.create(tree, '#icicles', function(node) { return node.getMaxSimilarity(packagesTree.root) });
		});
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
