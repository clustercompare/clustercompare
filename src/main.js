import VizItem from './VizItem.js';
import ViewModel from './ViewModel.js';
import SelectionHistory from './SelectionHistory.js';
import * as SelectionPane from './SelectionPane.js';
import $ from 'jquery';

var viewModel = new ViewModel();
var model = viewModel.model;
window.model = model;
viewModel.on('ready', function () {
	var selectionHistory = new SelectionHistory(model.leaveKeys);

	SelectionPane.init(viewModel);

	var vizItems = model.trees.map(tree => new VizItem(tree, '#icicles', viewModel));

	$('#icicles').click(function (e) {
		if (e.ctrlKey) {
			return;
		}
		viewModel.mainSelection.select(null);
	});

	$('body').mousemove(function() {
		viewModel.hoverSelection.select(null);
	});

	viewModel.mainSelection.on('change', function () {
		selectionHistory.push(viewModel.mainSelection.selectedKeys);
		SelectionPane.update({
			selectedLeaves: model.mapKeysToNodes(viewModel.mainSelection.selectedKeys),
			selectedLeaveKeys: viewModel.mainSelection.selectedKeys
		});
	});

	selectionHistory.on('change', function (keys) {
		viewModel.mainSelection.selectKeys(keys);
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
