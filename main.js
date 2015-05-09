var project = location.search ? location.search.substring(1) : 'PMD';

function addIcicle(coupling) {
	d3.json("data/" + project + "/" + coupling + ".json", function(error, tree) {
		createIcicle(tree, '#icicles');
	});
}

addIcicle('packages');
addIcicle('SD.Use');

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
