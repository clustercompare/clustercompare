import Selection from './Selection';
import EventEmitter from 'node-event-emitter';
import Model from './Model';
import ObservableList from './ObservableList';
import SimilarityProvider from './SimilarityProvider';

/**
 * Contains the model reference as well as information about the current view state
 */
export default class ViewModel extends EventEmitter {
	_mainSelection = new Selection();
	_hoverSelection = new Selection();
	_selectedClusterings = new ObservableList();
	_similarityProvider = new SimilarityProvider();
	_model = new Model();

	constructor() {
		super();
		this._model.on('ready', () => this.emit('ready'));
		this._selectedClusterings.items = [ 'SD.Agg', 'SD.Use', 'SD.Inh', 'FO.UseI', 'FO.UseE', 'CC.I', 'CO.Bin', 'EC.Conf', 'SS.LSI' ];

		let updateClusterings = () => {
		};
		this._model.on('ready', () => {
			this._similarityProvider.packagesRoot = this._model.packagesTree.root;
			this._updateClusteringsInSimilarityProvider();
		});
		this._selectedClusterings.on('change', () => {
			if (model.isReady) {
				this._updateClusteringsInSimilarityProvider();
			}
		});
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

	get similarityProvider() {
		return this._similarityProvider;
	}

	_updateClusteringsInSimilarityProvider() {
		this._similarityProvider.clusteringRoots = this._selectedClusterings.items
			.map(clusteringKey => this._model.getTree(clusteringKey).root);
	}
}
