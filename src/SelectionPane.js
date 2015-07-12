import $ from 'jquery';
import * as SourceBrowser from './SourceBrowser';
import * as NodeComparison from './NodeComparison';
import selectionTemplate from './templates/selection.hbs';
import * as ColorGenerator from './ColorGenerator';

var mainSelection;
var hoverSelection;
var trees;
var model;

export function init(viewModel) {
	mainSelection = viewModel.mainSelection;
	hoverSelection = viewModel.hoverSelection;
	trees = viewModel.model.trees;
	model = viewModel.model;
}

export function update(data) {
	let classes = Array.from(data.selectedLeaves);
	classes.sort((a, b) => a.label < b.label);

	let similarityInfos = [];
	for (let tree of trees) {
		let info = NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(data.selectedLeaveKeys, tree.root);
		if (info.similarity > 0) {
			similarityInfos.push(info);
		}
	}
	similarityInfos.sort((a, b) => b.similarity - a.similarity); // sort reverse

	let viewData = {
		selection: classes,
		singleSelection: classes.length == 1 ? classes[0] : null,
		clusters: similarityInfos.map(info => ({
			node: info.node,
			percent: Math.round(info.similarity * 100),
			clustering: info.node.root.clustering == 'packages' ? '' : info.node.root.clustering,
			clusteringColor: ColorGenerator.colorForClustering(info.node.root.clustering),
			intersection: info.intersection,
			totalCount: info.totalCount,
			clusterSize: info.node.leaveKeys.size
		}))
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

