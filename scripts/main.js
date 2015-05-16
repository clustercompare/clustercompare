define(['Icicle', 'Node'], function(Icicle, Node) {
	var project = location.search ? location.search.substring(1) : 'PMD';

	fetchTree('packages', function (packages) {
		packages.root.normalizeOnlyChilds();
		Icicle.create(packages, '#icicles');

		var others = ['SD.Use', 'SD.Agg', 'CC.I'];
		others.forEach(function (otherName) {
			fetchTree(otherName, function (other) {
				other.root.normalizeOnlyChilds();
				Icicle.create(other, '#icicles', packages);
			});
		});
	});

	function fetchTree(coupling, success) {
		d3.json("data/" + project + "/" + coupling + ".json", function (error, tree) {
			if (error) {
				console.log(error);
				return;
			}
			tree.root = new Node(tree.root);
			success(tree);
		});
	}

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
