import EventEmitter from 'node-event-emitter';
import BoundIcicle from './BoundIcicle';
import $ from 'jquery';

/**
 * The frame around an icicle that can be rearranged
 */
export default class VizItem extends EventEmitter {
	constructor(tree, containerSelector, viewModel) {
		super();
		this._element =  $('<div>').addClass('viz-item').appendTo($(containerSelector));
		this._element.append($('<h3>').text(tree.couplingConcept));
		var icicleContainer = $('<div>').addClass('icicle').appendTo(this._element);
		this._icicle = new BoundIcicle(tree, icicleContainer[0], viewModel);
	}
}
