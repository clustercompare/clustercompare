import VizItem from './VizItem';
import $ from 'jquery';

export default class VizContainer {
	_element;
	_viewModel;
	_items;

	constructor(viewModel, containerSelector) {
		this._element = $('<div>').addClass('viz-container').appendTo($(containerSelector));
		this._items = model.trees.map(tree => new VizItem(tree, this._element[0], viewModel));
		$(containerSelector).click(function (e) {
			if (e.ctrlKey) {
				return;
			}
			viewModel.mainSelection.select(null);
		});
		for (let vizItem of this._items) {
			vizItem.on("drag", e => {
				var hoveredItem = this._findItemAtPos(e.centerX, vizItem);
				if (hoveredItem) {
					e.moveBefore(hoveredItem.element);
				} else {
					e.moveAfter(this._element.children().filter(":not(.dragging):not(.placeholder)").last()[0]);
				}
			});
		}
	}

	_findItemAtPos(x, excluding) {
		for (let item of this._items) {
			if (item == excluding) {
				continue;
			}
			if ($(item.element).offset().left + $(item.element).width() / 2 >= x) {
				return item;
			}
		}
	}
}
