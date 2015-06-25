import $ from 'jquery';
import * as SourceBrowser from './SourceBrowser';
import * as NodeComparison from './NodeComparison';

var mainSelection;
var hoverSelection;
var trees;

export function init(data) {
	mainSelection = data.mainSelection;
	hoverSelection = data.hoverSelection;
	trees = data.trees;
}

export function update(data) {
	$('#selection-heading').text(makeSelectionHeading(data.selectedLeaves));

	$('#selection-class-list').empty();
	var classes = Array.from(data.selectedLeaves);
	classes.sort((a, b) => a.label < b.label);
	for (let clazz of classes) {
		$('#selection-class-list').append(
				$('<li>')
						.text(clazz.label)
						.click(() => SourceBrowser.showForClass(clazz))
		);
	}

	var similarityInfos = [];
	for (var tree of trees) {
		let info = NodeComparison.getMaxSimilarityInfoOfLeaveSetToNode(data.selectedLeaveKeys, tree.root);
		if (info.similarity > 0) {
			similarityInfos.push(info);
		}
	}
	similarityInfos.sort((a, b) => a.similarity < b.similarity); // sort reverse
	$('#selection-similarity-list').empty();
	for (let info of similarityInfos) {
		let title = info.node.label;
		if (info.node.root.clustering != 'packages') {
			title += ` of ${info.node.root.clustering}`;
		}
		var percent = Math.round(info.similarity * 100);
		var text = `${title}: ${percent}% (${info.intersection} of ${info.totalCount})`;

		$('#selection-similarity-list').append(
				$('<li>')
					.text(text)
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

