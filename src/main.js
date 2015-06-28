import Icicle from './Icicle.js';
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

	var packagesTree = model.getTree('packages');
	var icicles = [];
	icicles.push(new Icicle(packagesTree, '#icicles', function (node) {
		return Math.max.apply(null, model.couplingTrees.map(function (tree) {
			return node.getMaxSimilarity(tree.root);
		}));
	}));
	model.couplingTrees.forEach(function (tree) {
		icicles.push(new Icicle(tree, '#icicles', function (node) {
			return node.getMaxSimilarity(packagesTree.root)
		}));
	});

	icicles.forEach(function (icicle) {
		icicle.on('nodehover', function (node) {
			viewModel.hoverSelection.select(node.isRoot ? null : node);
		});
		icicle.on('mouseleave', function () {
			viewModel.hoverSelection.select(null);
		});
		icicle.on('nodeclick', function (node, e) {
			if (e.ctrlKey) {
				if (node.isRoot) {
					return;
				}
				if (viewModel.mainSelection.isSelected(node)) {
					viewModel.mainSelection.removeFromSelection(node);
				} else {
					viewModel.mainSelection.addToSelection(node);
				}
			} else {
				viewModel.mainSelection.select(node.isRoot ? null : node);
			}
		});
	});

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
		icicles.forEach(function (icicle) {
			icicle.updateSelection('main', viewModel.mainSelection.selectedKeys);
		});
		selectionHistory.push(viewModel.mainSelection.selectedKeys);
		SelectionPane.update({
			selectedLeaves: model.mapKeysToNodes(viewModel.mainSelection.selectedKeys),
			selectedLeaveKeys: viewModel.mainSelection.selectedKeys
		});
	});
	viewModel.hoverSelection.on('change', function () {
		icicles.forEach(function (icicle) {
			icicle.updateSelection('hover', viewModel.hoverSelection.selectedKeys);
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
