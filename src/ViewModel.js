import Selection from './Selection';
import EventEmitter from 'node-event-emitter';
import Model from './Model';
import ObservableList from './ObservableList';

export default class ViewModel extends EventEmitter {
	_mainSelection = new Selection();
	_hoverSelection = new Selection();
	_selectedClusterings = new ObservableList();
	_model = new Model();

	constructor() {
		super();
		this._model.on('ready', () => this.emit('ready'));
		this._selectedClusterings.items = [ 'SD.Agg', 'SD.Use', 'SD.Inh', 'FO.UseI', 'FO.UseE', 'CC.I', 'CO.Bin', 'EC.Conf', 'SS.LSI' ];
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

	get selectedClusterings() {
		return this._selectedClusterings;
	}
}
