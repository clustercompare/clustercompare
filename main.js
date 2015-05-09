var project = 'PMD';
var coupling = 'packages';

var icicle = new Icicle('#container');

function update() {
	d3.json("data/" + project + "/" + coupling + ".json", function(error, tree) {
		icicle.update(tree);
	});
}

update();

$('#coupling').change(function() {
	coupling = $(this).val();
	update();
});

$('#project').change(function() {
	project = $(this).val();
	update();
});

$.get('data/projects.json', function(projects) {
	$('#project').empty().append(projects.projects.map(function(project) {
		return $('<option>').val(project.id).text(project.name)[0];
	}))
});
