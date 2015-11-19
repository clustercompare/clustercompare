import VizItem from './VizItem';
import $ from 'jquery';

/**
 * A collection of VizItems; allows reordering and creates or removes items when ViewModel changes
 */
export default class VizContainer {
	_element;
	_viewModel;
	_items;
	_itemsByKey = {};

	constructor(viewModel, containerSelector) {
		this._viewModel = viewModel;
		this._element = $('<div>').addClass('viz-container').appendTo($(containerSelector));
		viewModel.selectedClusterings.on('change', () => this._reload());
		this._reload();

		$(containerSelector).click(function (e) {
			if (e.ctrlKey) {
				return;
			}
			viewModel.mainSelection.select(null);
		});
	}

	_reload() {
		this._element.children().detach(); // remove, but preserve event handlers
		this._items = this._viewModel.selectedClusterings.items.map(key => this._getOrCreateItem(key));
		this._items.unshift(this._getOrCreateItem('packages'));
		for (let item of this._items) {
			this._element.append(item.element);
		}
	}

	_getOrCreateItem(key) {
		let cacheKey = this._getCacheKey(key);
		if (cacheKey in this._itemsByKey) {
			return this._itemsByKey[cacheKey];
		}
		let item = new VizItem(this._viewModel.model.getTree(key), this._element[0], this._viewModel,
			{ enableDragging: key != 'packages'});

		item.on("drag", e => {
			this._viewModel.selectedClusterings.beginUpdate();
			var hoveredItem = this._findItemAtPos(e.centerX, item);
			if (hoveredItem) {
				e.moveBefore(hoveredItem.element);
				this._viewModel.selectedClusterings.moveBefore(key, hoveredItem.key);
			} else {
				e.moveAfter(this._element.children().filter(":not(.dragging):not(.placeholder)").last()[0]);
				this._viewModel.selectedClusterings.moveToEnd(key);
			}
		});
		item.on("drop", e => {
			this._viewModel.selectedClusterings.endUpdate();
		});
		this._itemsByKey[cacheKey] = item;
		return item;
	}

	_findItemAtPos(x, excluding) {
		for (let item of this._items) {
			if (item == excluding) {
				continue;
			}
			if (item.tree.couplingConcept == 'packages') {
				continue;
			}
			if ($(item.element).offset().left + $(item.element).width() / 2 >= x) {
				return item;
			}
		}
	}

	_getCacheKey(itemKey) {
		if (itemKey == 'packages') {
			return 'packages:' + this._viewModel.selectedClusterings.items.map(c => c.key).sort().join(',');
		}
		return itemKey;
	}
}
