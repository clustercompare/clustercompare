import Selection from './Selection';
import EventEmitter from 'node-event-emitter';
import Model from './Model';

export default class ViewModel extends EventEmitter {
	_mainSelection = new Selection();
	_hoverSelection = new Selection();
	_model = new Model();

	constructor() {
		super();
		this._model.on('ready', () => this.emit('ready'));
	}

	get mainSelection() {
		return this._mainSelection;
	}

	get hoverSelection() {
		return this._hoverSelection;
	}

	get model() {
		return this._model;
	}
}
