import VizItem from './VizItem';
import $ from 'jquery';

export default class VizContainer {
	_element;
	_viewModel;

	constructor(viewModel, containerSelector) {
		this._element = $('div').addClass('viz-container');
		var vizItems = model.trees.map(tree => new VizItem(tree, '#icicles', viewModel));
		$(containerSelector).click(function (e) {
			if (e.ctrlKey) {
				return;
			}
			viewModel.mainSelection.select(null);
		});
	}
}
