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
	_similarityProvider;
	_model = new Model();

	constructor() {
		super();
		this._model.on('ready', () => this.emit('ready'));
		this._selectedClusterings.items = [ 'SD.Inh', 'SD.Agg', 'SD.Use', 'FO.InhI', 'FO.AggI', 'FO.UseI', 'EC.Sup', 'EC.Conf', 'CC.I', 'SS.Tfidf' ];
		this._similarityProvider = new SimilarityProvider(this._model);

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
