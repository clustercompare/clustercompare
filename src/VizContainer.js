import VizItem from './VizItem';
import $ from 'jquery';

export default class VizContainer {
	_element;
	_viewModel;
	_items;

	constructor(viewModel, containerSelector) {
		this._element = $('<div>').addClass('viz-container');
		this._items = model.trees.map(tree => new VizItem(tree, '#icicles', viewModel));
		$(containerSelector).click(function (e) {
			if (e.ctrlKey) {
				return;
			}
			viewModel.mainSelection.select(null);
		});
		for (var vizItem of this._items) {
			vizItem.on("drag", e => {
				var hoveredItem = this._findItemAtPos(e.centerX);
				if (hoveredItem) {
					e.moveBefore(hoveredItem.element);
				} else {
					e.moveAfter(this._items[this._items.length - 1].element);
				}
			});
		}
	}

	_findItemAtPos(x) {
		for (var item of this._items) {
			if ($(item.element).offset().left + $(item.element).width() / 2 >= x) {
				return item;
			}
		}
	}
}
