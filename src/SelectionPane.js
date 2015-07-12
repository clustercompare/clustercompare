import $ from 'jquery';
import * as SourceBrowser from './SourceBrowser';
import * as NodeComparison from './NodeComparison';
import selectionTemplate from './templates/selection.hbs';

var mainSelection;
var hoverSelection;
var trees;

export function init(viewModel) {
	mainSelection = viewModel.mainSelection;
	hoverSelection = viewModel.hoverSelection;
	trees = viewModel.model.trees;
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
			intersection: info.intersection,
			totalCount: info.totalCount,
			clusterSize: info.node.leaveKeys.size
		}))
	};

	$('#selection-pane').html(selectionTemplate(viewData));

	return;

	for (let clazz of classes) {
		$('#selection-class-list').append(
				$('<li>')
						.text(clazz.label)
						.click(() => SourceBrowser.showForClass(clazz))
		);
	}

	$('#selection-similarity-list').empty();
	for (let info of similarityInfos) {
		let title = info.node.label;
		if (info.node.root.clustering != 'packages') {
			title += ` of ${info.node.root.clustering}`;
		}
		var percent = Math.round(info.similarity * 100);
		var text = `${title}: ${percent}% (${info.intersection} of ${info.totalCount})`;

		var bar = $('<span class="bar">').css('width', percent + '%');
		var barchart = $('<span class="tiny-barchart">').append(bar);

		$('#selection-similarity-list').append(
				$('<li>')
					.append(barchart, $('<span>').text(text))
					.mouseenter(() => { hoverSelection.select(info.node); })
					.mousemove(e => e.stopPropagation())
					.click(() => { mainSelection.select(info.node); }));
	}
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

