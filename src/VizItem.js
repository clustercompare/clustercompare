import EventEmitter from 'node-event-emitter';
import BoundIcicle from './BoundIcicle';
import $ from 'jquery';
import * as ColorGenerator from './ColorGenerator';

/**
 * The frame around an icicle that can be rearranged
 */
export default class VizItem extends EventEmitter {
	_dragging = false;
	_placeholder = null;
	_dragCursorStartX;
	_dragtElementStartX;
	_tree;

	constructor(tree, containerSelector, viewModel) {
		super();
		this._tree = tree;
		this._element =  $('<div>').addClass('viz-item').appendTo($(containerSelector));
		var color = ColorGenerator.colorForClustering(tree.couplingConcept);
		this._element.css('border-color', color);
		this._heading = $('<h3>').text(tree.couplingConcept).css('background-color', color);
		this._element.append(this._heading);
		var icicleContainer = $('<div>').addClass('icicle').appendTo(this._element);
		this._icicle = new BoundIcicle(tree, icicleContainer[0], viewModel);

		viewModel.hoverSelection.on('changeclustering', () => {
			this._element.toggleClass('hover', viewModel.hoverSelection.selectedClustering == tree.root)
		});

		this._heading.on('mousedown', e => this._startDrag(e));
	}

	get element() {
		return this._element[0];
	}

	get tree() {
		return this._tree;
	}

	_startDrag(e) {
		if (this._dragging) {
			return;
		}
		e.preventDefault();
		this._dragging = true;
		var offset = this._element.offset();
		this._placeholder = $('<div>').addClass('viz-item placeholder')
				.width(this._element.width())
				.height(this._element.height())
				.insertBefore(this._element);
		this._element.addClass('dragging');
		this._element.css({left: offset.left, top: offset.top});
		this._dragCursorStartX = e.pageX;
		this._dragElementStartX = offset.left;
		this._endDragFn = e => this._endDrag(e);
		this._dragFn = e => this._drag(e);
		$(document).on('mouseup', this._endDragFn);
		$(document).on('mousemove', this._dragFn);
	}

	_drag(e) {
		if (!this._dragging) {
			return;
		}
		e.preventDefault();

		var diff = e.pageX - this._dragCursorStartX;
		this._element.css({left: this._dragElementStartX + diff});
		this.emit('drag', {
			centerX: this._dragElementStartX + diff + this._element.width() / 2,
			moveBefore: elem => this._placeholder.insertBefore(elem),
			moveAfter: elem => this._placeholder.insertAfter(elem)
		});
	}

	_endDrag(e) {
		if (!this._dragging) {
			return;
		}
		this._element.insertBefore(this._placeholder);
		this._placeholder.remove();
		this._element.removeClass('dragging');
		this._dragging = false;
		$(document).off('mouseup', this._endDragFn);
		$(document).off('mousemove', this._dragFn);
		this._endDragFn = null;
		this._dragFn = null;
	}
}
