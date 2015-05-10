var project = location.search ? location.search.substring(1) : 'PMD';

fetchTree('packages', function(packages) {
	fetchTree('SD.Use', function(other) {
		createIcicle(packages, '#icicles');
		createIcicle(other, '#icicles', packages);
	});
});

function fetchTree(coupling, success) {
	d3.json("data/" + project + "/" + coupling + ".json", function(error, tree) {
		if (error) {
			console.log(error);
			return;
		}
		tree.root = new Node(tree.root);
		success(tree);
	});
}

$('#project').change(function() {
	project = $(this).val();
	location.search = '?' + project;
	//update();
});

$.get('data/projects.json', function(projects) {
	$('#project').empty().append(projects.projects.map(function(project) {
		return $('<option>').val(project.id).text(project.name)[0];
	}));
	$('#project').val(project);
});
