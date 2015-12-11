import $ from 'jquery';
import * as SourceBrowser from './SourceBrowser';
import * as NodeComparison from './NodeComparison';
import selectionTemplate from './templates/selection.hbs';
import * as ColorGenerator from './ColorGenerator';

var mainSelection;
var hoverSelection;
var trees;
var model;
var viewModel;

export function init(viewModel_) {
	viewModel = viewModel_;
	mainSelection = viewModel.mainSelection;
	hoverSelection = viewModel.hoverSelection;
	trees = viewModel.model.trees;
	model = viewModel.model;
	update({selectedLeaves: new Set(), selectedLeafKeys: new Set()});
}

export function update(data) {
	let classes = Array.from(data.selectedLeaves);
	classes.sort((a, b) => a.label < b.label);

	let similarityInfoGroups = [];
	for (let tree of trees) {
		if (tree.couplingConcept != 'packages' && !viewModel.selectedClusterings.contains(tree.couplingConcept)) {
			continue;
		}
		let infos = NodeComparison.getSimilaritiesAboveThresholdOfLeaveSetToNode(data.selectedLeafKeys, tree.root, 1 / 3);
		if (infos.length) {
			similarityInfoGroups.push({
				bestSimilarity: infos[0].similarity,
				items: infos.map(info => ({
					clustering: tree.couplingConcept == 'packages' ? '' : tree.couplingConcept,
					clusteringColor: ColorGenerator.colorForClustering(tree.couplingConcept),
					similarity: info.similarity,
					node: info.node,
					percent: Math.round(info.similarity * 100),
					intersection: info.intersection,
					totalCount: info.totalCount,
					clusterSize: info.node.leaveKeys.size
				}))
			});
		}
	}

	// sort reversely by first entry per group
	similarityInfoGroups.sort((a, b) => b.bestSimilarity - a.bestSimilarity);

	let viewData = {
		selection: classes,
		singleSelection: classes.length == 1 ? classes[0] : null,
		clusters: similarityInfoGroups
	};

	let pane = $('#selection-pane');
	pane.html(selectionTemplate(viewData));

	pane.find('.class-item').click(function() {
		SourceBrowser.showForClass(model.getNodeByKey($(this).data('node')));
	});

	pane.find('.cluster-item')
			.mouseenter(function() {
				let node = model.getNodeByKey($(this).data('node'));
				hoverSelection.select(node, { selectClustering: true });
			})
			.mousemove(e => e.stopPropagation()) // prevent selection removal due to body.mousemove
			.click(function() {
				mainSelection.select(model.getNodeByKey($(this).data('node')));
			});
}

function makeSelectionHeading(leaves) {
	if (!leaves.length) {
		return "Nothing selected";
	}
	if (leaves.length == 1) {
		return leaves[0].label;
	}
	return leaves.length + " classes selected";
}

